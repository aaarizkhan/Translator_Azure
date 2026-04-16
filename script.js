const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "vanta-translate-settings";

const UI_LANGS = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  ar: "Arabic"
};

const I18N = {
  en: {
    brandSub: "Azure Translator dashboard",
    settingsTitle: "Dashboard settings",
    localOnly: "Local",
    endpointLabel: "Endpoint",
    keyLabel: "Key",
    regionLabel: "Region",
    uiLangLabel: "Website language switcher",
    saveBtn: "Save dashboard",
    loadLanguagesBtn: "Load Azure languages",
    settingsHint: "Your key stays in the browser in this prototype. For production, move calls behind a server.",
    statusTitle: "Status",
    eyebrow: "Multilingual language lab",
    heroTitle: "Translate text, learn words, and switch the site language.",
    heroDesc: "Built for Azure Translator with a clean dashboard, multi-target translation, dictionary meaning help, and resume/document sentence translation.",
    badgeTitle: "Smart language workspace",
    badgeDesc: "One page, three translator modes",
    tabText: "Text translator",
    tabMeaning: "Word meaning helper",
    tabDoc: "Document / resume translator",
    sourceLabel: "Source language",
    targetLabel: "Target language(s)",
    multiTargetHint: "Hold Ctrl / Cmd to select multiple languages.",
    textInputLabel: "Text to translate",
    translateBtn: "Translate",
    clearBtn: "Clear",
    meaningSourceLabel: "Word source language",
    meaningTargetLabel: "Word target language",
    wordLabel: "Word or short phrase",
    lookupBtn: "Find meaning",
    docTitle: "Resume / document text translator",
    docHint: "Paste the text from a resume, SOP, essay, or document, or upload a plain-text file.",
    docInputLabel: "Document text",
    docSourceLabel: "Document source language",
    docTargetLabel: "Document target language",
    docResultTitle: "Translated output",
    docEmpty: "Your translated paragraphs will appear here.",
    detecting: "Detect automatically",
    loadLangsFirst: "Load languages first",
    saved: "Saved to browser",
    loading: "Loading languages...",
    translating: "Translating...",
    lookingUp: "Looking up meaning...",
    done: "Done",
    noText: "Please enter some text first.",
    noWord: "Please enter a word or phrase first.",
    noTargets: "Select at least one target language.",
    fileRead: "File loaded into the document box.",
    copy: "Copy"
  },
  hi: {
    brandSub: "Azure Translator डैशबोर्ड",
    settingsTitle: "डैशबोर्ड सेटिंग्स",
    localOnly: "लोकल",
    endpointLabel: "एंडपॉइंट",
    keyLabel: "की",
    regionLabel: "रीजन",
    uiLangLabel: "वेबसाइट भाषा बदलें",
    saveBtn: "सेटिंग सेव करें",
    loadLanguagesBtn: "Azure भाषाएँ लोड करें",
    settingsHint: "इस प्रोटोटाइप में आपकी key ब्राउज़र में रहती है। प्रोडक्शन में इसे सर्वर के पीछे रखें।",
    statusTitle: "स्थिति",
    eyebrow: "बहुभाषी भाषा लैब",
    heroTitle: "टेक्स्ट ट्रांसलेट करें, शब्द सीखें, और साइट की भाषा बदलें।",
    heroDesc: "Azure Translator के लिए बना एक साफ dashboard, multi-target translation, शब्दों का meaning helper, और resume/document sentence translation के साथ।",
    badgeTitle: "स्मार्ट भाषा workspace",
    badgeDesc: "एक पेज, तीन modes",
    tabText: "Text translator",
    tabMeaning: "Word meaning helper",
    tabDoc: "Document / resume translator",
    sourceLabel: "Source भाषा",
    targetLabel: "Target language(s)",
    multiTargetHint: "कई languages चुनने के लिए Ctrl / Cmd दबाएँ।",
    textInputLabel: "Translate करने के लिए text",
    translateBtn: "Translate",
    clearBtn: "Clear",
    meaningSourceLabel: "Word source भाषा",
    meaningTargetLabel: "Word target भाषा",
    wordLabel: "शब्द या छोटा phrase",
    lookupBtn: "Meaning ढूँढें",
    docTitle: "Resume / document text translator",
    docHint: "Resume, SOP, essay, या document का text paste करें, या plain-text file upload करें।",
    docInputLabel: "Document text",
    docSourceLabel: "Document source भाषा",
    docTargetLabel: "Document target भाषा",
    docResultTitle: "Translated output",
    docEmpty: "Translated paragraphs यहाँ दिखेंगे।",
    detecting: "Auto detect",
    loadLangsFirst: "पहले languages load करें",
    saved: "Browser में saved",
    loading: "Languages load हो रही हैं...",
    translating: "Translate हो रहा है...",
    lookingUp: "Meaning खोजा जा रहा है...",
    done: "Done",
    noText: "कृपया पहले text लिखें।",
    noWord: "कृपया पहले शब्द या phrase लिखें।",
    noTargets: "कम से कम एक target भाषा चुनें।",
    fileRead: "File document box में आ गई है।",
    copy: "Copy"
  },
  es: {
    brandSub: "Panel de Azure Translator",
    settingsTitle: "Ajustes del panel",
    localOnly: "Local",
    endpointLabel: "Endpoint",
    keyLabel: "Clave",
    regionLabel: "Región",
    uiLangLabel: "Cambiar idioma del sitio",
    saveBtn: "Guardar panel",
    loadLanguagesBtn: "Cargar idiomas de Azure",
    settingsHint: "Tu clave queda en el navegador en este prototipo. En producción, usa un servidor.",
    statusTitle: "Estado",
    eyebrow: "Laboratorio multilingüe",
    heroTitle: "Traduce texto, aprende palabras y cambia el idioma del sitio.",
    heroDesc: "Hecho para Azure Translator con un panel limpio, traducción a varios idiomas, ayuda con significados y traducción de documentos o currículums.",
    badgeTitle: "Espacio inteligente",
    badgeDesc: "Una página, tres modos",
    tabText: "Traductor de texto",
    tabMeaning: "Ayuda de significado",
    tabDoc: "Traductor de documentos / currículum",
    sourceLabel: "Idioma de origen",
    targetLabel: "Idioma(s) de destino",
    multiTargetHint: "Mantén Ctrl / Cmd para seleccionar varios idiomas.",
    textInputLabel: "Texto a traducir",
    translateBtn: "Traducir",
    clearBtn: "Limpiar",
    meaningSourceLabel: "Idioma fuente de la palabra",
    meaningTargetLabel: "Idioma destino de la palabra",
    wordLabel: "Palabra o frase corta",
    lookupBtn: "Buscar significado",
    docTitle: "Traductor de texto de documentos / currículum",
    docHint: "Pega texto de un currículum, SOP, ensayo o documento, o sube un archivo de texto plano.",
    docInputLabel: "Texto del documento",
    docSourceLabel: "Idioma fuente del documento",
    docTargetLabel: "Idioma destino del documento",
    docResultTitle: "Resultado traducido",
    docEmpty: "Tus párrafos traducidos aparecerán aquí.",
    detecting: "Detectar automáticamente",
    loadLangsFirst: "Carga idiomas primero",
    saved: "Guardado en el navegador",
    loading: "Cargando idiomas...",
    translating: "Traduciendo...",
    lookingUp: "Buscando significado...",
    done: "Hecho",
    noText: "Introduce texto primero.",
    noWord: "Introduce una palabra o frase primero.",
    noTargets: "Selecciona al menos un idioma de destino.",
    fileRead: "Archivo cargado en el cuadro de documento.",
    copy: "Copiar"
  }
};

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
  ["uk", "Ukrainian"],
  ["bn", "Bengali"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["mr", "Marathi"]
];

