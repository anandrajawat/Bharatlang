#!/usr/bin/env bash
# ==============================================================================
# BharatLangTech AI - Automated System Setup Script
# Target: Apple Silicon Mac (M1/M2/M3) macOS, Python 3.11+, Node.js 18+
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "======================================================================"
echo "🇮🇳 BharatLangTech AI - Environment Setup & Verification"
echo "======================================================================"

# 1. Architecture Check
ARCH=$(uname -m)
OS=$(uname -s)
echo "[1/6] Checking system hardware and OS..."
if [[ "$OS" != "Darwin" ]]; then
    echo "⚠️ Warning: Detected OS '$OS'. BharatLangTech AI is optimized for macOS Apple Silicon."
elif [[ "$ARCH" == "arm64" ]]; then
    echo "✅ Apple Silicon ($ARCH) detected. Metal Performance Shaders (MPS) supported."
else
    echo "ℹ️ System architecture: $ARCH (macOS). Running in CPU compatibility mode."
fi

# 2. Check System Prerequisites (Homebrew, ffmpeg, tesseract, ollama)
echo "[2/6] Checking required system tools..."
MISSING_TOOLS=()

if ! command -v ffmpeg &> /dev/null; then
    MISSING_TOOLS+=("ffmpeg")
else
    echo "✅ ffmpeg is installed: $(ffmpeg -version | head -n 1)"
fi

if ! command -v tesseract &> /dev/null; then
    MISSING_TOOLS+=("tesseract")
else
    echo "✅ tesseract is installed: $(tesseract --version | head -n 1)"
fi

if ! command -v ollama &> /dev/null; then
    MISSING_TOOLS+=("ollama")
else
    echo "✅ ollama is installed: $(ollama --version)"
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo "⚠️ Missing system tools: ${MISSING_TOOLS[*]}"
    echo "Please install them via Homebrew:"
    echo "   brew install ${MISSING_TOOLS[*]}"
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew is not installed. Please install Homebrew from https://brew.sh"
        exit 1
    fi
    echo "Installing missing tools now via brew..."
    brew install "${MISSING_TOOLS[@]}"
fi

# 3. Setup Python Virtual Environment
echo "[3/6] Setting up Python virtual environment..."
cd "$ROOT_DIR"

PYTHON_BIN=""
for cmd in python3.14 python3.13 python3.12 python3.11 python3; do
    if command -v "$cmd" &> /dev/null; then
        PYTHON_BIN="$cmd"
        break
    fi
done

if [ -z "$PYTHON_BIN" ]; then
    echo "❌ No compatible Python 3.11+ found. Please install Python 3.11+."
    exit 1
fi
echo "Using Python: $($PYTHON_BIN --version) at $(which $PYTHON_BIN)"

if [ ! -d ".venv" ]; then
    echo "Creating virtual environment at .venv..."
    $PYTHON_BIN -m venv --system-site-packages .venv
fi

source .venv/bin/activate
echo "Virtualenv active: $(which python)"

# 4. Install Python Dependencies
echo "[4/6] Installing / updating Python dependencies..."
pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

# 5. Create Data Directories & Copy Environment File
echo "[5/6] Initializing storage directories and environment config..."
mkdir -p backend/data/uploads
mkdir -p backend/data/indexes
mkdir -p backend/data/audio_cache
mkdir -p backend/data/tessdata

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
    fi
fi

# 6. Install Frontend Dependencies
echo "[6/6] Checking frontend dependencies (npm)..."
if command -v npm &> /dev/null; then
    cd "$ROOT_DIR/frontend"
    if [ ! -d "node_modules" ]; then
        echo "Running npm install in frontend..."
        npm install
    else
        echo "✅ frontend/node_modules already present."
    fi
    cd "$ROOT_DIR"
else
    echo "⚠️ Node.js / npm not found. Please install Node.js (v18+) to run the React frontend."
fi

# Make scripts executable
chmod +x "$ROOT_DIR"/scripts/*.sh 2>/dev/null || true

echo "======================================================================"
echo "🎉 Setup complete! Next steps:"
echo " 1. Run ./scripts/download_models.sh to pull and verify local AI models."
echo " 2. Run ./scripts/start.sh to launch both Backend and Frontend."
echo "======================================================================"

