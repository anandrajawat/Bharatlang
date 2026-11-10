import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Edit3, Send, AlertTriangle, RefreshCw, Volume2, Upload, FileAudio, Check, Sparkles } from 'lucide-react';
import { apiClient } from '../services/api';
import { TranscriptionResponse } from '../types';

interface VoiceAssistantScreenProps {
  onSubmitQueryToChat: (query: string, language: string) => void;
  selectedLanguage: string;
}

export const VoiceAssistantScreen: React.FC<VoiceAssistantScreenProps> = ({
  onSubmitQueryToChat,
  selectedLanguage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResponse | null>(null);
  const [editableTranscript, setEditableTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMsg(null);
    setTranscription(null);
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setRecordedAudioUrl(audioUrl);
        // Automatically process transcription
        handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setErrorMsg('मायक्रोफोन परवानगी नाकारली किंवा मायक्रोफोन उपलब्ध नाही. (Microphone access denied or unavailable.)');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await apiClient.transcribeAudio(blob, selectedLanguage);
      setTranscription(result);
      setEditableTranscript(result.recognized_text);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'ध्वनी रूपांतरण अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);
      setAudioBlob(file);
      handleTranscribe(file);
    }
  };

  const handleSubmit = () => {
    const finalQuery = editableTranscript.trim();
    if (finalQuery) {
      onSubmitQueryToChat(finalQuery, selectedLanguage);
    }
  };

  const handleReprocess = async () => {
    if (!editableTranscript.trim()) return;
    setIsLoading(true);
    try {
      const normalized = await apiClient.normalizeDialect(editableTranscript);
      if (transcription) {
        setTranscription({
          ...transcription,
          normalized_text: normalized.normalized_text,
          detected_dialect: normalized.dialect,
          dialect_replacements: normalized.replacements
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          स्थानिक बोलीभाषा आवाज सहाय्यक (Voice Assistant)
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          वऱ्हाडी किंवा प्रमाण मराठीत बोला. सिस्टीम आपला आवाज अचूक ओळखेल आणि प्रश्न विचारण्यापूर्वी तुम्हाला दुरुस्तीची मुभा देईल.
        </p>
      </div>

      {/* Main Voice Recording Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md flex flex-col items-center justify-center space-y-6">
        {/* Waveform / Visualizer State */}
        <div className="h-16 flex items-center justify-center space-x-1 w-full max-w-xs">
          {isRecording ? (
            Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-indigo-600 rounded-full wave-bar"
                style={{
                  height: `${Math.max(10, Math.sin(i + recordingDuration) * 36)}px`,
                  animationDelay: `${(i * 0.08).toFixed(2)}s`
                }}
              />
            ))
          ) : (
            <div className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-slate-300" />
              <span>मायक्रोफोन बटण दाबून बोला किंवा ऑडिओ फाईल अपलोड करा</span>
            </div>
          )}
        </div>

        {/* Large Microphone Action Button */}
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all shadow-xl relative z-10 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white scale-105 ring-4 ring-red-200'
                : 'bg-gradient-to-tr from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white hover:scale-105'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <>
                <Square className="w-8 h-8 fill-current mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">थांबवा</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">बोला</span>
              </>
            )}
          </button>
        </div>

        {/* Duration / Status Counter */}
        <div className="flex items-center space-x-3 text-sm">
          {isRecording ? (
            <span className="font-mono text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
              रेकॉर्डिंग चालू: {formatDuration(recordingDuration)}
            </span>
          ) : (
            recordedAudioUrl && (
              <span className="font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                कालावधी: {formatDuration(transcription?.duration_sec ? Math.round(transcription.duration_sec) : recordingDuration)}
              </span>
            )
          )}
        </div>

        {/* Secondary: Upload File option */}
        <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*,.wav,.mp3,.webm,.m4a"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>ऑडिओ फाईल अपलोड करा (WAV, MP3, WEBM)</span>
          </button>
        </div>

        {/* Audio Player if recording exists */}
        {recordedAudioUrl && (
          <div className="w-full max-w-md bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileAudio className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-medium text-slate-700">तुमचा आवाज रेकॉर्ड झाला आहे</span>
            </div>
            <audio ref={audioPlayerRef} src={recordedAudioUrl} controls className="h-8 max-w-[200px]" />
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl flex items-center justify-center space-x-3 text-indigo-700">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">
            ध्वनी ओळख आणि वऱ्हाडी बोलीभाषा विश्लेषण प्रक्रिया चालू आहे... (Transcribing & Normalizing)
          </span>
        </div>
      )}

      {/* Interactive Transcript Editor Card */}
      {transcription && !isLoading && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                ओळखलेला संवाद व संपादन (Transcript Preview & Editor)
              </h2>
            </div>
            {/* Dialect Badge */}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {transcription.detected_dialect}
            </span>
          </div>

          {/* Uncertainty Warning if low confidence */}
          {transcription.is_uncertain && transcription.warning_message && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ओळख गुणवत्तेबद्दल अनिश्चितता (Uncertain Acoustic Recognition)</p>
                <p>{transcription.warning_message}</p>
              </div>
            </div>
          )}

          {/* Raw Recognized Transcript vs Editable */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              संवाद तपासा किंवा सुधारणा करा (Edit Transcript):
            </label>
            <textarea
              value={editableTranscript}
              onChange={(e) => setEditableTranscript(e.target.value)}
              rows={3}
              className="w-full text-base p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans"
              placeholder="ओळखलेला मजकूर..."
            />
          </div>

          {/* Non-destructive Normalization Info */}
          {transcription.dialect_replacements && transcription.dialect_replacements.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-700">वऱ्हाडी बोलीभाषा विश्लेषण (Dialect Normalization):</span>
              <p className="text-slate-600">
                प्रमाण मराठी रूपांतरण: <span className="font-medium text-slate-900">{transcription.normalized_text}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {transcription.dialect_replacements.map((r, i) => (
                  <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    <span className="line-through text-slate-400">{r.original}</span> → <span className="font-semibold text-indigo-600">{r.normalized}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <span>मॉडेल: <strong className="text-slate-700">{transcription.model_name}</strong></span>
              <span>वेळ: <strong className="text-slate-700">{transcription.processing_latency_sec}s</strong></span>
              {transcription.overall_confidence !== null && (
                <span>विश्वासार्हता: <strong className="text-slate-700">{Math.round(transcription.overall_confidence * 100)}%</strong></span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button
                onClick={handleReprocess}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>पुन्हा तपासा</span>
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>प्रश्न विचारा (Submit to Assistant)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
