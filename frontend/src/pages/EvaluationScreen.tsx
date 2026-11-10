import React, { useState, useEffect } from 'react';
import { BarChart3, Play, RefreshCw, CheckCircle2, AlertTriangle, Cpu, Activity, Award } from 'lucide-react';
import { apiClient } from '../services/api';

export const EvaluationScreen: React.FC = () => {
  const [evalData, setEvalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningAsr, setIsRunningAsr] = useState(false);
  const [isRunningRag, setIsRunningRag] = useState(false);
  const [activeModel, setActiveModel] = useState('faster-whisper-small');
  const [asrResult, setAsrResult] = useState<any>(null);
  const [ragResult, setRagResult] = useState<any>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getEvaluationSummary();
      setEvalData(data);
      if (data.recent_benchmarks && data.recent_benchmarks.length > 0) {
        setAsrResult(data.recent_benchmarks[0].details);
      }
      if (data.rag_retrieval_benchmark) {
        setRagResult(data.rag_retrieval_benchmark);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRunAsr = async () => {
    setIsRunningAsr(true);
    try {
      const res = await apiClient.runAsrBenchmark(activeModel);
      setAsrResult(res.results);
      await fetchSummary();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningAsr(false);
    }
  };

  const handleRunRag = async () => {
    setIsRunningRag(true);
    try {
      const res = await apiClient.runRagBenchmark();
      setRagResult(res.results);
      await fetchSummary();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningRag(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            मूल्यांकन व अचूकता डॅशबोर्ड (Evaluation Dashboard)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            मानव-सत्यापित संदर्भ संचावर आधारित खरीखुरी ASR आणि RAG अचूकता आकडेवारी (No Fabricated Metrics).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunAsr}
            disabled={isRunningAsr}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningAsr ? 'animate-spin' : ''}`} />
            <span>{isRunningAsr ? 'ASR चाचणी चालू...' : 'ASR बेंचमार्क चालवा'}</span>
          </button>
          <button
            onClick={handleRunRag}
            disabled={isRunningRag}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <Activity className={`w-3.5 h-3.5 ${isRunningRag ? 'animate-spin' : ''}`} />
            <span>{isRunningRag ? 'RAG चाचणी चालू...' : 'RAG बेंचमार्क चालवा'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: ASR Evaluation Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>ध्वनी ओळख मूल्यमापन (Speech Recognition - WER & CER)</span>
          </h2>
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-500 font-medium">मॉडेल निवडा:</label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="faster-whisper-small">faster-whisper-small</option>
              <option value="faster-whisper-base">faster-whisper-base</option>
              <option value="indicconformer-mr">indicconformer-mr</option>
            </select>
          </div>
        </div>

        {asrResult ? (
          <div className="space-y-4">
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Word Error Rate (WER)
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {(asrResult.overall_wer * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">शब्दांमधील त्रुटीचे प्रमाण (Lower is better)</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Character Error Rate (CER)
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {(asrResult.overall_cer * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">अक्षरांमधील त्रुटीचे प्रमाण</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  अचूक जुळणी (Exact Match)
                </span>
                <p className="text-2xl font-bold text-emerald-600">
                  {(asrResult.exact_match_rate * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">१००% अचूक वाक्ये</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  सरासरी वेळ (Latency)
                </span>
                <p className="text-2xl font-bold text-indigo-600">
                  {asrResult.avg_latency_sec}s
                </p>
                <p className="text-[11px] text-slate-500 mt-1">प्रति वाक्य प्रक्रियेची वेळ</p>
              </div>
            </div>

            {/* Category Breakdown Table (Standard vs Varhadi vs Code-Switched) */}
            {asrResult.category_metrics && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    बोलीभाषा वर्गीकरण विश्लेषण (Dialect-Specific Breakdown)
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(asrResult.category_metrics).map(([cat, met]: [string, any]) => (
                    <div key={cat} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{cat}</span>
                        <p className="text-xs text-slate-500">
                          चाचणी नमुने: {met.sample_count} वाक्ये
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 text-xs">
                        <div>
                          <span className="text-slate-400 block">WER</span>
                          <strong className="text-slate-800 text-sm">{(met.wer * 100).toFixed(1)}%</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">CER</span>
                          <strong className="text-slate-800 text-sm">{(met.cer * 100).toFixed(1)}%</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">अचूकता</span>
                          <strong className="text-emerald-600 text-sm">{(met.exact_match_rate * 100).toFixed(1)}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">कोणतीही ASR चाचणी आकडेवारी उपलब्ध नाही</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              मानव-सत्यापित मराठी व वऱ्हाडी चाचणी संचावर प्रत्यक्ष मॉडेल तपासण्यासाठी वरील "ASR बेंचमार्क चालवा" बटण दाबा.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: RAG Retrieval Benchmark */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <span>शासकीय योजना शोध अचूकता (RAG Retrieval - 30 Question Benchmark)</span>
        </h2>

        {ragResult && ragResult.status === 'success' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Recall @ Top 4
                </span>
                <p className="text-2xl font-bold text-indigo-600">
                  {(ragResult.recall_at_k * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">अपेक्षित माहिती सापडण्याचे प्रमाण</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Precision @ Top 4
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {(ragResult.precision_at_k * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">शोधलेल्या उताऱ्यांची सुसंगतता</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Mean Reciprocal Rank (MRR)
                </span>
                <p className="text-2xl font-bold text-emerald-600">
                  {ragResult.mrr.toFixed(3)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">पहिल्या योग्य परिच्छेदाची क्रमवारी</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  अप्रासंगिक प्रश्न रोखणे
                </span>
                <p className="text-2xl font-bold text-purple-600">
                  {(ragResult.unsupported_claim_suppression * 100).toFixed(0)}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">काल्पनीक माहिती रोखण्याचे प्रमाण</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <Activity className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">RAG बेंचमार्क चालवा</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ३० प्रमाणित शासकीय योजना प्रश्नांवर सिस्टिमची अचूकता मोजण्यासाठी वरील "RAG बेंचमार्क चालवा" बटण दाबा.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

