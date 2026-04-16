const STORAGE_KEY = "azure-translator-studio-config";
const DEFAULT_ENDPOINT = "https://api.cognitive.microsofttranslator.com";

const LANGUAGES = [
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "de", name: "German" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "hi", name: "Hindi" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "mr", name: "Marathi" },
  { code: "nl", name: "Dutch" },
  { code: "pa", name: "Punjabi" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "tr", name: "Turkish" },
  { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
];

const SAMPLE_TEXT = "Learning a new language becomes easier when you can see the same idea in several languages.";
const SAMPLE_SITE = "Welcome to our premium learning dashboard. Explore features, translate text, and switch languages beautifully.";
const SAMPLE_WORD = "sunshine";
const SAMPLE_DOC = "My name is Aarav.\nI build elegant websites.\nI enjoy solving problems.";
const CHAT_SAMPLE = "Hi! Can you help me translate this message into a few languages?";
const TRAVEL_SAMPLE = "I need a taxi to the airport, please.";

const state = {
  config: {
    endpoint: DEFAULT_ENDPOINT,
    key: "",
    region: "",
  },
  targets: new Set(["hi", "es"]),
  chat: [
    { role: "user", text: "Welcome! Paste a message and I will translate it beautifully.", lang: "system" },
  ],
};

const $ = (id) => document.getElementById(id);
const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function normalizeEndpoint(endpoint) {
  return (endpoint || DEFAULT_ENDPOINT).trim().replace(/\/+$/, "");
}

function getSelectedTargets() {
  return [...state.targets];
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.config = {
      endpoint: saved.endpoint || DEFAULT_ENDPOINT,
      key: saved.key || "",
      region: saved.region || "",
    };
    state.targets = new Set(Array.isArray(saved.targets) && saved.targets.length ? saved.targets : ["hi", "es"]);
  } catch {
    // ignore
  }
}

function saveConfigToStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state.config,
      targets: [...state.targets],
    })
  );
}

function renderConfig() {
  $("endpoint").value = state.config.endpoint;
  $("key").value = state.config.key;
  $("region").value = state.config.region;
  renderLanguageChips();
  updateSelectedCount();
}

function updateSelectedCount() {
  $("selectedCount").textContent = `${state.targets.size} selected`;
}

function renderLanguageChips() {
  const host = $("languageChips");
  host.innerHTML = "";
  LANGUAGES.forEach((lang) => {
    const label = document.createElement("label");
    label.className = "lang-chip";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = lang.code;
    input.checked = state.targets.has(lang.code);
    input.addEventListener("change", () => {
      if (input.checked) state.targets.add(lang.code);
      else state.targets.delete(lang.code);
      updateSelectedCount();
      saveConfigToStorage();
    });

    const name = document.createElement("span");
    name.textContent = lang.name;

    label.appendChild(input);
    label.appendChild(name);
    host.appendChild(label);
  });
}

function ensureTargets() {
  if (state.targets.size === 0) {
    state.targets.add("hi");
    state.targets.add("es");
    renderLanguageChips();
    updateSelectedCount();
  }
}

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": state.config.key,
    "X-ClientTraceId": crypto.randomUUID(),
  };
  if (state.config.region.trim()) {
    headers["Ocp-Apim-Subscription-Region"] = state.config.region.trim();
  }
  return headers;
}

