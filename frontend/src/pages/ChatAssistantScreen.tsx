import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Globe, FileText, Star, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/api';
import { ChatMessage } from '../types';
import { getTranslation } from '../i18n/translations';

interface ChatAssistantScreenProps {
  initialQuery?: string;
  selectedLanguage: string;
}

export const ChatAssistantScreen: React.FC<ChatAssistantScreenProps> = ({
  initialQuery,
  selectedLanguage
}) => {
  const t = getTranslation(selectedLanguage);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [englishTranslations, setEnglishTranslations] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  // Feedback modal / rating state
  const [activeFeedbackMsgId, setActiveFeedbackMsgId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCorrection, setFeedbackCorrection] = useState('');
  const [feedbackSubmittedIds, setFeedbackSubmittedIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If initialQuery is passed from another screen (e.g. Home or Voice), submit it automatically
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      original_text: query,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await apiClient.sendChatMessage(query, selectedLanguage, conversationId, true);
      if (res.conversation_id) setConversationId(res.conversation_id);

      const assistantMessage: ChatMessage = {
        id: res.message_id || `bot-${Date.now()}`,
        sender: 'assistant',
        original_text: res.answer,
        normalized_text: res.normalized_query,
        detected_dialect: res.detected_dialect,
        dialect_replacements: res.dialect_replacements,
        answer: res.answer,
        sources: res.sources,
        audio_url: res.audio_url,
        latency_ms: res.latency_ms,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        original_text: 'Error generating grounded answer. Please verify backend services are active.',
        answer: 'Error generating grounded answer. Please verify backend services are active.',
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslateToEnglish = async (msgId: string, text: string) => {
    if (englishTranslations[msgId]) return;
    setTranslatingId(msgId);
    try {
      const res = await apiClient.translateText(text, 'mr', 'en');
      setEnglishTranslations((prev) => ({
        ...prev,
        [msgId]: res.translated_text
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingId(null);
    }
  };

  const handleSubmitFeedback = async (msgId: string) => {
    try {
      await apiClient.submitFeedback(msgId, feedbackRating, feedbackCorrection);
      setFeedbackSubmittedIds((prev) => ({ ...prev, [msgId]: true }));
      setActiveFeedbackMsgId(null);
      setFeedbackCorrection('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Top Banner / Grounding Guarantee */}
      <div className="bg-indigo-50/90 border border-indigo-200/90 px-4 py-2.5 rounded-2xl text-xs text-indigo-950 flex items-center justify-between mb-4 shadow-xs">
        <span className="font-medium">
          📌 <strong>{t.chat.sourcesTitle}:</strong> {t.chat.subtitle}
        </span>
        <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shrink-0">
          Ollama Qwen2.5 1.5B Local
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              {t.chat.title}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {t.chat.emptyChatPrompt}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs space-y-3.5'
                }`}
              >
                {/* User Message */}
                {msg.sender === 'user' ? (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.original_text}
                  </p>
                ) : (
                  /* Assistant Response */
                  <div className="space-y-3.5">
                    {/* Dialect Recognition Tag */}
                    {msg.detected_dialect && (
                      <div className="flex items-center space-x-2 text-[11px] pb-2 border-b border-slate-100">
                        <span className="font-bold text-indigo-600">
                          {t.chat.dialectBadge}: {msg.detected_dialect}
                        </span>
                        {msg.normalized_text && msg.normalized_text !== msg.original_text && (
                          <span className="text-slate-400">• {t.chat.normalizedBadge}</span>
                        )}
                      </div>
                    )}

                    {/* Main Structured Answer */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                      {msg.answer}
                    </div>

                    {/* English Translation View if generated */}
                    {englishTranslations[msg.id] && (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">English Translation:</span>
                        <p className="whitespace-pre-wrap leading-relaxed">{englishTranslations[msg.id]}</p>
                      </div>
                    )}

                    {/* Audio Player for Spoken Answer */}
                    {msg.audio_url && (
                      <div className="bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-900">{t.chat.audioListen}</span>
                        </div>
                        <audio src={msg.audio_url} controls className="h-8 max-w-[220px]" />
                      </div>
                    )}

                    {/* Verified Official Sources References */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          {t.chat.sourcesTitle}:
                        </span>
                        <div className="space-y-1.5">
                          {msg.sources.map((src, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1"
                            >
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span>📄 {src.document_title}</span>
                                <span className="text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {t.chat.page} {src.page}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 italic line-clamp-2">
                                "{src.excerpt}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Controls: Translate / Feedback / Latency */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        {/* Translate to English Button */}
                        <button
                          onClick={() => handleTranslateToEnglish(msg.id, msg.answer || '')}
                          disabled={translatingId === msg.id}
                          className="hover:text-indigo-600 font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{translatingId === msg.id ? t.chat.translating : t.chat.viewEnglish}</span>
                        </button>

                        {/* Rate / Feedback Button */}
                        <button
                          onClick={() => setActiveFeedbackMsgId(activeFeedbackMsgId === msg.id ? null : msg.id)}
                          className="hover:text-indigo-600 font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          <span>{feedbackSubmittedIds[msg.id] ? t.chat.feedbackSuccess.slice(0, 15) : t.chat.ratePrompt}</span>
                        </button>
                      </div>

                      {msg.latency_ms && (
                        <span className="font-mono text-[11px] font-medium text-slate-400">{Math.round(msg.latency_ms)}ms</span>
                      )}
                    </div>

                    {/* Inline Feedback Box if opened */}
                    {activeFeedbackMsgId === msg.id && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 mt-2 shadow-inner">
                        <span className="text-xs font-bold text-slate-700 block">
                          {t.chat.ratePrompt}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFeedbackRating(star)}
                              className={`p-1 rounded text-lg ${feedbackRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={feedbackCorrection}
                          onChange={(e) => setFeedbackCorrection(e.target.value)}
                          placeholder={t.chat.rateCorrectionPlaceholder}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                        <button
                          onClick={() => handleSubmitFeedback(msg.id)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                        >
                          {t.chat.submitFeedback}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200/90 rounded-3xl rounded-bl-xs p-4 shadow-sm flex items-center space-x-3 text-slate-500">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-700">
                {t.chat.thinking}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-lg flex items-center space-x-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={t.chat.inputPlaceholder}
          rows={1}
          className="flex-1 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-sans"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 transition-all flex-shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
