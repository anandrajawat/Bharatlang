from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from typing import Optional, List, Dict
from backend.app.services.translation.manager import translation_manager
from backend.app.services.translation.normalization import (
    detect_language_and_dialect,
    normalize_varhadi_to_marathi,
    GLOSSARY_MARATHI_ENGLISH,
    VARHADI_TO_STANDARD_MARATHI
)

router = APIRouter(prefix="/api/translation", tags=["Translation & Dialects"])

class TranslationRequest(BaseModel):
    text: str
    src_lang: str = "mr"
    tgt_lang: str = "en"

class DialectRequest(BaseModel):
    text: str

@router.post("/translate")
async def translate_text(req: TranslationRequest):
    """
    Translates text between supported language routes (Marathi <-> English, Hindi <-> English)
    with automatic dialect normalization and terminology preservation.
    """
    if not req.text.strip():
        return {"translated_text": "", "src_lang": req.src_lang, "tgt_lang": req.tgt_lang}

    try:
        result = translation_manager.process_and_translate(
            text=req.text,
            src_lang=req.src_lang,
            tgt_lang=req.tgt_lang
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@router.post("/normalize-dialect")
async def normalize_dialect(req: DialectRequest):
    """
    Identifies Varhadi regional dialect markers and produces a normalized Marathi representation,
    preserving the user's original transcript intact.
    """
    detection = detect_language_and_dialect(req.text)
    normalized, replacements = normalize_varhadi_to_marathi(req.text)
    return {
        "original_text": req.text,
        "normalized_text": normalized,
        "dialect": detection["dialect"],
        "is_code_switched": detection["is_code_switched"],
        "detected_markers": detection.get("detected_markers", []),
        "replacements": replacements
    }

@router.get("/glossary")
async def get_terminology_glossary():
    """
    Returns custom government and agricultural terminology glossary with Varhadi mappings.
    """
    return {
        "government_agricultural_glossary": GLOSSARY_MARATHI_ENGLISH,
        "varhadi_lexical_mappings": VARHADI_TO_STANDARD_MARATHI
    }