async function apiPost(path, params, body) {
  if (!state.config.endpoint || !state.config.key) {
    throw new Error("Add your Azure endpoint and subscription key first.");
  }
  const endpoint = normalizeEndpoint(state.config.endpoint);
  const url = new URL(endpoint + path);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || text || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function detectLanguage(text) {
  const result = await apiPost("/detect", { "api-version": "3.0" }, [{ Text: text }]);
  return result?.[0]?.language || "";
}

async function translateText(text, from, toList) {
  const params = { "api-version": "3.0" };
  if (from) params.from = from;
  toList.forEach((to) => {
    params.to = params.to || [];
    params.to.push(to);
  });

  return apiPost("/translate", params, [{ Text: text }]);
}

async function dictionaryLookup(word, from, to) {
  return apiPost("/Dictionary/Lookup", { "api-version": "3.0", from, to }, [{ text: word }]);
}

async function dictionaryExamples(word, translation, from, to) {
  return apiPost("/Dictionary/Examples", { "api-version": "3.0", from, to }, [{ text: word, translation }]);
}

function languageName(code) {
  const match = LANGUAGES.find((l) => l.code === code);
  return match ? match.name : code;
}

function showStatus(message, kind = "normal") {
  const el = $("connectionStatus");
  el.textContent = message;
  el.style.borderColor =
    kind === "error" ? "rgba(255,120,120,0.4)" : kind === "success" ? "rgba(115,255,195,0.35)" : "rgba(255,255,255,0.08)";
}

function buildOutputForTranslations(sourceText, results) {
  const all = [];
  results.forEach((item) => {
    const list = (item.translations || []).map((t) => {
      const extra = [];
      if (t.transliteration?.text) extra.push(`Transliteration: ${t.transliteration.text}`);
      return `
        <div class="translation-card">
          <strong>${escapeHtml(languageName(t.to))}</strong>
          <div>${escapeHtml(t.text)}</div>
          ${extra.length ? `<div class="small">${escapeHtml(extra.join(" · "))}</div>` : ""}
        </div>
      `;
    }).join("");

    all.push(`
      <div class="translation-group">
        <div class="translation-head">
          <span>${escapeHtml(sourceText.slice(0, 60) || "Text")}</span>
        </div>
        ${list}
      </div>
    `);
  });

  return all.join("");
}

function addChat(text, role = "user", lang = "system") {
  state.chat.push({ text, role, lang });
  renderChat();
}

function renderChat() {
  const windowEl = $("chatWindow");
  windowEl.innerHTML = "";
  state.chat.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.role === "user" ? "user" : "bot"}`;
    bubble.innerHTML = `${escapeHtml(msg.text)}${
      msg.lang && msg.lang !== "system" ? `<div class="bubble-lang">${escapeHtml(languageName(msg.lang))}</div>` : ""
    }`;
    windowEl.appendChild(bubble);
  });
  windowEl.scrollTop = windowEl.scrollHeight;
}

function fillSample(target) {
  const map = {
    translateInput: SAMPLE_TEXT,
    siteCopy: SAMPLE_SITE,
    wordInput: SAMPLE_WORD,
    documentInput: SAMPLE_DOC,
    chatInput: CHAT_SAMPLE,
    phraseInput: TRAVEL_SAMPLE,
  };
  if ($(target)) $(target).value = map[target] || "";
}

async function handleTranslateText() {
  const input = $("translateInput").value.trim();
  if (!input) return showStatus("Type something in the text translator first.", "error");

  try {
    showStatus("Translating text...");
    const from = $("translateFrom").value.trim();
    const targets = getSelectedTargets();
    ensureTargets();

    const results = await translateText(input, from, targets);
    const detected = from || results?.[0]?.detectedLanguage?.language || "";
    $("translateMeta").textContent = detected
      ? `Source: ${languageName(detected)}${results?.[0]?.detectedLanguage?.score ? ` · confidence ${Math.round(results[0].detectedLanguage.score * 100)}%` : ""}`
      : "Auto-detected source language.";

    $("translateOutput").innerHTML = buildOutputForTranslations(input, results);
    showStatus("Text translated successfully.", "success");
  } catch (err) {
    $("translateOutput").innerHTML = "";
    showStatus(err.message || "Translation failed.", "error");
  }
}

async function handleDetectThenTranslate() {
  const input = $("translateInput").value.trim();
  if (!input) return showStatus("Type something first.", "error");

  try {
    showStatus("Detecting language...");
    const detected = await detectLanguage(input);
    $("translateFrom").value = detected || "";
    showStatus(`Detected source language: ${languageName(detected || "unknown")}. Ready to translate.`, "success");
  } catch (err) {
    showStatus(err.message || "Detection failed.", "error");
  }
}

async function handleTranslateSite() {
  const input = $("siteCopy").value.trim();
  if (!input) return showStatus("Paste some website copy first.", "error");
  try {
    showStatus("Translating site copy...");
    const results = await translateText(input, "", getSelectedTargets());
    $("siteOutput").innerHTML = buildOutputForTranslations(input, results);
    showStatus("Site copy translated.", "success");
  } catch (err) {
    $("siteOutput").innerHTML = "";
    showStatus(err.message || "Site copy translation failed.", "error");
  }
}

async function handleWordLookup() {
  const word = $("wordInput").value.trim();
  const from = $("wordFrom").value;
  const to = $("wordTo").value;
  if (!word) return showStatus("Enter a word to look up.", "error");

  try {
    showStatus("Looking up word meaning...");
    const lookup = await dictionaryLookup(word, from, to);
    const item = lookup?.[0];
    if (!item || !item.translations || !item.translations.length) {
      const translated = await translateText(word, from, [to]);
      const fallback = translated?.[0]?.translations?.[0]?.text || "No result";
      $("wordOutput").innerHTML = `
        <div class="translation-card">
          <strong>${escapeHtml(word)}</strong>
          <div>${escapeHtml(languageName(to))}: ${escapeHtml(fallback)}</div>
          <div class="small">Dictionary lookup returned no direct match, so the translator fallback was used.</div>
        </div>
      `;
      showStatus("No dictionary match found; used translation fallback.", "success");
      return;
    }

    const first = item.translations[0];
    const examples = await dictionaryExamples(
      item.normalizedSource || word,
      first.normalizedTarget || first.displayTarget || first.name || first.code,
      from,
      to
    );
    const exampleList = examples?.[0]?.examples || [];

    const translations = item.translations.map((t) => `
      <div class="translation-card">
        <strong>${escapeHtml(t.displayTarget || t.normalizedTarget || t.name || "")}</strong>
        <div>${escapeHtml(t.posTag || "translation")}</div>
        <div class="small">Back translations: ${(t.backTranslations || []).slice(0, 3).map(b => escapeHtml(b.displayText || b.normalizedText || "")).join(", ")}</div>
      </div>
    `).join("");

    const exampleHtml = exampleList.length ? exampleList.map((ex) => `
      <div class="translation-card">
        <strong>Example</strong>
        <div>${escapeHtml(ex.sourcePrefix || "")}<mark>${escapeHtml(ex.sourceTerm || "")}</mark>${escapeHtml(ex.sourceSuffix || "")}</div>
        <div class="small">${escapeHtml(ex.targetPrefix || "")}<mark>${escapeHtml(ex.targetTerm || "")}</mark>${escapeHtml(ex.targetSuffix || "")}</div>
      </div>
    `).join("") : `<div class="muted">No dictionary examples available for this pair.</div>`;

    $("wordOutput").innerHTML = `
      <div class="translation-group">
        <div class="translation-head">
          <span>${escapeHtml(item.displaySource || word)}</span>
          <span>${escapeHtml(languageName(from))} → ${escapeHtml(languageName(to))}</span>
        </div>
        ${translations}
        ${exampleHtml}
      </div>
    `;
    showStatus("Meaning helper loaded.", "success");
  } catch (err) {
    $("wordOutput").innerHTML = "";
    showStatus(err.message || "Word lookup failed.", "error");
  }
}

async function handleTranslatePhrase() {
  const input = $("phraseInput").value.trim();
  if (!input) return showStatus("Type or choose a phrase first.", "error");

  try {
    showStatus("Translating travel phrase...");
    const results = await translateText(input, "", getSelectedTargets());
    $("phraseOutput").innerHTML = buildOutputForTranslations(input, results);
    showStatus("Phrase translated.", "success");
  } catch (err) {
    $("phraseOutput").innerHTML = "";
    showStatus(err.message || "Phrase translation failed.", "error");
  }
}

async function handleTranslateDocument() {
  const input = $("documentInput").value.trim();
  if (!input) return showStatus("Paste lines from your resume or document first.", "error");

  const lines = input.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return showStatus("Add at least one sentence.", "error");

  try {
    showStatus("Translating document lines...");
    const results = [];
    for (const line of lines) {
      const translated = await translateText(line, "", getSelectedTargets());
      results.push({ line, translated });
    }

    const html = results.map(({ line, translated }) => {
      const cards = (translated[0]?.translations || []).map((t) => `
        <div class="translation-card">
          <strong>${escapeHtml(languageName(t.to))}</strong>
          <div>${escapeHtml(t.text)}</div>
        </div>
      `).join("");

      return `
        <div class="translation-group">
          <div class="translation-head">
            <span>${escapeHtml(line)}</span>
          </div>
          ${cards}
        </div>
      `;
    }).join("");

    $("documentOutput").innerHTML = html || `<div class="muted">Nothing translated.</div>`;
    showStatus("Document text translated line by line.", "success");
  } catch (err) {
    $("documentOutput").innerHTML = "";
    showStatus(err.message || "Document translation failed.", "error");
  }
}

function appendTranslatedChat(translatedResults) {
  const parts = [];
  translatedResults[0]?.translations?.forEach((t) => {
    parts.push(`<strong>${escapeHtml(languageName(t.to))}:</strong> ${escapeHtml(t.text)}`);
  });
  addChat(parts.join("<br>"), "bot", translatedResults[0]?.translations?.[0]?.to || "");
}

async function handleChatAdd() {
  const input = $("chatInput").value.trim();
  if (!input) return showStatus("Write a chat message first.", "error");
  addChat(input, "user", "system");
  $("chatInput").value = "";
}

async function handleChatTranslate() {
  const input = $("chatInput").value.trim();
  if (!input) return showStatus("Write a message to translate.", "error");
  try {
    showStatus("Translating chat message...");
    const results = await translateText(input, "", getSelectedTargets());
    appendTranslatedChat(results);
    showStatus("Chat translation added.", "success");
  } catch (err) {
    showStatus(err.message || "Chat translation failed.", "error");
  }
}

async function handleTestConnection() {
  const sample = "Hello from Azure Translator Studio.";
  try {
    showStatus("Testing connection...");
    const detected = await detectLanguage(sample);
    showStatus(`Connection looks good. Sample detected as ${languageName(detected || "unknown")}.`, "success");
  } catch (err) {
    showStatus(err.message || "Connection test failed.", "error");
  }
}

function wireEvents() {
  $("saveConfig").addEventListener("click", () => {
    state.config.endpoint = normalizeEndpoint($("endpoint").value);
    state.config.key = $("key").value.trim();
    state.config.region = $("region").value.trim();
    saveConfigToStorage();
    showStatus("Connection saved on this device.", "success");
  });

  $("testConnection").addEventListener("click", handleTestConnection);
  $("translateBtn").addEventListener("click", handleTranslateText);
  $("swapTranslate").addEventListener("click", handleDetectThenTranslate);
  $("translateSite").addEventListener("click", handleTranslateSite);
  $("lookupWord").addEventListener("click", handleWordLookup);
  $("translatePhrase").addEventListener("click", handleTranslatePhrase);
  $("translateDocument").addEventListener("click", handleTranslateDocument);
  $("sendChat").addEventListener("click", handleChatAdd);
  $("translateChat").addEventListener("click", handleChatTranslate);
  $("clearChat").addEventListener("click", () => {
    state.chat = [{ role: "user", text: "Chat cleared. Start a new multilingual conversation.", lang: "system" }];
    renderChat();
  });

  $("selectAll").addEventListener("click", () => {
    LANGUAGES.forEach((lang) => state.targets.add(lang.code));
    renderLanguageChips();
    updateSelectedCount();
    saveConfigToStorage();
  });

  $("clearAll").addEventListener("click", () => {
    state.targets.clear();
    renderLanguageChips();
    updateSelectedCount();
    saveConfigToStorage();
  });

  document.querySelectorAll("[data-fill-sample]").forEach((btn) => {
    btn.addEventListener("click", () => {
      fillSample(btn.dataset.fillSample);
    });
  });

  document.querySelectorAll("[data-phrase]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("phraseInput").value = btn.dataset.phrase;
      handleTranslatePhrase();
    });
  });

  ["endpoint", "region"].forEach((id) => {
    $(id).addEventListener("change", () => {
      state.config.endpoint = normalizeEndpoint($("endpoint").value);
      state.config.region = $("region").value.trim();
      state.config.key = $("key").value.trim();
      saveConfigToStorage();
    });
  });

  $("key").addEventListener("change", () => {
    state.config.key = $("key").value.trim();
    saveConfigToStorage();
  });
}

function init() {
  loadConfig();
  renderConfig();
  renderChat();
  wireEvents();
  showStatus("Ready. Save your Azure endpoint and key to start translating.", "normal");
}

init();