const state = {
  uiLang: "en",
  languages: null,
  languagesLoaded: false,
  settings: {
    endpoint: "https://api.cognitive.microsofttranslator.com",
    apiKey: "",
    region: "",
    sourceLang: "auto",
    targetLangs: ["hi"],
    meaningSource: "en",
    meaningTarget: "hi",
    docSource: "auto",
    docTarget: "hi"
  }
};

function t(key) {
  return (I18N[state.uiLang] && I18N[state.uiLang][key]) || I18N.en[key] || key;
}

function normalizeEndpoint(endpoint) {
  const clean = (endpoint || "").trim().replace(/\/+$/, "");
  return clean || "https://api.cognitive.microsofttranslator.com";
}

function translatorBase(endpoint) {
  return `${normalizeEndpoint(endpoint)}/translator/text/v3.0`;
}

function languagesBase(endpoint) {
  return `${normalizeEndpoint(endpoint)}/languages?api-version=3.0&scope=translation,dictionary`;
}

function makeTraceId() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setStatus(message) {
  $("statusText").textContent = message;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
}

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state.settings = { ...state.settings, ...saved };
      if (!Array.isArray(state.settings.targetLangs)) state.settings.targetLangs = ["hi"];
    } catch {}
  }
  $("endpoint").value = state.settings.endpoint;
  $("apiKey").value = state.settings.apiKey;
  $("region").value = state.settings.region;
  $("sourceLang").value = state.settings.sourceLang;
  $("meaningSource").value = state.settings.meaningSource;
  $("meaningTarget").value = state.settings.meaningTarget;
  $("docSource").value = state.settings.docSource;
  $("docTarget").value = state.settings.docTarget;
}

