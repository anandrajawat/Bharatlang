import time
import re
from typing import Optional, Dict
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from backend.app.services.translation.normalization import GLOSSARY_MARATHI_ENGLISH
from backend.app.core.config import settings
from backend.app.core.logging import logger

NLLB_LANG_CODES = {
    "mr": "mar_Deva",
    "marathi": "mar_Deva",
    "mr-varhadi": "mar_Deva",
    "varhadi": "mar_Deva",
    "en": "eng_Latn",
    "english": "eng_Latn",
    "hi": "hin_Deva",
    "hindi": "hin_Deva"
}

class NLLBTranslationEngine:
    """
    Meta NLLB-200 Distilled 600M Translation Engine.
    High-precision open-source multilingual neural translation model.
    """

    def __init__(self, model_id: str = "facebook/nllb-200-distilled-600M"):
        self.model_id = model_id
        self.tokenizer = None
        self.model = None
        self._is_loaded = False

    def load_model(self) -> None:
        if self._is_loaded and self.model is not None:
            return

        logger.info(f"Loading NLLB translation model '{self.model_id}'...")
        t0 = time.time()
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
        # Load onto CPU or MPS
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_id)
        self._is_loaded = True
        logger.info(f"NLLB translation model loaded in {time.time() - t0:.2f}s")

    def unload_model(self) -> None:
        if self.model is not None:
            del self.model
            del self.tokenizer
            self.model = None
            self.tokenizer = None
            self._is_loaded = False
            logger.info("NLLB translation model unloaded from memory.")

    def is_loaded(self) -> bool:
        return self._is_loaded and self.model is not None

    def translate(
        self,
        text: str,
        src_lang: str = "mr",
        tgt_lang: str = "en"
    ) -> Dict[str, str]:
        if not text or not text.strip():
            return {"translated_text": "", "src_lang": src_lang, "tgt_lang": tgt_lang}

        if not self.is_loaded():
            self.load_model()

        src_code = NLLB_LANG_CODES.get(src_lang.lower(), "mar_Deva")
        tgt_code = NLLB_LANG_CODES.get(tgt_lang.lower(), "eng_Latn")

        # Skip if source and target are the same
        if src_code == tgt_code:
            return {"translated_text": text, "src_lang": src_lang, "tgt_lang": tgt_lang}

        t0 = time.time()
        self.tokenizer.src_lang = src_code
        inputs = self.tokenizer(text, return_tensors="pt")

        forced_bos_token_id = self.tokenizer.convert_tokens_to_ids(tgt_code)
        outputs = self.model.generate(
            **inputs,
            forced_bos_token_id=forced_bos_token_id,
            max_length=256,
            num_beams=4,
            early_stopping=True
        )

        translated = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        duration = time.time() - t0

        return {
            "translated_text": translated.strip(),
            "src_lang": src_lang,
            "tgt_lang": tgt_lang,
            "duration_sec": round(duration, 3),
            "model": "nllb-200-distilled-600M"
        }
