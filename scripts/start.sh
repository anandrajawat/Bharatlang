#!/usr/bin/env bash
# ==============================================================================
# BharatLangTech AI - Unified System Startup Script
# Boots FastAPI Backend and React Frontend with health checks and graceful cleanup.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BACKEND_PORT=8000
FRONTEND_PORT=5173

echo "======================================================================"
echo "🌾 BharatLangTech AI – Dialect-Aware Multilingual Voice Platform"
echo "======================================================================"

cd "$ROOT_DIR"

# Ensure venv exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Running setup..."
    bash scripts/setup.sh
fi

source .venv/bin/activate

# Check Ollama status
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Starting Ollama background service..."
    if command -v brew &> /dev/null && brew services list | grep -q "ollama"; then
        brew services start ollama
    else
        ollama serve > /dev/null 2>&1 &
    fi
    sleep 3
fi

# Cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down BharatLangTech AI services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "Services stopped cleanly."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend
echo "[1/2] Starting FastAPI Backend on port ${BACKEND_PORT}..."
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${BACKEND_PORT} &
BACKEND_PID=$!

# Wait for backend health check
echo "Waiting for Backend health endpoint..."
for i in {1..30}; do
    if curl -s "http://localhost:${BACKEND_PORT}/api/health" | grep -q '"status":"healthy"'; then
        echo "✅ Backend is healthy at http://localhost:${BACKEND_PORT}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to become healthy within 30 seconds."
        exit 1
    fi
done

# 2. Start Frontend
echo "[2/2] Starting React Vite Frontend on port ${FRONTEND_PORT}..."
cd "$ROOT_DIR/frontend"
npm run dev -- --host &
FRONTEND_PID=$!

echo "======================================================================"
echo "🎉 BharatLangTech AI is RUNNING!"
echo "👉 Web Application:     http://localhost:${FRONTEND_PORT}"
echo "👉 API Documentation:   http://localhost:${BACKEND_PORT}/docs"
echo "👉 Health Check:        http://localhost:${BACKEND_PORT}/api/health"
echo "👉 Ollama LLM Service:  http://localhost:11434"
echo "======================================================================"
echo "Press Ctrl+C to stop all services."

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