function applyUILanguage(lang) {
  state.uiLang = UI_LANGS[lang] ? lang : "en";
  document.documentElement.lang = state.uiLang;
  document.body.dir = state.uiLang === "ar" ? "rtl" : "ltr";
  $("uiLanguage").value = state.uiLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key === "docEmpty" && $("docOutput").classList.contains("empty")) {
      el.textContent = t(key);
    } else if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && el.tagName !== "OPTION") {
      el.textContent = t(key);
    }
  });

  $("endpoint").placeholder = "https://api.cognitive.microsofttranslator.com";
  $("apiKey").placeholder = "Paste Azure Translator key";
  $("region").placeholder = "eastus / centralindia / etc.";
  $("sourceText").placeholder = "Type or paste text here...";
  $("lookupWord").placeholder = "sunlight, future, learning...";
  $("docText").placeholder = "Paste resume or document content here...";
}

function fillUILanguageSelect() {
  const select = $("uiLanguage");
  select.innerHTML = Object.entries(UI_LANGS)
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");
}

function fillLanguageSelects(languageMap) {
  const langs = [["auto", t("detecting")], ...languageMap];

  const build = (el, multiple = false) => {
    el.innerHTML = langs
      .map(([code, name]) => `<option value="${code}">${name}</option>`)
      .join("");
    if (!multiple && !el.value) el.value = "auto";
  };

  build($("sourceLang"));
  build($("meaningSource"));
  build($("docSource"));

  const targetHTML = languageMap
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");

  $("targetLang").innerHTML = targetHTML;
  $("meaningTarget").innerHTML = targetHTML;
  $("docTarget").innerHTML = targetHTML;

  restoreSelectedTargets();
  applySavedSelectValues();
}

function applySavedSelectValues() {
  $("sourceLang").value = state.settings.sourceLang;
  $("meaningSource").value = state.settings.meaningSource;
  $("meaningTarget").value = state.settings.meaningTarget;
  $("docSource").value = state.settings.docSource;
  $("docTarget").value = state.settings.docTarget;

  if (state.settings.targetLangs?.length) {
    [...$("targetLang").options].forEach((opt) => {
      opt.selected = state.settings.targetLangs.includes(opt.value);
    });
  }
}

function restoreSelectedTargets() {
  if (!state.settings.targetLangs?.length) return;
  [...$("targetLang").options].forEach((opt) => {
    opt.selected = state.settings.targetLangs.includes(opt.value);
  });
}

