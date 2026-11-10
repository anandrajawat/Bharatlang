import React from 'react';
import { Mic, MessageSquare, BookOpen, BarChart3, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Database } from 'lucide-react';
import { SystemHealth } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  systemHealth: SystemHealth | null;
  onSelectSampleQuery: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  systemHealth,
  onSelectSampleQuery
}) => {
  const sampleQueries = [
    {
      label: "वऱ्हाडी बोली (Varhadi Vidarbha):",
      query: "मले शेतीसाठी कर्जमाफी आणि शासकीय अनुदान कसं भेटन ते सांगा.",
      meaning: "How can I get farmer loan waiver and government subsidies?"
    },
    {
      label: "प्रमाण मराठी (Standard Marathi):",
      query: "नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष आणि आवश्यक कागदपत्रे कोणती आहेत?",
      meaning: "What are the eligibility criteria and documents for Namo Shetkari Yojana?"
    },
    {
      label: "पीक विमा चौकशी (Crop Insurance):",
      query: "अतिवृष्टीमुळे कापूस आणि सोयाबीन पिकाचे नुकसान झाल्यास नुकसान भरपाई कशी मागता येईल?",
      meaning: "How to claim crop insurance compensation for heavy rain damage to cotton and soybean?"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ओपन-सोर्स स्थानिक बुद्धिमत्ता • 100% Locally Hosted</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            BharatLangTech AI
          </h1>
          <p className="text-lg text-slate-300 font-medium mb-2">
            स्थानिक भाषा आणि बोलीभाषा जाणणारा बहुभाषिक कृषी व शासकीय योजना सहाय्यक
          </p>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Dialect-aware voice intelligence platform tailored for Marathi and Varhadi (Vidarbha) speaking citizens.
            Grounded strictly in verified Maharashtra government resolutions and agricultural policies.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('voice')}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>आवाज सहाय्यक सुरू करा (Voice Assistant)</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-slate-700 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>संभाषण सुरू करा (Text Chat)</span>
            </button>
            <button
              onClick={() => onNavigate('kb')}
              className="flex items-center space-x-2 bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>सरकारी कागदपत्रे (PDF Knowledge)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model & System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ASR Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">ध्वनी रूपांतरण (ASR)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-slate-900">faster-whisper</p>
          <p className="text-xs text-slate-500 mt-1">
            Int8 CTranslate2 (Apple Silicon CPU) • IndicConformer Fallback ready
          </p>
        </div>

        {/* Translation & Dialect */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">बोलीभाषा व भाषांतर</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-slate-900">Varhadi Normalizer</p>
          <p className="text-xs text-slate-500 mt-1">
            Non-destructive Dialect Layer • NLLB-200 / IndicTrans2 Support
          </p>
        </div>

        {/* Local LLM */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">स्थानिक भाषा मॉडेल (LLM)</span>
            {systemHealth?.services.ollama_local_llm.is_running ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-base font-bold text-slate-900">Ollama Qwen2.5 1.5B</p>
          <p className="text-xs text-slate-500 mt-1">
            Local Apple Metal Inference • Zero Cloud API Costs
          </p>
        </div>

        {/* RAG Knowledge Base */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">ज्ञान भांडार (RAG)</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-base font-bold text-slate-900">Multilingual E5 + FAISS</p>
          <p className="text-xs text-slate-500 mt-1">
            {systemHealth?.services.rag_knowledge_base.total_chunks || 3} Chunks Indexed • PyMuPDF & Tesseract OCR
          </p>
        </div>
      </div>

      {/* Primary Farmer Demonstration Scenarios */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            विदर्भातील शेतकरी प्रात्यक्षिक उदाहरणे (Farmer Demonstration Queries)
          </h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          खालीलपैकी कोणत्याही प्रश्नावर क्लिक करून वऱ्हाडी किंवा मराठी बोलीभाषेत थेट अचूक पुरावा-आधारित उत्तर तपासा:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleQueries.map((sq, idx) => (
            <div
              key={idx}
              onClick={() => onSelectSampleQuery(sq.query)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-indigo-600 block mb-1">
                  {sq.label}
                </span>
                <p className="text-sm font-medium text-slate-900 leading-snug mb-2">
                  "{sq.query}"
                </p>
                <p className="text-xs text-slate-500 italic">
                  {sq.meaning}
                </p>
              </div>
              <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>हा प्रश्न विचारा</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

