import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.logging import logger, LatencyLoggingMiddleware
from backend.app.database.session import init_db
from backend.app.api.speech import router as speech_router
from backend.app.api.translation import router as translation_router
from backend.app.api.chat import router as chat_router
from backend.app.api.documents import router as documents_router
from backend.app.api.feedback import router as feedback_router
from backend.app.api.evaluation import router as evaluation_router
from backend.app.api.health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and directories
    logger.info("Initializing BharatLangTech AI backend...")
    init_db()
    settings.AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    settings.DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    settings.INDEXES_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"BharatLangTech AI initialized successfully on device: {settings.DEVICE}")
    yield
    # Shutdown: free model resources
    logger.info("Shutting down BharatLangTech AI...")

app = FastAPI(
    title="BharatLangTech AI – Multilingual Voice Intelligence Platform",
    description="Dialect-Aware Multilingual Voice AI Platform for Marathi and Varhadi citizens.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [orig.strip() for orig in settings.CORS_ORIGINS.split(",") if orig.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Latency and Logging Middleware
app.add_middleware(LatencyLoggingMiddleware)

# Mount Static Files for generated audio and documents
app.mount("/static/audio", StaticFiles(directory=str(settings.AUDIO_DIR)), name="audio")

# Include API Routers
app.include_router(health_router)
app.include_router(speech_router)
app.include_router(translation_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(feedback_router)
app.include_router(evaluation_router)

@app.get("/")
def root():
    return {
        "platform": "BharatLangTech AI",
        "description": "Dialect-Aware Multilingual Voice Intelligence Platform",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
