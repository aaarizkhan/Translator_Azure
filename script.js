const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "paperglow-translator-settings";

const FALLBACK_LANGS = [
  ["auto", "Detect automatically"],
  ["en", "English"],
  ["hi", "Hindi"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
  ["ru", "Russian"],
  ["ar", "Arabic"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["zh-Hans", "Chinese Simplified"],
  ["zh-Hant", "Chinese Traditional"],
  ["tr", "Turkish"],
  ["nl", "Dutch"],
  ["pl", "Polish"],
  ["bn", "Bengali"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["mr", "Marathi"]
];

const state = {
  languages: FALLBACK_LANGS,
  settings: {
    endpoint: "https://api.cognitive.microsofttranslator.com",
    key: "",
    region: "",
    sourceLang: "auto",
    targetLang: "hi",
    docSourceLang: "auto",
    docTargetLang: "hi"
  }
};

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
}

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state.settings = { ...state.settings, ...saved };
    } catch {}
  }

  $("endpoint").value = state.settings.endpoint;
  $("key").value = state.settings.key;
  $("region").value = state.settings.region;
}

function setStatus(text) {
  $("status").textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function populateLanguageSelects() {
  const html = state.languages
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");

  $("sourceLang").innerHTML = html;
  $("targetLang").innerHTML = html;
  $("docSourceLang").innerHTML = html;
  $("docTargetLang").innerHTML = html;

  $("sourceLang").value = state.settings.sourceLang;
  $("targetLang").value = state.settings.targetLang;
  $("docSourceLang").value = state.settings.docSourceLang;
  $("docTargetLang").value = state.settings.docTargetLang;
}

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": $("key").value.trim(),
    "X-ClientTraceId": (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)
  };

  const region = $("region").value.trim();
  if (region) {
    headers["Ocp-Apim-Subscription-Region"] = region;
  }

  return headers;
}

function baseEndpoint() {
  return $("endpoint").value.trim().replace(/\/+$/, "");
}

async function loadAzureLanguages() {
  try {
    setStatus("Loading languages...");
    const url = `${baseEndpoint()}/languages?api-version=3.0&scope=translation,dictionary`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en"
      }
    });

    if (!res.ok) throw new Error(`Language load failed (${res.status})`);

    const data = await res.json();
    const translation = data.translation || {};
    const list = Object.entries(translation)
      .map(([code, info]) => [code, info.nativeName || info.name || code])
      .sort((a, b) => a[1].localeCompare(b[1]));

    state.languages = [["auto", "Detect automatically"], ...list];
    populateLanguageSelects();
    setStatus(`Loaded ${list.length} languages`);
  } catch (err) {
    console.error(err);
    state.languages = FALLBACK_LANGS;
    populateLanguageSelects();
    setStatus(`Using fallback languages (${err.message})`);
  }
}

async function translateText(text, fromLang, toLang) {
  const url = `${baseEndpoint()}/translate?api-version=3.0&to=${encodeURIComponent(toLang)}${fromLang && fromLang !== "auto" ? `&from=${encodeURIComponent(fromLang)}` : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify([{ Text: text }])
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Translate failed (${res.status}) ${body.slice(0, 160)}`);
  }

  return res.json();
}

function splitText(text, maxLen = 3800) {
  const chunks = [];
  let buffer = "";

  for (const paragraph of text.split(/\n\s*\n/)) {
    const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (next.length > maxLen && buffer) {
      chunks.push(buffer);
      buffer = paragraph;
    } else if (next.length > maxLen) {
      chunks.push(paragraph);
      buffer = "";
    } else {
      buffer = next;
    }
  }

  if (buffer) chunks.push(buffer);
  return chunks.length ? chunks : [text];
}

async function translateLargeText(text, fromLang, toLang) {
  const chunks = splitText(text);
  const out = [];

  for (const chunk of chunks) {
    const data = await translateText(chunk, fromLang, toLang);
    out.push(data?.[0]?.translations?.[0]?.text || "");
  }

  return out.join("\n\n");
}

