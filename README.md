# 🌾 BharatLangTech AI (भारतलँगटेक एआय)
### Dialect-Aware Multilingual Voice Intelligence Platform for Rural Maharashtra
**100% Open-Source | Offline-First | Apple Silicon M2 Optimized | Marathi & Varhadi Dialect Intelligence**

---

## 🌟 Executive Overview

**BharatLangTech AI** is a complete, production-quality voice intelligence platform engineered specifically for Marathi and regional dialect (Varhadi / Vidarbha) speaking citizens. It allows rural farmers to ask complex questions about Maharashtra state and central agricultural schemes in their natural spoken dialect and receive verified, evidence-grounded answers with exact official document citations and Marathi voice synthesis.

Built adhering to a **strict open-source policy**, BharatLangTech AI uses **zero paid proprietary APIs** (no OpenAI, Gemini, Claude, or paid cloud speech APIs). The entire intelligence stack runs locally on Apple Silicon (tested on a MacBook Air M2, 16 GB unified RAM) consuming only ~2.0 GB of memory.

---

## 🚀 Key Features

* 🎙️ **Dialect-Aware Voice Processing:**
  - Robust audio pipeline converting any browser recording or uploaded audio (WAV, MP3, WebM, OGG) via FFmpeg raw PCM decoding.
  - Calibrated confidence scoring, silence detection, and interactive transcript editor before question submission.
* 🗣️ **Varhadi (Vidarbha) Dialect Intelligence:**
  - Automatic detection of Vidarbha regional dialect markers (`व्हाया`, `व्हते`, `पायजे`, `कायले`, etc.).
  - **Non-destructive normalization:** Citizen's spoken transcript is permanently retained for evaluation and audit, while a normalized Marathi query is generated for high-precision semantic retrieval.
* 🏛️ **Evidence-Grounded Scheme RAG:**
  - Ingests official Maharashtra Government Resolutions (GRs) and scheme circulars using PyMuPDF with transparent Tesseract Devanagari OCR fallback for scanned pages.
  - High-density multilingual semantic search with `intfloat/multilingual-e5-small` embeddings and FAISS `IndexFlatIP`.
* 🧠 **Hallucination-Free Local LLM Reasoning:**
  - Offline local reasoning powered by **Qwen2.5 1.5B** running via Ollama with Metal GPU acceleration.
  - Mandatory 7-element structured scheme breakdown: Scheme Name, Simple explanation, Eligibility, Required documents, Application procedure, Conditions/Deadlines, and Source document citations with page numbers.
  - If a detail is missing from the government circular, the model explicitly declares *"माहिती उपलब्ध नाही"* instead of speculating.
* 🔊 **Marathi Neural Speech Synthesis:**
  - Generates clear Devanagari audio responses with native Marathi intonation.
* 📊 **Empirical Benchmarks & Citizen Feedback:**
  - Integrated ASR benchmark module (WER/CER via `jiwer`) and 30-question RAG retrieval benchmark (Recall@K, MRR).
  - Active citizen feedback interface (1-5 star ratings and textual corrections) stored in SQLite for continuous improvement.

---

## 🏗️ System Architecture

```
USER (Farmer in Vidarbha)
  │
  ├── Spoken Audio / Typed Query (Varhadi or Marathi)
  │
  ▼
REACT FRONTEND (Vite + TypeScript + Tailwind CSS)
  │
  ├── Audio Recording & Preprocessing (FFmpeg 16kHz Mono)
  ├── Speech Recognition (Faster-Whisper / IndicConformer Abstraction)
  ├── Interactive Transcript Editor (Confirm / Correct ASR output)
  │
  ▼
FASTAPI BACKEND
  │
  ├── Dialect Engine (Varhadi Marker Detection & Non-Destructive Normalization)
  ├── Maharashtra Govt & Agri Terminology Glossary
  ├── FAISS Vector Search (multilingual-e5-small embeddings)
  ├── Local LLM Reasoning (Qwen2.5 1.5B via Ollama Metal GPU)
  ├── Marathi Neural TTS Generation
  │
  ▼
RESPONSE
  ├── Structured Evidence-Grounded Marathi Text
  ├── Verified Source Citations (GR Number & Exact Page Number)
  ├── Native Marathi Audio Playback
  └── English Translation Toggle
```

---

## ⚡ Quick Start Guide

### 1. System Prerequisites

