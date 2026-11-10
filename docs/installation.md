# BharatLangTech AI – Installation & Setup Guide

This guide walks through configuring and running **BharatLangTech AI** on macOS with Apple Silicon (M1/M2/M3) using 100% open-source, local AI models.

---

## 1. System Requirements

* **Operating System:** macOS Ventura (13.0) or later (macOS Sonoma / Sequoia tested).
* **Processor:** Apple Silicon (M1, M2, M3, M4) with Metal acceleration.
* **Unified Memory (RAM):** 16 GB recommended (8 GB supported in CPU quantized mode).
* **Disk Space:** ~5 GB free space (for models, indexes, and dependencies).
* **Network:** Required for initial dependency and model downloads; **zero internet required during runtime** (except optional Edge TTS fallback).

---

## 2. Prerequisites Installation

Install the required system CLI packages using [Homebrew](https://brew.sh):

```bash
# 1. Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Audio Processing, OCR, and Ollama
brew install ffmpeg tesseract ollama node
```

Verify the installations:
```bash
ffmpeg -version | head -n 1
tesseract --version | head -n 1
ollama --version
node -v
```

---

## 3. Automated One-Command Setup

The project includes automated setup and model downloading scripts:

```bash
# Clone and enter directory
cd /path/to/Bharatlang

# Step 1: Run environment setup
# Sets up Python virtual environment (.venv), installs pip packages and npm modules
bash scripts/setup.sh

# Step 2: Download & pre-cache local AI models
# Pulls Qwen2.5 1.5B via Ollama, downloads Marathi OCR traineddata, and caches multilingual-e5-small
bash scripts/download_models.sh
```

---

## 4. Manual Configuration (Optional)

If you prefer to configure manually, examine the `.env` configuration file:

```ini
# Environment Configuration
PROJECT_NAME="BharatLangTech AI"
ENVIRONMENT="development"
DEBUG=true

# Apple Silicon Acceleration
USE_MPS=true
TORCH_DTYPE="float32"

# Ollama LLM Configuration
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:1.5b"
OLLAMA_CONTEXT_WINDOW=1536
OLLAMA_TEMPERATURE=0.1

# Speech Recognition (ASR)
DEFAULT_ASR_ENGINE="faster-whisper-small"
WHISPER_DEVICE="cpu"
WHISPER_COMPUTE_TYPE="int8"

# Vector Search (RAG)
EMBEDDING_MODEL_NAME="intfloat/multilingual-e5-small"
RETRIEVAL_TOP_K=3
RETRIEVAL_SIMILARITY_THRESHOLD=0.30

# File Paths
DATA_DIR="backend/data"
UPLOADS_DIR="backend/data/uploads"
INDEXES_DIR="backend/data/indexes"
AUDIO_CACHE_DIR="backend/data/audio_cache"
TESSDATA_PREFIX="backend/data/tessdata"
```

---

## 5. Starting the Application

You can launch both the FastAPI Backend and Vite React Frontend with a single command:

```bash
bash scripts/start.sh
```

This script:
1. Verifies that Ollama is active on port 11434.
2. Starts the FastAPI server on `http://localhost:8000`.
3. Waits for the `/api/health` probe to confirm system readiness.
4. Starts the React development server on `http://localhost:5173`.
5. Gracefully terminates both processes on `Ctrl + C`.

### Running Components Individually

**FastAPI Backend only:**
```bash
bash scripts/run_backend.sh
# Accessible at http://localhost:8000
# Interactive Swagger docs: http://localhost:8000/docs
```

**React Frontend only:**
```bash
bash scripts/run_frontend.sh
# Accessible at http://localhost:5173
```

---

## 6. Running the Test Suite

Execute the comprehensive automated test suite:

```bash
source .venv/bin/activate
pytest backend/tests/ -v
```

This verifies:
* End-to-end grounded scheme retrieval (Scenario 1)
* Varhadi dialect normalization (Scenario 2)
* Out-of-domain rejection without hallucination (Scenario 4)
* Health endpoint diagnostic checks (Scenario 6)
* ASR engine switching (Scenario 7)
* Upload validation and security bounds (Scenario 8)
* Citizen feedback loop and admin review (Scenario 9)

---

## 7. Troubleshooting

### Issue: Ollama connection refused (`ConnectionRefusedError: [Errno 61]`)
* **Solution:** Verify the Ollama service is running:
  ```bash
  brew services restart ollama
  # Or start in foreground
  ollama serve
  ```

### Issue: Tesseract cannot find Marathi data (`mar.traineddata`)
* **Solution:** Ensure `mar.traineddata` exists inside `backend/data/tessdata/`:
  ```bash
  curl -L "https://github.com/tesseract-ocr/tessdata_fast/raw/main/mar.traineddata" -o backend/data/tessdata/mar.traineddata
  ```

### Issue: Port 8000 or 5173 already in use
* **Solution:** Terminate any stale processes:
  ```bash
  lsof -ti:8000 | xargs kill -9
  lsof -ti:5173 | xargs kill -9
  ```

