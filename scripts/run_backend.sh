#!/usr/bin/env bash
# ==============================================================================
# BharatLangTech AI - Backend Server Runner
# Starts the FastAPI application with Uvicorn.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$ROOT_DIR"

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Ensure data directories exist
mkdir -p backend/data/uploads backend/data/indexes backend/data/audio_cache backend/data/tessdata

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚠️ Ollama is not running on port 11434. Starting Ollama..."
    if command -v brew &> /dev/null && brew services list | grep -q "ollama"; then
        brew services start ollama
    else
        ollama serve > /dev/null 2>&1 &
    fi
    sleep 2
fi

PORT="${PORT:-8000}"
HOST="${HOST:-0.0.0.0}"

echo "======================================================================"
echo "🚀 Starting BharatLangTech AI FastAPI Backend on http://${HOST}:${PORT}"
echo "======================================================================"

exec python -m uvicorn backend.app.main:app --host "$HOST" --port "$PORT" --reload

