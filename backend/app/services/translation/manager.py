from typing import Dict, Any, Optional
from backend.app.services.translation.nllb import NLLBTranslationEngine
from backend.app.services.translation.normalization import (
    detect_language_and_dialect,
    normalize_varhadi_to_marathi,
    GLOSSARY_MARATHI_ENGLISH
)
from backend.app.core.config import settings
from backend.app.core.logging import logger

class TranslationManager:
    """
    Manages translation pipelines across supported language routes:
    - Marathi -> English
    - English -> Marathi
    - Hindi -> English
    - English -> Hindi
    - Varhadi dialectal normalization prior to translation.
    """

    def __init__(self):
        self._nllb_engine: Optional[NLLBTranslationEngine] = None

    def _get_engine(self) -> NLLBTranslationEngine:
        if self._nllb_engine is None:
            self._nllb_engine = NLLBTranslationEngine()
        return self._nllb_engine

    def process_and_translate(
        self,
        text: str,
        src_lang: str = "mr",
        tgt_lang: str = "en"
    ) -> Dict[str, Any]:
        """
        Executes end-to-end translation pipeline:
        1. Language & Dialect Detection
        2. Dialect Normalization (preserving original text)
        3. Neural Translation
        4. Glossary-aware verification
        """
        if not text or not text.strip():
            return {
                "original_text": text,
                "normalized_text": text,
                "translated_text": "",
                "detected_dialect": "unknown",
                "replacements": []
            }

        # Step 1: Detect dialect & language markers
        detection = detect_language_and_dialect(text)
        detected_dialect = detection["dialect"]

        # Step 2: Normalize Varhadi dialect to standard Marathi if needed
        normalized_text, replacements = normalize_varhadi_to_marathi(text)

        # Step 3: Neural translation with NLLB
        engine = self._get_engine()
        trans_result = engine.translate(
            text=normalized_text,
            src_lang=src_lang,
            tgt_lang=tgt_lang
        )

        return {
            "original_text": text,
            "normalized_text": normalized_text,
            "translated_text": trans_result["translated_text"],
            "detected_dialect": detected_dialect,
            "replacements": replacements,
            "duration_sec": trans_result.get("duration_sec", 0.0),
            "model": trans_result.get("model", "nllb-200-distilled-600M")
        }

    def unload(self) -> None:
        if self._nllb_engine is not None and self._nllb_engine.is_loaded():
            self._nllb_engine.unload_model()

translation_manager = TranslationManager()