async function onTranslateText() {
  const text = $("sourceText").value.trim();
  if (!text) {
    $("textOutput").textContent = "Please enter text first.";
    $("textOutput").classList.remove("empty");
    return;
  }

  try {
    setStatus("Translating text...");
    $("translateTextBtn").disabled = true;

    const result = await translateLargeText(text, $("sourceLang").value, $("targetLang").value);
    $("textOutput").classList.remove("empty");
    $("textOutput").innerHTML = escapeHtml(result);
    setStatus("Done");
  } catch (err) {
    console.error(err);
    $("textOutput").classList.remove("empty");
    $("textOutput").textContent = err.message;
    setStatus(err.message);
  } finally {
    $("translateTextBtn").disabled = false;
  }
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + "\n\n";
  }

  return text.trim();
}

async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return (result.value || "").trim();
}

async function extractFileText(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(file);
  if (name.endsWith(".docx")) return extractDocxText(file);
  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".html") || name.endsWith(".htm")) {
    return (await file.text()).trim();
  }

  return (await file.text()).trim();
}

async function onTranslateDocument() {
  let text = $("docText").value.trim();

  const file = $("docFile").files?.[0];
  if (file) {
    setStatus("Reading file...");
    try {
      const extracted = await extractFileText(file);
      if (extracted) text = extracted;
      $("docText").value = extracted;
    } catch (err) {
      console.error(err);
      $("docOutput").classList.remove("empty");
      $("docOutput").textContent = `File read failed: ${err.message}`;
      setStatus(`File read failed`);
      return;
    }
  }

  if (!text) {
    $("docOutput").classList.remove("empty");
    $("docOutput").textContent = "Please upload a file or paste document text first.";
    return;
  }

  try {
    setStatus("Translating document...");
    $("translateDocBtn").disabled = true;

    const result = await translateLargeText(text, $("docSourceLang").value, $("docTargetLang").value);
    $("docOutput").classList.remove("empty");
    $("docOutput").innerHTML = escapeHtml(result);
    setStatus("Done");
  } catch (err) {
    console.error(err);
    $("docOutput").classList.remove("empty");
    $("docOutput").textContent = err.message;
    setStatus(err.message);
  } finally {
    $("translateDocBtn").disabled = false;
  }
}

function wireTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.tab).classList.add("active");
    });
  });
}

function wireEvents() {
  $("saveBtn").addEventListener("click", () => {
    state.settings.endpoint = $("endpoint").value.trim();
    state.settings.key = $("key").value.trim();
    state.settings.region = $("region").value.trim();
    state.settings.sourceLang = $("sourceLang").value;
    state.settings.targetLang = $("targetLang").value;
    state.settings.docSourceLang = $("docSourceLang").value;
    state.settings.docTargetLang = $("docTargetLang").value;
    saveSettings();
    setStatus("Settings saved");
  });

  $("loadLangsBtn").addEventListener("click", loadAzureLanguages);
  $("translateTextBtn").addEventListener("click", onTranslateText);
  $("translateDocBtn").addEventListener("click", onTranslateDocument);

  $("clearTextBtn").addEventListener("click", () => {
    $("sourceText").value = "";
    $("textOutput").classList.add("empty");
    $("textOutput").textContent = "Translated text will appear here.";
  });

  $("clearDocBtn").addEventListener("click", () => {
    $("docText").value = "";
    $("docFile").value = "";
    $("docOutput").classList.add("empty");
    $("docOutput").textContent = "Translated document text will appear here.";
  });

  $("sourceLang").addEventListener("change", () => {
    state.settings.sourceLang = $("sourceLang").value;
  });

  $("targetLang").addEventListener("change", () => {
    state.settings.targetLang = $("targetLang").value;
  });

  $("docSourceLang").addEventListener("change", () => {
    state.settings.docSourceLang = $("docSourceLang").value;
  });

  $("docTargetLang").addEventListener("change", () => {
    state.settings.docTargetLang = $("docTargetLang").value;
  });
}

async function init() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  loadSettings();
  populateLanguageSelects();
  wireTabs();
  wireEvents();
  setStatus("Ready");
  await loadAzureLanguages();
}

init();