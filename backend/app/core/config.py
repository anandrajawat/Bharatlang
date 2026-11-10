import os
import torch
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(BASE_DIR.parent / ".env"), env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Hardware & Acceleration
    DEVICE: str = "mps" if torch.backends.mps.is_available() else "cpu"
    FALLBACK_DEVICE: str = "cpu"

    # ASR Configuration
    ASR_ACTIVE_MODEL: str = "faster-whisper-small"
    ASR_FALLBACK_MODEL: str = "faster-whisper-base"
    WHISPER_COMPUTE_TYPE: str = "int8"

    # Ollama Local LLM
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:1.5b"
    OLLAMA_TIMEOUT_SECONDS: int = 60

    # Translation
    TRANSLATION_ACTIVE_ENGINE: str = "nllb-distilled-600M"
    HF_TOKEN: str = ""

    # RAG & Vector Search
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-small"
    RETRIEVAL_TOP_K: int = 4
    RETRIEVAL_SIMILARITY_THRESHOLD: float = 0.35

    # Text-to-Speech
    TTS_VOICE: str = "mr-IN-AarohiNeural"
    TTS_FALLBACK_VOICE: str = "mr-IN-ManoharNeural"

    # Storage Paths
    DATABASE_URL: str = f"sqlite:///{DATA_DIR}/bharatlangtech.db"
    DOCUMENTS_DIR: Path = DATA_DIR / "documents"
    INDEXES_DIR: Path = DATA_DIR / "indexes"
    AUDIO_DIR: Path = DATA_DIR / "audio"
    EVALUATIONS_DIR: Path = DATA_DIR / "evaluations"

    # Security & Limits
    MAX_FILE_SIZE_MB: int = 25
    MAX_AUDIO_DURATION_SEC: int = 180
    ALLOWED_AUDIO_EXTENSIONS: list[str] = [".wav", ".mp3", ".webm", ".m4a", ".ogg", ".flac"]
    ALLOWED_DOC_EXTENSIONS: list[str] = [".pdf"]
    AUDIO_RETENTION_DAYS: int = 7

settings = Settings()

# Ensure directories exist
for path in [settings.DOCUMENTS_DIR, settings.INDEXES_DIR, settings.AUDIO_DIR, settings.EVALUATIONS_DIR]:
    path.mkdir(parents=True, exist_ok=True)
