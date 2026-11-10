import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Globe, FileText, Star, ThumbsUp, Check, AlertCircle, ArrowDown } from 'lucide-react';
import { apiClient } from '../services/api';
import { ChatMessage } from '../types';

interface ChatAssistantScreenProps {
  initialQuery?: string;
  selectedLanguage: string;
}

export const ChatAssistantScreen: React.FC<ChatAssistantScreenProps> = ({
  initialQuery,
  selectedLanguage
}) => {
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
        original_text: 'क्षमस्व, उत्तर मिळवण्यात त्रुटी निर्माण झाली. कृपया स्थानिक सेवा चालू असल्याची खात्री करा.',
        answer: 'क्षमस्व, उत्तर मिळवण्यात त्रुटी निर्माण झाली. कृपया स्थानिक सेवा चालू असल्याची खात्री करा.',
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
      {/* Top Banner / Disclaimer */}
      <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-xs text-indigo-900 flex items-center justify-between mb-4">
        <span>
          📌 <strong>सत्यता पडताळणी:</strong> उत्तरे केवळ अधिकृत शासकीय शासन निर्णयांवर (GR) आधारित आहेत.
        </span>
        <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
          Ollama Qwen2.5 1.5B Local
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              शेतकरी योजना संवाद (Government Scheme Inquiries)
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              कर्जमाफी, पीक विमा, नमो शेतकरी योजना, किंवा इतर अनुदानाबाबत मराठीत किंवा वऱ्हाडीत प्रश्न विचारा.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none space-y-3'
                }`}
              >
                {/* User Message */}
                {msg.sender === 'user' ? (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.original_text}
                  </p>
                ) : (
                  /* Assistant Response */
                  <div className="space-y-3">
                    {/* Dialect Recognition Tag */}
                    {msg.detected_dialect && (
                      <div className="flex items-center space-x-2 text-[11px] pb-1 border-b border-slate-100">
                        <span className="font-semibold text-indigo-600">बोलीभाषा: {msg.detected_dialect}</span>
                        {msg.normalized_text && msg.normalized_text !== msg.original_text && (
                          <span className="text-slate-400">• प्रमाण मराठी रूपांतरित</span>
                        )}
                      </div>
                    )}

                    {/* Main Structured Answer */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                      {msg.answer}
                    </div>

                    {/* English Translation View if generated */}
                    {englishTranslations[msg.id] && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-semibold text-slate-900 block">English Translation:</span>
                        <p className="whitespace-pre-wrap">{englishTranslations[msg.id]}</p>
                      </div>
                    )}

                    {/* Audio Player for Spoken Answer */}
                    {msg.audio_url && (
                      <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-semibold text-indigo-900">मराठी आवाज ऐका (Audio Voice)</span>
                        </div>
                        <audio src={msg.audio_url} controls className="h-7 max-w-[220px]" />
                      </div>
                    )}

                    {/* Verified Official Sources References */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="border-t border-slate-100 pt-2 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          अधिकृत संदर्भ दस्तऐवज (Official Sources):
                        </span>
                        <div className="space-y-1">
                          {msg.sources.map((src, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-0.5"
                            >
                              <div className="flex items-center justify-between font-semibold text-slate-800">
                                <span>📄 {src.document_title}</span>
                                <span className="text-indigo-600">पृष्ठ {src.page}</span>
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
                          className="hover:text-indigo-600 font-medium flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 transition-all"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{translatingId === msg.id ? 'भाषांतर होत आहे...' : 'English मध्ये पहा'}</span>
                        </button>

                        {/* Rate / Feedback Button */}
                        <button
                          onClick={() => setActiveFeedbackMsgId(activeFeedbackMsgId === msg.id ? null : msg.id)}
                          className="hover:text-indigo-600 font-medium flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 transition-all"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{feedbackSubmittedIds[msg.id] ? 'प्रतिसाद नोंदवला' : 'अभिप्राय द्या'}</span>
                        </button>
                      </div>

                      {msg.latency_ms && (
                        <span>{Math.round(msg.latency_ms)}ms</span>
                      )}
                    </div>

                    {/* Inline Feedback Box if opened */}
                    {activeFeedbackMsgId === msg.id && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 mt-2">
                        <span className="text-xs font-semibold text-slate-700 block">
                          या उत्तराचे मूल्यमापन करा (Feedback & Correction):
                        </span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFeedbackRating(star)}
                              className={`p-1 rounded ${feedbackRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={feedbackCorrection}
                          onChange={(e) => setFeedbackCorrection(e.target.value)}
                          placeholder="काही दुरुस्ती असल्यास येथे लिहा (उदा. अचूक माहिती)..."
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                        <button
                          onClick={() => handleSubmitFeedback(msg.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                        >
                          प्रतिसाद पाठवा
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
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-3 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs font-medium text-slate-600">
                शासकीय दस्तऐवजांमध्ये माहिती शोधत आहे... (Retrieving Grounded Scheme Evidence)
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-lg flex items-center space-x-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="मराठी किंवा वऱ्हाडीत प्रश्न विचारा (Type scheme question in Marathi or Varhadi)..."
          rows={1}
          className="flex-1 p-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-sans"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shadow transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

