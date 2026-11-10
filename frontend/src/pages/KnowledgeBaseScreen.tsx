import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, RefreshCw, CheckCircle, AlertTriangle, Layers, BookOpen, ExternalLink } from 'lucide-react';
import { apiClient } from '../services/api';
import { KnowledgeBaseStats, DocumentItem } from '../types';

export const KnowledgeBaseScreen: React.FC = () => {
  const [kbData, setKbData] = useState<KnowledgeBaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Upload Form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('महाराष्ट्र शासन कृषी विभाग');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getDocuments();
      setKbData(data);
    } catch (err: any) {
      setErrorMsg('कागदपत्रे मिळवण्यात त्रुटी निर्माण झाली.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('केवळ PDF फाईल (.pdf) समर्थित आहेत.');
        return;
      }
      setUploadFile(file);
      if (!customTitle) {
        setCustomTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiClient.uploadDocument(uploadFile, customTitle, issuingAuthority);
      setSuccessMsg(`'${customTitle || uploadFile.name}' यशस्वीरित्या इंडेक्स करण्यात आले.`);
      setUploadFile(null);
      setCustomTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchDocuments();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'कागदपत्र अपलोड अयशस्वी झाले.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!window.confirm(`खरोखर '${title}' हे कागदपत्र हटवायचे आहे का?`)) return;

    try {
      await apiClient.deleteDocument(docId);
      setSuccessMsg(`'${title}' हटवण्यात आले.`);
      await fetchDocuments();
    } catch (err: any) {
      setErrorMsg('कागदपत्र हटवण्यात त्रुटी आली.');
    }
  };

  const handleReindex = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await apiClient.reindexDocuments();
      setSuccessMsg('संपूर्ण ज्ञान भांडार पुन्हा अनुक्रमित (Reindexed) करण्यात आले.');
      await fetchDocuments();
    } catch (err: any) {
      setErrorMsg('पुन्हा अनुक्रमित करणे अयशस्वी झाले.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            शासकीय ज्ञान भांडार (Knowledge Base)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            महाराष्ट्र शासनाचे अधिकृत शासन निर्णय (GR) आणि योजना कागदपत्रे व्यवस्थापित करा.
          </p>
        </div>
        <button
          onClick={handleReindex}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>निर्देशांक पुनर्बांधणी (Rebuild Index)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">एकूण दस्तऐवज</span>
            <p className="text-2xl font-bold text-slate-900">{kbData?.total_documents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">इंडेक्स केलेले उतारे (Chunks)</span>
            <p className="text-2xl font-bold text-slate-900">{kbData?.index_stats.total_chunks || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">वेक्टर सर्च स्थिती</span>
            <p className="text-sm font-bold text-emerald-600 mt-1">FAISS Inner Product (Active)</p>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload New Document Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Upload className="w-4 h-4 text-indigo-600" />
          <span>नवीन शासकीय PDF कागदपत्र जोडा (Upload Scheme Document)</span>
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                योजनेचे नाव / शीर्षक (Title):
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="उदा. नमो शेतकरी महासन्मान निधी योजना..."
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                निर्गमित करणारा विभाग (Issuing Authority):
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="उदा. कृषी विभाग, महाराष्ट्र शासन..."
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* File input area */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-all cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf"
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-indigo-600" />
              <p className="text-sm font-medium text-slate-700">
                {uploadFile ? uploadFile.name : 'PDF फाईल निवडा किंवा येथे ड्रॅग करा (Click to choose PDF)'}
              </p>
              <p className="text-xs text-slate-400">
                PyMuPDF आणि Tesseract OCR स्कॅन केलेल्या कागदपत्रांना आपोआप ओळखते.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!uploadFile || isUploading}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow transition-all flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>कागदपत्र तपासणी व इंडेक्सिंग चालू आहे...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>कागदपत्र अपलोड आणि इंडेक्स करा</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Indexed Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            इंडेक्स केलेल्या कागदपत्रांची यादी (Uploaded Scheme Documents)
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {kbData?.documents.length || 0} कागदपत्रे
          </span>
        </div>

        {kbData && kbData.documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {kbData.documents.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.processing_status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span>विभाग: {doc.issuing_authority}</span>
                    <span>फाईल: {doc.filename} ({doc.file_size_kb} KB)</span>
                    <span>उतारे: <strong>{doc.chunk_count} chunks</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="कागदपत्र हटवा"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            कोणतीही कागदपत्रे उपलब्ध नाहीत. वरून नवीन PDF अपलोड करा.
          </div>
        )}
      </div>
    </div>
  );
};

