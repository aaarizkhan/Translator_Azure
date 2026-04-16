# 🌐 PaperGlow Translator

PaperGlow Translator is a clean, modern web application powered by the **Azure Translator API** that allows users to translate both **text** and **documents (PDF, DOCX, TXT, HTML)** in a simple and intuitive interface.

---

## ✨ Features

### 🔤 Text Translation

* Translate text between multiple languages
* Automatic language detection
* Fast and responsive output

### 📄 Document Translation

* Upload and translate files:

  * PDF
  * DOCX
  * TXT / Markdown
  * HTML
* Extracts text from files and translates it
* Handles large content using chunk-based translation

### 🎨 Modern Light UI

* Clean and minimal design (non-dark theme)
* Smooth and user-friendly experience
* Focused workflow with no distractions

---

## ⚙️ Tech Stack

* **HTML5**
* **CSS3** (Modern light UI design)
* **Vanilla JavaScript**
* **Azure Translator API**
* **PDF.js** (for PDF text extraction)
* **Mammoth.js** (for DOCX text extraction)

---

## 🔐 Configuration

To use the app, you need your own Azure Translator credentials:

* **Endpoint**
* **API Key**
* **Region**

### Example:

```
Endpoint: https://api.cognitive.microsofttranslator.com
Region: centralindia
```

---

## 🚀 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/paperglow-translator.git
   ```

2. Open the project folder:

   ```bash
   cd paperglow-translator
   ```

3. Run using Live Server or open:

   ```
   index.html
   ```

4. Enter your Azure credentials in the sidebar

5. Click **Load languages** and start translating

---

## ⚠️ Important Notes

* This is a **frontend-only project**
* API keys are stored in the browser (not secure for production)
* For production deployment, use a backend (Node.js / Flask)

### 📌 PDF Limitation

* Works for **text-based PDFs**
* ❌ Scanned PDFs (images) are not supported

  * Requires OCR for full support

---

## 🌟 Future Improvements

* OCR support for scanned PDFs
* Full file translation (preserving layout)
* Backend integration for security
* Drag-and-drop file upload
* Translation history

---

## 📸 Preview

A bright, modern UI designed for simplicity and productivity.

---

## 📄 License

This project is open-source and free to use.

---

## 🙌 Acknowledgements

* Microsoft Azure Translator API
* PDF.js
* Mammoth.js
