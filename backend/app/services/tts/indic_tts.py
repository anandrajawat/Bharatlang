import os
import uuid
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional
import edge_tts
from backend.app.core.config import settings
from backend.app.core.logging import logger

class IndicTTSService:
    """
    Marathi Text-to-Speech synthesis service.
    Default voices:
    - mr-IN-AarohiNeural (Female, Natural)
    - mr-IN-ManoharNeural (Male, Natural)
    Provides graceful text fallback on network or model failure.
    """

    def __init__(
        self,
        voice: str = settings.TTS_VOICE,
        audio_dir: Path = settings.AUDIO_DIR
    ):
        self.voice = voice
        self.audio_dir = audio_dir
        self.audio_dir.mkdir(parents=True, exist_ok=True)

    async def synthesize_speech(
        self,
        text: str,
        voice: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Converts Marathi text to an MP3 audio file.
        Returns a dictionary with audio file path and status.
        """
        if not text or not text.strip():
            return {
                "success": False,
                "audio_url": None,
                "error": "Empty text provided for speech synthesis."
            }

        # Truncate overly long text for audio playback (summarize first 400 characters)
        clean_text = text.strip()
        if len(clean_text) > 600:
            # Speak the first 2-3 sentences for natural listening
            sentences = clean_text.split("।")
            if len(sentences) > 1:
                clean_text = "।".join(sentences[:3]) + "।"
            else:
                clean_text = clean_text[:500]

        target_voice = voice or self.voice
        filename = f"tts_{uuid.uuid4().hex[:10]}.mp3"
        output_path = self.audio_dir / filename

        try:
            logger.info(f"Synthesizing Marathi audio ({len(clean_text)} chars) with voice '{target_voice}'...")
            communicate = edge_tts.Communicate(clean_text, target_voice)
            await communicate.save(str(output_path))

            if not output_path.exists() or os.path.getsize(output_path) == 0:
                raise RuntimeError("Synthesized audio file is empty.")

            return {
                "success": True,
                "audio_filename": filename,
                "audio_url": f"/static/audio/{filename}",
                "file_path": str(output_path),
                "voice": target_voice,
                "char_length": len(clean_text),
                "is_fallback": False
            }

        except Exception as e:
            logger.warning(f"TTS synthesis failed: {e}. Falling back to text-only mode.")
            return {
                "success": False,
                "audio_url": None,
                "voice": target_voice,
                "is_fallback": True,
                "error": f"Audio synthesis unavailable: {str(e)}"
            }

indic_tts = IndicTTSService()
