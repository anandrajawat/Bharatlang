# ==============================================================================
# BharatLangTech AI - Production Multi-Stage Dockerfile
# Builds React Frontend and FastAPI Backend into an optimized container
# ==============================================================================

# Stage 1: Build Frontend Assets
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend & Final Runtime
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    TESSDATA_PREFIX=/app/backend/data/tessdata

WORKDIR /app

# Install system dependencies (ffmpeg, tesseract Devanagari models, curl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    tesseract-ocr \
    tesseract-ocr-mar \
    tesseract-ocr-hin \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY scripts/ ./scripts/

# Copy built frontend assets to static directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Initialize directories & Tesseract traineddata
RUN mkdir -p backend/data/uploads backend/data/indexes backend/data/audio_cache backend/data/tessdata \
    && cp -n /usr/share/tesseract-ocr/4.00/tessdata/mar.traineddata backend/data/tessdata/ 2>/dev/null || true \
    && cp -n /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata backend/data/tessdata/ 2>/dev/null || true

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