function getSelectedTargets() {
  return [...$("targetLang").selectedOptions].map((o) => o.value).filter(Boolean);
}

function getLanguageMapFromResponse(data) {
  const translation = data?.translation || {};
  return Object.entries(translation)
    .map(([code, meta]) => [code, meta.nativeName || meta.name || code])
    .sort((a, b) => a[1].localeCompare(b[1]));
}

async function loadLanguages() {
  setStatus(t("loading"));
  try {
    const endpoint = $("endpoint").value.trim();
    const url = languagesBase(endpoint);
    const res = await fetch(url, {
      headers: {
        "Accept-Language": state.uiLang,
        "X-ClientTraceId": makeTraceId()
      }
    });

    if (!res.ok) throw new Error(`Languages request failed (${res.status})`);
    const data = await res.json();
    const map = getLanguageMapFromResponse(data);
    if (!map.length) throw new Error("No languages returned");

    state.languages = map;
    state.languagesLoaded = true;
    fillLanguageSelects(map);
    setStatus(`${map.length} languages loaded`);
    showToast(t("done"));
  } catch (err) {
    state.languagesLoaded = false;
    console.error(err);
    state.languages = FALLBACK_LANGS.filter(([code]) => code !== "auto");
    fillLanguageSelects(state.languages);
    setStatus(`Fallback language list loaded. ${err.message}`);
  }
}

function buildHeaders(includeRegion = true) {
  const headers = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": $("apiKey").value.trim(),
    "X-ClientTraceId": makeTraceId()
  };
  const region = $("region").value.trim();
  if (includeRegion && region) {
    headers["Ocp-Apim-Subscription-Region"] = region;
  }
  return headers;
}

async function translateText(text, fromLang, toLangs) {
  const endpoint = translatorBase($("endpoint").value);
  const query = new URLSearchParams({ "api-version": "3.0" });
  if (fromLang && fromLang !== "auto") query.set("from", fromLang);
  toLangs.forEach((lang) => query.append("to", lang));

  const url = `${endpoint}/translate?${query.toString()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify([{ Text: text }])
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Translate failed (${res.status}) ${body.slice(0, 180)}`);
  }
  return res.json();
}

function renderTranslationResults(data, targets) {
  const container = $("textOutput");
  const translated = data?.[0]?.translations || [];
  if (!translated.length) {
    container.innerHTML = `<div class="result-card empty">${t("noText")}</div>`;
    return;
  }

  container.innerHTML = translated
    .map((item) => {
      const name = item.to || item.language || item.target || "translation";
      const text = item.text || "";
      return `
        <div class="result-card">
          <h4>${escapeHtml(name)}</h4>
          <div class="lang">${escapeHtml(targets.includes(name) ? name : name)}</div>
          <p>${escapeHtml(text)}</p>
        </div>`;
    })
    .join("");
}

async function onTranslate() {
  const text = $("sourceText").value.trim();
  const fromLang = $("sourceLang").value;
  const toLangs = getSelectedTargets();

  if (!text) return showToast(t("noText"));
  if (!toLangs.length) return showToast(t("noTargets"));

  setStatus(t("translating"));
  $("translateBtn").disabled = true;

  try {
    const data = await translateText(text, fromLang, toLangs);
    renderTranslationResults(data, toLangs);
    setStatus(t("done"));
  } catch (err) {
    console.error(err);
    $("textOutput").innerHTML = `<div class="result-card empty">${escapeHtml(err.message)}</div>`;
    setStatus(err.message);
  } finally {
    $("translateBtn").disabled = false;
  }
}

