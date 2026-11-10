import psutil
import torch
from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.services.llm.ollama_client import ollama_client
from backend.app.services.asr.manager import asr_manager
from backend.app.services.rag.retrieval import faiss_retriever

router = APIRouter(prefix="/api/health", tags=["System Health & Hardware Diagnostics"])

@router.get("")
async def system_health():
    """
    Returns live system diagnostics, hardware acceleration status (Apple Silicon MPS / Metal),
    Ollama LLM connection state, and memory consumption.
    """
    ollama_ok = await ollama_client.is_available()
    mem = psutil.virtual_memory()

    return {
        "status": "healthy",
        "platform": "Apple Silicon (macOS)",
        "hardware": {
            "torch_version": torch.__version__,
            "mps_available": torch.backends.mps.is_available(),
            "mps_built": torch.backends.mps.is_built(),
            "active_device": settings.DEVICE,
            "system_total_memory_gb": round(mem.total / (1024**3), 2),
            "system_available_memory_gb": round(mem.available / (1024**3), 2),
            "memory_percent_used": mem.percent
        },
        "services": {
            "ollama_local_llm": {
                "configured_url": settings.OLLAMA_BASE_URL,
                "configured_model": settings.OLLAMA_MODEL,
                "is_running": ollama_ok
            },
            "asr_engine": asr_manager.list_engines(),
            "rag_knowledge_base": faiss_retriever.get_stats(),
            "tts_voice": settings.TTS_VOICE
        }
    }

