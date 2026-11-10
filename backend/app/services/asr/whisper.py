import time
import numpy as np
from typing import Optional, List
from faster_whisper import WhisperModel
from backend.app.services.asr.base import ASREngine, TranscriptionResult, TranscriptionSegment
from backend.app.core.config import settings
from backend.app.core.logging import logger

MARATHI_PROMPT_BIAS = "नमस्कार, मला शेतकरी कर्जमाफी, पीक विमा आणि शासकीय अनुदान योजनांबद्दल माहिती हवी आहे."

class FasterWhisperEngine(ASREngine):
    """
    High-performance Faster-Whisper ASR engine powered by CTranslate2.
    Optimized for Apple Silicon CPU int8 quantization.
    """

    def __init__(self, model_size: str = "small", compute_type: str = "int8"):
        self.model_size = model_size
        self.compute_type = compute_type
        self.model: Optional[WhisperModel] = None
        self._is_loaded = False

    def load_model(self) -> None:
        if self._is_loaded and self.model is not None:
            return

        logger.info(f"Loading faster-whisper model '{self.model_size}' (compute_type={self.compute_type})...")
        t0 = time.time()
        # On Apple Silicon M2, CPU int8 with CTranslate2 provides optimized low latency
        self.model = WhisperModel(
            self.model_size,
            device="cpu",
            compute_type=self.compute_type,
            cpu_threads=4
        )
        self._is_loaded = True
        logger.info(f"Faster-whisper '{self.model_size}' loaded in {time.time() - t0:.2f}s")

    def unload_model(self) -> None:
        if self.model is not None:
            del self.model
            self.model = None
            self._is_loaded = False
            logger.info(f"Faster-whisper '{self.model_size}' unloaded from memory.")

    def is_loaded(self) -> bool:
        return self._is_loaded and self.model is not None

    def transcribe(
        self,
        audio_array: np.ndarray,
        sample_rate: int = 16000,
        language: str = "mr",
        audio_identifier: str = "audio_sample"
    ) -> TranscriptionResult:
        if not self.is_loaded():
            self.load_model()

        start_time = time.time()

        # Target language mapping
        lang_code = "mr" if language in ["mr", "marathi", "mr-varhadi", "varhadi"] else ("hi" if language == "hi" else "en")
        initial_prompt = MARATHI_PROMPT_BIAS if lang_code == "mr" else None

        try:
            segments_gen, info = self.model.transcribe(
                audio_array,
                language=lang_code,
                initial_prompt=initial_prompt,
                beam_size=5,
                temperature=0.0,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=400)
            )

            segments_list: List[TranscriptionSegment] = []
            text_parts = []
            confidence_scores = []

            for i, seg in enumerate(segments_gen):
                # Calibrated confidence from avg_logprob
                # avg_logprob is log(p); exp(avg_logprob) is approximate sequence probability in [0, 1]
                conf = float(np.clip(np.exp(seg.avg_logprob), 0.0, 1.0))
                confidence_scores.append(conf)
                
                text_clean = seg.text.strip()
                text_parts.append(text_clean)
                
                segments_list.append(TranscriptionSegment(
                    id=i,
                    start=round(float(seg.start), 2),
                    end=round(float(seg.end), 2),
                    text=text_clean,
                    confidence=round(conf, 3),
                    avg_logprob=round(float(seg.avg_logprob), 3)
                ))

            recognized_text = " ".join(text_parts).strip()
            duration = time.time() - start_time

            overall_confidence = float(np.mean(confidence_scores)) if confidence_scores else 0.0
            is_uncertain = overall_confidence < 0.50 or len(recognized_text) == 0

            warning_message = None
            if is_uncertain:
                if len(recognized_text) == 0:
                    warning_message = "No audible speech was recognized. Please check your microphone or speak louder."
                else:
                    warning_message = "Recognition quality is uncertain (low acoustic confidence). Please review and correct the transcript below."

            return TranscriptionResult(
                audio_identifier=audio_identifier,
                selected_language=language,
                detected_language=info.language or lang_code,
                recognized_text=recognized_text,
                segments=segments_list,
                model_name=f"faster-whisper-{self.model_size}",
                model_version="1.2.1",
                processing_duration_sec=round(duration, 3),
                overall_confidence=round(overall_confidence, 3) if confidence_scores else None,
                is_uncertain=is_uncertain,
                warning_message=warning_message,
                metadata={
                    "language_probability": round(float(info.language_probability), 3) if hasattr(info, 'language_probability') else None,
                    "compression_ratio": round(float(info.compression_ratio), 3) if hasattr(info, 'compression_ratio') else None,
                    "compute_type": self.compute_type
                }
            )
        except Exception as e:
            logger.error(f"Whisper transcription error: {e}")
            raise