async function lookupMeaning() {
  const word = $("lookupWord").value.trim();
  const from = $("meaningSource").value;
  const to = $("meaningTarget").value;

  if (!word) return showToast(t("noWord"));

  setStatus(t("lookingUp"));
  $("lookupBtn").disabled = true;

  try {
    const endpoint = translatorBase($("endpoint").value);
    const lookupUrl = `${endpoint}/dictionary/lookup?api-version=3.0&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const lookupRes = await fetch(lookupUrl, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify([{ Text: word }])
    });

    if (!lookupRes.ok) {
      const body = await lookupRes.text().catch(() => "");
      throw new Error(`Dictionary lookup failed (${lookupRes.status}) ${body.slice(0, 160)}`);
    }

    const lookupData = await lookupRes.json();
    const first = lookupData?.[0];
    const translations = first?.translations || [];

    if (!translations.length) {
      $("meaningOutput").innerHTML = `<div class="meaning-card">${escapeHtml(word)} — No dictionary meaning returned.</div>`;
      setStatus(t("done"));
      return;
    }

    const selected = translations[0];
    const backTranslations = selected.backTranslations || [];
    const pos = selected.posTag || "word";

    let examplesHtml = "";
    try {
      const examplesUrl = `${endpoint}/dictionary/examples?api-version=3.0&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const exampleRes = await fetch(examplesUrl, {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify([
          {
            Text: selected.normalizedSource || first.normalizedSource || word,
            Translation: selected.normalizedTarget || selected.translation || selected.displayTarget || ""
          }
        ])
      });

      if (exampleRes.ok) {
        const exampleData = await exampleRes.json();
        const examples = exampleData?.[0]?.examples || [];
        if (examples.length) {
          examplesHtml = `
            <div class="list">
              ${examples.slice(0, 3).map(ex => `<div class="chip">${escapeHtml(ex.normalizedSourcePrefix || "")}${escapeHtml(ex.sourcePrefix || "")}${escapeHtml(ex.sourceSuffix || "")} → ${escapeHtml(ex.targetPrefix || "")}${escapeHtml(ex.targetSuffix || "")}</div>`).join("")}
            </div>`;
        }
      }
    } catch {}

    $("meaningOutput").innerHTML = `
      <div class="meaning-card">
        <div class="topline">
          <div>
            <strong>${escapeHtml(first.displaySource || word)}</strong>
            <div class="muted">${escapeHtml(from)} → ${escapeHtml(to)}</div>
          </div>
          <span class="tag">${escapeHtml(pos)}</span>
        </div>
        <div><strong>${escapeHtml(selected.displayTarget || selected.normalizedTarget || "")}</strong></div>
        <div class="muted" style="margin-top:8px">Back translations</div>
        <div class="list">
          ${backTranslations.slice(0, 6).map(bt => `<span class="chip">${escapeHtml(bt.displayText || bt.normalizedText || "")}</span>`).join("")}
        </div>
        ${examplesHtml}
      </div>
    `;
    setStatus(t("done"));
  } catch (err) {
    console.error(err);
    $("meaningOutput").innerHTML = `<div class="meaning-card">${escapeHtml(err.message)}</div>`;
    setStatus(err.message);
  } finally {
    $("lookupBtn").disabled = false;
  }
}

