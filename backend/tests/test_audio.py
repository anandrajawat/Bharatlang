import os
import pytest
import numpy as np
from backend.app.utils.audio import preprocess_audio_to_numpy, save_wav_audio

def test_audio_preprocessing_on_silence(tmp_path):
    # Create a 2-second silent audio array
    sample_rate = 16000
    silent_audio = np.zeros(sample_rate * 2, dtype=np.float32)
    test_wav = str(tmp_path / "silent.wav")
    save_wav_audio(silent_audio, test_wav, sample_rate)

    arr, meta = preprocess_audio_to_numpy(test_wav, target_sample_rate=16000)
    assert meta["duration_sec"] >= 1.9
    assert meta["is_silent"] is True
    assert meta["rms_energy"] < 0.01

def test_audio_preprocessing_on_signal(tmp_path):
    # Create a 1-second 440Hz sine wave
    sample_rate = 16000
    t = np.linspace(0, 1, sample_rate, False)
    tone = (np.sin(2 * np.pi * 440 * t) * 0.5).astype(np.float32)
    test_wav = str(tmp_path / "tone.wav")
    save_wav_audio(tone, test_wav, sample_rate)

    arr, meta = preprocess_audio_to_numpy(test_wav, target_sample_rate=16000)
    assert meta["duration_sec"] >= 0.95
    assert meta["is_silent"] is False
    assert meta["rms_energy"] > 0.1
    assert len(arr) == len(tone)