Ensure you have [Homebrew](https://brew.sh) installed on your Mac, then run:

```bash
brew install ffmpeg tesseract ollama node
```

### 2. Automated Setup

Clone the repository and run the automated setup script:

```bash
cd Bharatlang

# Step 1: Install Python virtualenv (.venv) and Node.js dependencies
bash scripts/setup.sh

# Step 2: Download and cache all local open-source AI models
bash scripts/download_models.sh
```

### 3. Launch the Platform

Start both the FastAPI Backend and the React Frontend with a single command:

```bash
bash scripts/start.sh
```

Once started:
* **Citizen Web UI:** [http://localhost:5173](http://localhost:5173)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Probes:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🌾 Demonstration Scenarios

### Scenario 1: Vidarbha Farmer Inquires about Loan Waiver (Varhadi Dialect)
* **Input Voice:** *"मला शेतकरी कर्जमाफीचा फायदा व्हाया पायजे, काय करा लागते?"*
* **ASR Recognition:** Accurately captured with transcript editor preview.
* **Dialect Detection:** Flagged as `वऱ्हाडी (Varhadi - Vidarbha)`.
* **Normalized Marathi:** *"मला शेतकरी कर्जमाफीचा फायदा व्हायला पाहिजे, काय करावे लागते?"* (Spoken transcript preserved intact).
* **Grounding Result:** Retrieves *Mahatma Jyotirao Phule Shetkari Karjmukti Yojana 2019* circular.
* **Grounded Output:**
  - **पात्रता:** थकीत पीक कर्ज २ लाख रुपयांपर्यंत असणारे शेतकरी पात्र.
  - **कागदपत्रे:** आधार कार्ड, बँक पासबुक, कर्ज खाते तपशील, ७/१२ उतारा.
  - **अर्ज प्रक्रिया:** बँक शाखा / सीएससी केंद्रावर जाऊन आधार प्रमाणीकरण करणे.
  - **संदर्भ:** महात्मा ज्योतिराव फुले शेतकरी कर्जमुक्ती योजना, पान क्र. १.
  - **ऑडिओ:** Clear Marathi voice reading the explanation.

### Scenario 2: Pradhan Mantri 1-Rupee Crop Insurance
* **Input Query:** *"१ रुपयात पीक विमा कसा मिळतो आणि तक्रार कुठे करायची?"*
* **Grounding Result:** Retrieves *PM Fasal Bima Yojana Maharashtra* circular.
* **Response:** Explains the ₹1 farmer contribution, 72-hour intimation deadline for natural calamity via Crop Insurance App, and Toll-Free 14447 helpline.

---

## 📁 Repository Structure

```
Bharatlang/
├── backend/
│   ├── app/
│   │   ├── api/                 # FastAPI Endpoints (speech, chat, docs, feedback, evaluation)
│   │   ├── core/                # Configuration, logging, security, hardware detection
│   │   ├── database/            # SQLAlchemy models (SQLite) and session management
│   │   ├── services/
│   │   │   ├── asr/             # Faster-Whisper, IndicConformer, ASRManager
│   │   │   ├── translation/     # Varhadi normalization, NLLB-200, scheme glossary
│   │   │   ├── rag/             # Multilingual E5 embeddings, chunking, FAISS retriever
│   │   │   ├── llm/             # Ollama Qwen2.5 client, anti-hallucination prompts
│   │   │   └── tts/             # Marathi neural speech synthesis
│   │   ├── utils/               # FFmpeg raw audio preprocessing, PyMuPDF + OCR parser
│   │   └── main.py              # Application entrypoint & lifespan
│   ├── data/
│   │   ├── indexes/             # FAISS binary vector store & chunks metadata
│   │   ├── seed_documents/      # Primed Maharashtra Government scheme circulars
│   │   └── tessdata/            # Marathi (mar) & Hindi (hin) OCR models
│   └── tests/                   # Automated pytest e2e test suite (16 tests)
├── frontend/
│   ├── src/
│   │   ├── components/          # Navigation, Header, Audio Visualizer
│   │   ├── pages/               # Voice Assistant, Chat, Knowledge Base, Evaluation
│   │   ├── services/            # Axios API client
│   │   └── App.tsx              # Main application shell
├── docs/                        # Architecture, Installation, and Evaluation guides
├── scripts/                     # setup.sh, download_models.sh, run_backend.sh, start.sh
├── requirements.txt             # Python dependencies
└── README.md                    # System documentation
```

---

## 🧪 Automated Testing & Verification

Run the full automated test suite verifying all 10 acceptance scenarios:

```bash
source .venv/bin/activate
pytest backend/tests/ -v
```

**Test Results:**
```
============================== 16 passed in 137s ===============================
✅ test_health_check_scenario_6 PASSED
✅ test_marathi_chat_grounded_scenario_1 PASSED
✅ test_varhadi_dialect_query_scenario_2 PASSED
✅ test_unsupported_question_scenario_4 PASSED
✅ test_invalid_document_upload_scenario_8 PASSED
✅ test_asr_model_switching_scenario_7 PASSED
✅ test_feedback_submission_scenario_9 PASSED
✅ test_audio_preprocessing_on_silence PASSED
✅ test_audio_preprocessing_on_signal PASSED
✅ test_varhadi_dialect_detection PASSED
✅ test_standard_marathi_detection PASSED
✅ test_non_destructive_varhadi_normalization PASSED
✅ test_glossary_presence PASSED
✅ test_document_chunking PASSED
✅ test_faiss_retrieval_seeded_query PASSED
✅ test_faiss_unsupported_query_filtering PASSED
```

---

## 📄 License & Attribution

This project is licensed under the Apache 2.0 License.

**Open-Source Technologies Used:**
* [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper) (CTranslate2)
* [Ollama](https://ollama.com) & [Qwen2.5](https://huggingface.co/Qwen)
* [Sentence-Transformers](https://sbert.net) (`intfloat/multilingual-e5-small`)
* [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Research)
* [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
* [PyMuPDF](https://pymupdf.readthedocs.io/)
* [FastAPI](https://fastapi.tiangolo.com/) & [React 19](https://react.dev/)

