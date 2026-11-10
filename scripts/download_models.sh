#!/usr/bin/env bash
# ==============================================================================
# BharatLangTech AI - Model Download and Pre-caching Script
# Downloads and caches all open-source local AI models offline.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "======================================================================"
echo "📥 BharatLangTech AI - Local Open-Source AI Model Manager"
echo "======================================================================"

cd "$ROOT_DIR"
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# 1. Ollama and Local LLM (Qwen2.5 1.5B)
echo "[1/4] Verifying Ollama and local LLM (qwen2.5:1.5b)..."
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install via: brew install ollama"
    exit 1
fi

# Ensure Ollama daemon is active
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Starting Ollama service..."
    if command -v brew &> /dev/null && brew services list | grep -q "ollama"; then
        brew services start ollama
    else
        ollama serve > /dev/null 2>&1 &
    fi
    sleep 3
fi

echo "Checking Ollama model: qwen2.5:1.5b..."
if ollama list | grep -q "qwen2.5:1.5b"; then
    echo "✅ Ollama model 'qwen2.5:1.5b' is already downloaded and ready."
else
    echo "Downloading qwen2.5:1.5b (~986MB)..."
    ollama pull qwen2.5:1.5b
    echo "✅ Downloaded qwen2.5:1.5b."
fi

# 2. Tesseract OCR Marathi & Hindi Models
echo "[2/4] Verifying Tesseract OCR Devanagari models..."
TESSDATA_DIR="$ROOT_DIR/backend/data/tessdata"
mkdir -p "$TESSDATA_DIR"

if [ ! -f "$TESSDATA_DIR/mar.traineddata" ]; then
    echo "Downloading Marathi OCR model (mar.traineddata)..."
    curl -L "https://github.com/tesseract-ocr/tessdata_fast/raw/main/mar.traineddata" -o "$TESSDATA_DIR/mar.traineddata"
    echo "✅ Downloaded mar.traineddata."
else
    echo "✅ mar.traineddata is present."
fi

if [ ! -f "$TESSDATA_DIR/hin.traineddata" ]; then
    echo "Downloading Hindi OCR model (hin.traineddata)..."
    curl -L "https://github.com/tesseract-ocr/tessdata_fast/raw/main/hin.traineddata" -o "$TESSDATA_DIR/hin.traineddata"
    echo "✅ Downloaded hin.traineddata."
else
    echo "✅ hin.traineddata is present."
fi

# 3. Sentence Transformers Multilingual Embedding Model
echo "[3/4] Pre-caching Multilingual Embedding Model (intfloat/multilingual-e5-small)..."
python -c "
import os
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
from sentence_transformers import SentenceTransformer
print('Loading multilingual-e5-small into cache...')
model = SentenceTransformer('intfloat/multilingual-e5-small')
print('✅ multilingual-e5-small cached successfully. Embedding dimension:', model.get_sentence_embedding_dimension())
"

# 4. Faster-Whisper ASR Model Pre-caching
echo "[4/4] Pre-caching Faster-Whisper model (small)..."
python -c "
import os
from faster_whisper import WhisperModel
print('Loading faster-whisper small model...')
model = WhisperModel('small', device='cpu', compute_type='int8')
print('✅ faster-whisper small cached successfully.')
"

echo "======================================================================"
echo "🎉 All local AI models are cached and verified for offline operation!"
echo "======================================================================"
