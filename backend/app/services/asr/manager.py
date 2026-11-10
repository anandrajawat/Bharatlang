from typing import Dict, Any, Optional
from backend.app.services.asr.base import ASREngine, TranscriptionResult
from backend.app.services.asr.whisper import FasterWhisperEngine
from backend.app.services.asr.indicconformer import IndicConformerEngine
from backend.app.core.config import settings
from backend.app.core.logging import logger

class ASRManager:
    """
    Central Model Registry and Manager for ASR engines.
    Provides lazy loading, model switching, memory unloading, and execution routing.
    """

    def __init__(self):
        self.active_engine_name = settings.ASR_ACTIVE_MODEL
        self._engines: Dict[str, ASREngine] = {
            "faster-whisper-small": FasterWhisperEngine(model_size="small", compute_type=settings.WHISPER_COMPUTE_TYPE),
            "faster-whisper-base": FasterWhisperEngine(model_size="base", compute_type=settings.WHISPER_COMPUTE_TYPE),
            "indicconformer-mr": IndicConformerEngine()
        }

    def get_active_engine(self) -> ASREngine:
        if self.active_engine_name not in self._engines:
            logger.warning(f"Engine {self.active_engine_name} not found. Falling back to faster-whisper-small.")
            self.active_engine_name = "faster-whisper-small"
        return self._engines[self.active_engine_name]

    def set_active_engine(self, engine_name: str) -> bool:
        if engine_name in self._engines:
            # Unload old engine to free memory on 16GB Mac
            if self.active_engine_name != engine_name:
                curr = self._engines.get(self.active_engine_name)
                if curr and curr.is_loaded():
                    curr.unload_model()
            self.active_engine_name = engine_name
            logger.info(f"Active ASR engine switched to: {engine_name}")
            return True
        return False

    def list_engines(self) -> Dict[str, Any]:
        return {
            "active_engine": self.active_engine_name,
            "available_engines": list(self._engines.keys()),
            "loaded_engines": [name for name, eng in self._engines.items() if eng.is_loaded()]
        }

    def unload_all(self) -> None:
        """Frees all ASR memory."""
        for eng in self._engines.values():
            if eng.is_loaded():
                eng.unload_model()

# Global singleton
asr_manager = ASRManager()