function splitIntoChunks(text, maxLen = 800) {
  const parts = text.split(/\n\s*\n/);
  const chunks = [];
  let buffer = "";
  for (const part of parts) {
    const candidate = buffer ? `${buffer}\n\n${part}` : part;
    if (candidate.length > maxLen && buffer) {
      chunks.push(buffer);
      buffer = part;
    } else if (candidate.length > maxLen) {
      chunks.push(part);
      buffer = "";
    } else {
      buffer = candidate;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks.length ? chunks : [text];
}

async function translateDocumentText() {
  const text = $("docText").value.trim();
  const fromLang = $("docSource").value;
  const toLang = $("docTarget").value;

  if (!text) return showToast(t("noText"));

  setStatus(t("translating"));
  $("docTranslateBtn").disabled = true;

  try {
    const chunks = splitIntoChunks(text, 800);
    const outputs = [];
    for (const chunk of chunks) {
      const data = await translateText(chunk, fromLang, [toLang]);
      const translated = data?.[0]?.translations?.[0]?.text || "";
      outputs.push(translated);
    }

    $("docOutput").classList.remove("empty");
    $("docOutput").innerHTML = `
      <div class="action-row" style="margin-top:0">
        <button id="copyDocOut" class="btn secondary">${t("copy")}</button>
      </div>
      <div style="margin-top:14px">${escapeHtml(outputs.join("\n\n"))}</div>
    `;

    $("copyDocOut").onclick = async () => {
      await navigator.clipboard.writeText(outputs.join("\n\n"));
      showToast("Copied");
    };

    setStatus(t("done"));
  } catch (err) {
    console.error(err);
    $("docOutput").classList.remove("empty");
    $("docOutput").textContent = err.message;
    setStatus(err.message);
  } finally {
    $("docTranslateBtn").disabled = false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  $("saveSettings").addEventListener("click", () => {
    state.settings.endpoint = $("endpoint").value.trim();
    state.settings.apiKey = $("apiKey").value.trim();
    state.settings.region = $("region").value.trim();
    state.settings.sourceLang = $("sourceLang").value;
    state.settings.targetLangs = getSelectedTargets();
    state.settings.meaningSource = $("meaningSource").value;
    state.settings.meaningTarget = $("meaningTarget").value;
    state.settings.docSource = $("docSource").value;
    state.settings.docTarget = $("docTarget").value;
    saveSettings();
    showToast(t("saved"));
    setStatus(t("saved"));
  });

  $("loadLanguages").addEventListener("click", loadLanguages);
  $("translateBtn").addEventListener("click", onTranslate);
  $("lookupBtn").addEventListener("click", lookupMeaning);
  $("docTranslateBtn").addEventListener("click", translateDocumentText);

  $("clearTextBtn").addEventListener("click", () => {
    $("sourceText").value = "";
    $("textOutput").innerHTML = `<div class="result-card empty">${t("docEmpty")}</div>`;
  });

  $("meaningClearBtn").addEventListener("click", () => {
    $("lookupWord").value = "";
    $("meaningOutput").innerHTML = "";
  });

  $("docClearBtn").addEventListener("click", () => {
    $("docText").value = "";
    $("docOutput").className = "doc-output empty";
    $("docOutput").textContent = t("docEmpty");
  });

  $("swapLangs").addEventListener("click", () => {
    const source = $("sourceLang").value;
    const selectedTargets = getSelectedTargets();
    if (selectedTargets.length) {
      $("sourceLang").value = selectedTargets[0];
      [...$("targetLang").options].forEach((opt) => (opt.selected = false));
      const sourceOption = [...$("targetLang").options].find((o) => o.value === source);
      if (sourceOption) sourceOption.selected = true;
    }
  });

  $("uiLanguage").addEventListener("change", async (e) => {
    applyUILanguage(e.target.value);
    fillLanguageSelects(state.languages || FALLBACK_LANGS.filter(([code]) => code !== "auto"));
    await loadLanguages().catch(() => {});
    setStatus("UI updated");
  });

  $("docFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      $("docText").value = text;
      showToast(t("fileRead"));
    } catch (err) {
      showToast(err.message);
    }
  });

  ["endpoint", "apiKey", "region", "sourceLang", "meaningSource", "meaningTarget", "docSource", "docTarget"].forEach((id) => {
    $(id).addEventListener("change", () => {
      if (id === "sourceLang") state.settings.sourceLang = $("sourceLang").value;
      if (id === "meaningSource") state.settings.meaningSource = $("meaningSource").value;
      if (id === "meaningTarget") state.settings.meaningTarget = $("meaningTarget").value;
      if (id === "docSource") state.settings.docSource = $("docSource").value;
      if (id === "docTarget") state.settings.docTarget = $("docTarget").value;
    });
  });

  $("targetLang").addEventListener("change", () => {
    state.settings.targetLangs = getSelectedTargets();
  });
}

async function init() {
  fillUILanguageSelect();
  loadSettings();
  applyUILanguage(state.uiLang);
  wireTabs();
  wireEvents();

  const fallback = FALLBACK_LANGS.filter(([code]) => code !== "auto");
  fillLanguageSelects(fallback);
  setStatus("Ready");

  try {
    await loadLanguages();
  } catch {}
}

init();