# Summize — AI Article Summarizer

A modern, fast web application that transforms lengthy online articles into clear, concise summaries using Google Gemini 3.8 Flash AI and Jina Reader.

## ✨ Features

- **Reliable Web Extraction**: Uses CORS-friendly high-fidelity article extraction (via Jina Reader) to extract clean readability text from public article links.
- **AI-Powered Summarization**: Powered by Google's state-of-the-art `gemini-3.8-flash` model.
- **Instant Summary Style Switching**: Generate **Key Bullets**, **Standard**, and **Detailed** summaries in one Gemini request, then switch styles without additional API calls.
- **History Management**: Automatically saves your summarized articles to LocalStorage with deduplication, single-item deletion, and clear-all capabilities.
- **One-Click Copy**: Copy source URLs or generated summaries directly to your clipboard.
- **In-App API Key Configuration**: Connect or update your free Gemini API key either via `.env` or directly through the UI.
- **Zero Heavy Dependencies**: Removed bulky state management dependencies for a lightweight, sub-millisecond build.

> **API key note:** This is a browser-only app. API keys entered in the UI or configured with a `VITE_` variable are available to the browser and can be inspected by users. For a public deployment, proxy API requests through a backend and restrict your keys in Google AI Studio.

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/ajaykumarn07/ai-summarizer.git
cd ai-summarizer
npm install
```

### 2. Environment Setup (Optional)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add your Google Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: You can get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey) without requiring a credit card. Alternatively, you can paste the key directly in the app's settings dialog in your browser.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 18**
- **Vite 5**
- **Tailwind CSS 3**
- **Google Gemini Flash API**
- **Jina Reader API**
