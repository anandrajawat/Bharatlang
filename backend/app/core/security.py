import os
import re
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from backend.app.core.config import settings

def sanitize_filename(filename: str) -> str:
    """
    Remove dangerous characters and path traversal tokens from uploaded filenames.
    """
    base = os.path.basename(filename)
    # Remove directory separators and null bytes
    cleaned = re.sub(r'[\/\\\x00]', '', base)
    # Replace non-alphanumeric (except . - _) with underscore
    cleaned = re.sub(r'[^a-zA-Z0-9._\-]', '_', cleaned)
    # Avoid hidden files or double dots
    cleaned = cleaned.lstrip('.')
    if not cleaned:
        cleaned = "unnamed_file"
    return cleaned

def validate_audio_file(file: UploadFile) -> None:
    """
    Validate uploaded audio file extension, content-type and nominal size.
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio format '{ext}'. Allowed: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}"
        )

def validate_document_file(file: UploadFile) -> None:
    """
    Validate uploaded document extension and headers.
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in settings.ALLOWED_DOC_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported document format '{ext}'. Only PDF documents (.pdf) are currently supported."
        )

def sanitize_user_input(text: str, max_chars: int = 1500) -> str:
    """
    Sanitize text input, stripping null characters and enforcing length boundary.
    """
    if not text:
        return ""
    cleaned = text.replace('\x00', '').strip()
    if len(cleaned) > max_chars:
        cleaned = cleaned[:max_chars]
    return cleaned

def check_path_traversal(target_path: Path, base_dir: Path) -> bool:
    """
    Ensure target_path resolves strictly inside base_dir.
    """
    try:
        resolved_target = target_path.resolve()
        resolved_base = base_dir.resolve()
        return resolved_base in resolved_target.parents or resolved_target == resolved_base
    except Exception:
        return False

