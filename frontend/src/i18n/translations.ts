export interface TranslationDictionary {
  nav: {
    home: string;
    voice: string;
    chat: string;
    kb: string;
    eval: string;
    dialectBadge: string;
    tagline: string;
    appleM2: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    btnVoice: string;
    btnChat: string;
    btnKb: string;
    statusAsrTitle: string;
    statusAsrDesc: string;
    statusDialectTitle: string;
    statusDialectDesc: string;
    statusLlmTitle: string;
    statusLlmDesc: string;
    statusRagTitle: string;
    statusRagDesc: string;
    demoTitle: string;
    demoSubtitle: string;
    askButton: string;
    sampleQueries: Array<{
      tag: string;
      query: string;
      meaning: string;
    }>;
  };
  voice: {
    title: string;
    subtitle: string;
    recordStart: string;
    recordStop: string;
    recordingTime: string;
    uploadAudio: string;
    processing: string;
    previewTitle: string;
    detectedDialect: string;
    originalTranscript: string;
    normalizedQuery: string;
    editTranscript: string;
    saveEdit: string;
    cancelEdit: string;
    submitToChat: string;
    confidence: string;
    duration: string;
    noAudioRecorded: string;
    micPermissionError: string;
    dialectNote: string;
  };
  chat: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    sendButton: string;
    thinking: string;
    sourcesTitle: string;
    page: string;
    similarity: string;
    viewEnglish: string;
    hideEnglish: string;
    translating: string;
    audioListen: string;
    audioPlaying: string;
    dialectBadge: string;
    normalizedBadge: string;
    ratePrompt: string;
    rateCorrectionPlaceholder: string;
    submitFeedback: string;
    feedbackSuccess: string;
    emptyChatPrompt: string;
  };
  kb: {
    title: string;
    subtitle: string;
    uploadHeader: string;
    fileLabel: string;
    titleLabel: string;
    authorityLabel: string;
    uploadBtn: string;
    uploading: string;
    statsTotalDocs: string;
    statsTotalChunks: string;
    indexedListHeader: string;
    docDelete: string;
    rebuildBtn: string;
    rebuilding: string;
    emptyList: string;
  };
  eval: {
    title: string;
    subtitle: string;
    btnRunAsr: string;
    btnRunRag: string;
    runningAsr: string;
    runningRag: string;
    asrSectionTitle: string;
    modelSelectLabel: string;
    werLabel: string;
    werDesc: string;
    cerLabel: string;
    cerDesc: string;
    exactMatchLabel: string;
    exactMatchDesc: string;
    latencyLabel: string;
    latencyDesc: string;
    categoryBreakdownTitle: string;
    samplesCount: string;
    ragSectionTitle: string;
    recallLabel: string;
    recallDesc: string;
    precisionLabel: string;
    precisionDesc: string;
    mrrLabel: string;
    mrrDesc: string;
    suppressionLabel: string;
    suppressionDesc: string;
    noDataTitle: string;
    noDataDesc: string;
  };
  footer: {
    text: string;
  };
}

export const translations: Record<string, TranslationDictionary> = {
  // 1. Marathi (प्रमाण मराठी)
  mr: {
    nav: {
      home: 'मुख्य पान',
      voice: 'आवाज सहाय्यक',
      chat: 'संभाषण',
      kb: 'ज्ञान भांडार',
      eval: 'मूल्यांकन',
      dialectBadge: 'बोलीभाषा जाणकार',
      tagline: 'स्थानिक भाषा व बोलीभाषा बहुभाषिक सहाय्यक',
      appleM2: 'Apple M2 (MPS)'
    },
    home: {
      badge: 'ओपन-सोर्स स्थानिक बुद्धिमत्ता • १००% स्थानिकरित्या चालणारे',
      title: 'BharatLangTech AI',
      subtitle: 'स्थानिक भाषा आणि बोलीभाषा जाणणारा बहुभाषिक कृषी व शासकीय योजना सहाय्यक',
      description: 'विदर्भातील वऱ्हाडी आणि प्रमाण मराठी बोलणाऱ्या नागरिकांसाठी तयार केलेले विशेष व्हॉईस प्लॅटफॉर्म. अधिकृत महाराष्ट्र शासन निर्णय आणि शेतकरी योजनांवर आधारित थेट अचूक उत्तरे.',
      btnVoice: 'बोलून प्रश्न विचारा (Voice Assistant)',
      btnChat: 'टाइप करून विचारा (Text Chat)',
      btnKb: 'सरकारी जीआर कागदपत्रे (PDF Knowledge)',
      statusAsrTitle: 'ध्वनी रूपांतरण (ASR)',
      statusAsrDesc: 'Int8 CTranslate2 (Apple Silicon CPU) • अचूक मराठी व वऱ्हाडी ध्वनी ओळख',
      statusDialectTitle: 'बोलीभाषा व भाषांतर',
      statusDialectDesc: 'मूळ उच्चार जतन करून प्रमाण मराठी सामान्यीकरण • NLLB-200 / IndicTrans2',
      statusLlmTitle: 'स्थानिक भाषा मॉडेल (LLM)',
      statusLlmDesc: 'Ollama Qwen2.5 1.5B (Apple Metal) • शून्य क्लाउड खर्च व गोपनीयता',
      statusRagTitle: 'ज्ञान भांडार (RAG)',
      statusRagDesc: 'Multilingual E5 + FAISS • PyMuPDF आणि देवनागरी Tesseract OCR',
      demoTitle: 'विदर्भातील शेतकरी प्रात्यक्षिक उदाहरणे (Farmer Demonstration Queries)',
      demoSubtitle: 'खालीलपैकी कोणत्याही प्रश्नावर क्लिक करून वऱ्हाडी किंवा मराठी भाषेत थेट अचूक पुरावा-आधारित उत्तर तपासा:',
      askButton: 'हा प्रश्न विचारा',
      sampleQueries: [
        {
          tag: 'वऱ्हाडी बोली (Varhadi Vidarbha)',
          query: 'मले शेतीसाठी कर्जमाफी आणि शासकीय अनुदान कसं भेटन ते सांगा.',
          meaning: 'शेतकरी कर्जमाफी आणि शासकीय अनुदानाचा लाभ कसा मिळवता येईल?'
        },
        {
          tag: 'प्रमाण मराठी (Standard Marathi)',
          query: 'नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष आणि आवश्यक कागदपत्रे कोणती आहेत?',
          meaning: 'नमो शेतकरी सन्मान निधी योजनेची सविस्तर पात्रता व कागदपत्रे.'
        },
        {
          tag: 'पीक विमा चौकशी (Crop Insurance)',
          query: 'अतिवृष्टीमुळे कापूस आणि सोयाबीन पिकाचे नुकसान झाल्यास नुकसान भरपाई कशी मागता येईल?',
          meaning: '१ रुपयात पीक विमा योजनेअंतर्गत ७२ तासांत नुकसानीची पूर्वसूचना कशी द्यावी?'
        }
      ]
    },
    voice: {
      title: 'आवाज सहाय्यक (Voice Scheme Assistant)',
      subtitle: 'मायक्रोफोन वापरून वऱ्हाडी किंवा मराठीत बोला, किंवा रेकॉर्ड केलेली ऑडिओ फाईल अपलोड करा.',
      recordStart: 'माईक सुरू करा (Record)',
      recordStop: 'थांबवा (Stop)',
      recordingTime: 'रेकॉर्डिंग वेळ',
      uploadAudio: 'ऑडिओ फाईल अपलोड करा (WAV, MP3, WebM)',
      processing: 'ध्वनी प्रक्रिया व ओळख चालू आहे...',
      previewTitle: 'ओळखलेला मजकूर व बोलीभाषा विश्लेषण',
      detectedDialect: 'ओळखलेली बोलीभाषा',
      originalTranscript: 'मूळ बोललेला मजकूर (Original Spoken)',
      normalizedQuery: 'प्रमाणित मराठी प्रश्न (Normalized for RAG)',
      editTranscript: 'मजकूर सुधारा (Edit)',
      saveEdit: 'सुधारणा जतन करा व पुन्हा तपासा',
      cancelEdit: 'रद्द करा',
      submitToChat: 'या प्रश्नाचे उत्तर मिळवा',
      confidence: 'अचूकता विश्वासार्हता (Confidence)',
      duration: 'प्रक्रिया वेळ',
      noAudioRecorded: 'कृपया आधी बोला किंवा ऑडिओ फाईल अपलोड करा.',
      micPermissionError: 'मायक्रोफोन परवानगी नाकारली किंवा मायक्रोफोन उपलब्ध नाही.',
      dialectNote: 'तुमचा मूळ बोललेला मजकूर जतन केला जातो व तो कधीही बदलला जात नाही.'
    },
    chat: {
      title: 'शासकीय योजना थेट संभाषण (Grounded Chat)',
      subtitle: 'शासनाच्या अधिकृत अध्यादेशानुसार पुरावा-आधारित उत्तरे, मूळ कागदपत्रांचे संदर्भ व पानांसह.',
      inputPlaceholder: 'तुमचा प्रश्न येथे मराठी किंवा वऱ्हाडीत टाइप करा (उदा. कर्जमाफीची पात्रता काय आहे?)...',
      sendButton: 'पाठवा',
      thinking: 'शासकीय कागदपत्रांचा शोध घेऊन अचूक उत्तर तयार करत आहे...',
      sourcesTitle: 'संदर्भित शासकीय कागदपत्रे व पृष्ठ क्रमांक (Verified Citations)',
      page: 'पृष्ठ क्र.',
      similarity: 'सुसंगतता गुणांक',
      viewEnglish: 'इंग्रजी भाषांतर पहा (English Translation)',
      hideEnglish: 'इंग्रजी लपवा',
      translating: 'इंग्रजीत भाषांतर होत आहे...',
      audioListen: 'मराठीत उत्तर ऐका (Audio)',
      audioPlaying: 'ऑडिओ प्ले होत आहे...',
      dialectBadge: 'बोलीभाषा',
      normalizedBadge: 'प्रमाणित रूप',
      ratePrompt: 'हे उत्तर उपयुक्त आणि अचूक होते का?',
      rateCorrectionPlaceholder: 'काही त्रुटी किंवा सुधारणा असल्यास येथे लिहा...',
      submitFeedback: 'अभिप्राय नोंदवा',
      feedbackSuccess: 'धन्यवाद! तुमचा अभिप्राय प्रशासकीय तपासणीसाठी नोंदवला गेला आहे.',
      emptyChatPrompt: 'कोणताही प्रश्न विचारा किंवा वरील प्रात्यक्षिक प्रश्नांपैकी एक निवडा.'
    },
    kb: {
      title: 'शासकीय कागदपत्रे ज्ञान भांडार (Knowledge Base)',
      subtitle: 'महाराष्ट्र शासनाचे अधिकृत जीआर व परिपत्रके अपलोड करा. PyMuPDF आणि Tesseract OCR द्वारे थेट इंडेक्सिंग.',
      uploadHeader: 'नवीन शासकीय अध्यादेश / जीआर (PDF) अपलोड करा',
      fileLabel: 'PDF फाईल निवडा',
      titleLabel: 'योजनेचे नाव / कागदपत्राचे शीर्षक',
      authorityLabel: 'निर्गमित विभाग / प्राधिकरण',
      uploadBtn: 'कागदपत्र प्रोसेस व इंडेक्स करा',
      uploading: 'दस्तऐवज स्कॅनिंग व OCR प्रक्रिया चालू आहे...',
      statsTotalDocs: 'एकूण कागदपत्रे',
      statsTotalChunks: 'इंडेक्स केलेले परिच्छेद',
      indexedListHeader: 'ज्ञान भांडारातील उपलब्ध शासकीय दस्तऐवज',
      docDelete: 'हटवा',
      rebuildBtn: 'इंडेक्स पुन्हा तयार करा',
      rebuilding: 'पुन्हा इंडेक्स करत आहे...',
      emptyList: 'कोणतेही कागदपत्र अपलोड केलेले नाही.'
    },
    eval: {
      title: 'मूल्यांकन व अचूकता डॅशबोर्ड (Evaluation Dashboard)',
      subtitle: 'मानव-सत्यापित संदर्भ संचावर आधारित प्रत्यक्ष मोजलेली अचूकता आकडेवारी (Zero Fabricated Metrics).',
      btnRunAsr: 'ASR चाचणी चालवा',
      btnRunRag: 'RAG बेंचमार्क चालवा',
      runningAsr: 'ASR चाचणी चालू...',
      runningRag: '३० प्रश्नांची चाचणी चालू...',
      asrSectionTitle: 'ध्वनी ओळख मूल्यमापन (Speech Recognition - WER & CER)',
      modelSelectLabel: 'मॉडेल निवडा:',
      werLabel: 'Word Error Rate (WER)',
      werDesc: 'शब्दांमधील त्रुटीचे प्रमाण (कमी तितके चांगले)',
      cerLabel: 'Character Error Rate (CER)',
      cerDesc: 'अक्षरांमधील त्रुटीचे प्रमाण',
      exactMatchLabel: 'अचूक जुळणी (Exact Match)',
      exactMatchDesc: '१००% अचूक वाक्ये',
      latencyLabel: 'सरासरी वेळ (Latency)',
      latencyDesc: 'प्रति वाक्य प्रक्रियेची वेळ',
      categoryBreakdownTitle: 'बोलीभाषा वर्गीकरण विश्लेषण (Dialect-Specific Breakdown)',
      samplesCount: 'चाचणी वाक्ये',
      ragSectionTitle: 'शासकीय योजना शोध अचूकता (RAG Retrieval - 30 Question Benchmark)',
      recallLabel: 'Recall @ Top 4',
      recallDesc: 'अपेक्षित माहिती सापडण्याचे प्रमाण',
      precisionLabel: 'Precision @ Top 4',
      precisionDesc: 'शोधलेल्या उताऱ्यांची सुसंगतता',
      mrrLabel: 'Mean Reciprocal Rank (MRR)',
      mrrDesc: 'पहिल्या योग्य परिच्छेदाची क्रमवारी',
      suppressionLabel: 'अप्रासंगिक प्रश्न रोखणे',
      suppressionDesc: 'काल्पनिक माहिती न देण्याचे प्रमाण',
      noDataTitle: 'कोणतीही चाचणी आकडेवारी उपलब्ध नाही',
      noDataDesc: 'प्रत्यक्ष मॉडेल तपासण्यासाठी वरील "बेंचमार्क चालवा" बटण दाबा.'
    },
    footer: {
      text: '© २०२६ BharatLangTech AI — भारतीय नागरिकांसाठी बोलीभाषा-जाणकार बहुभाषिक व्हॉईस प्लॅटफॉर्म. सर्व मॉडेल्स Apple Silicon (M2) वर ऑफलाइन चालतात. कोणतीही सशुल्क क्लाउड API नाही.'
    }
  },

  // 2. Varhadi (वऱ्हाडी बोली - विदर्भ)
  'mr-varhadi': {
    nav: {
      home: 'घर (Home)',
      voice: 'बोलून पहा (Voice)',
      chat: 'संवाद (Chat)',
      kb: 'सरकारी कागदपत्रे',
      eval: 'तपासणी (Evaluation)',
      dialectBadge: 'वऱ्हाडी बोली',
      tagline: 'विदर्भातील शेतकरी बांधवांसाठी आपली बोलीभाषा सहाय्यक',
      appleM2: 'Apple M2 (MPS)'
    },
    home: {
      badge: 'आपली स्थानिक बुद्धिमत्ता • १००% आपल्याच कॉम्प्युटरवर',
      title: 'BharatLangTech AI',
      subtitle: 'आपल्या वऱ्हाडी बोलीभाषेत शेती आणि सरकारी योजनांची खरी माहिती',
      description: 'विदर्भातील शेतकरी भावांसाठी खास वऱ्हाडी व मराठी व्हॉईस प्लॅटफॉर्म. सरकारने काढलेले जीआर तपासून थेट व अचूक उत्तर भेटन.',
      btnVoice: 'माईकमध्ये बोलून इचारा (Voice Assistant)',
      btnChat: 'टाइप करून इचारा (Text Chat)',
      btnKb: 'सरकारी कागदपत्रे पहा (PDF Knowledge)',
      statusAsrTitle: 'आवाज ऐकणे (ASR)',
      statusAsrDesc: 'Int8 CTranslate2 • वऱ्हाडी आणि मराठी उच्चार अचूक ओळखते',
      statusDialectTitle: 'बोलीभाषा समजून घेणे',
      statusDialectDesc: 'आपला शब्द जसाच्या तसा ठेवून सरकारी भाषेशी जुळवून घेते',
      statusLlmTitle: 'आपले स्थानिक मॉडेल (LLM)',
      statusLlmDesc: 'Ollama Qwen2.5 1.5B • नेट नसलं तरी चालेल, मोफत व सुरक्षित',
      statusRagTitle: 'सरकारी ज्ञान भांडार (RAG)',
      statusRagDesc: 'Multilingual E5 + FAISS • कागदपत्रातील अचूक पान शोधून देते',
      demoTitle: 'शेतकरी भावांनी विचारलेले प्रश्न (Farmer Demonstration Queries)',
      demoSubtitle: 'खालीलपैकी कोणत्याही प्रश्नावर टिचकी मारून पहा, थेट पुराव्यासह उत्तर भेटन:',
      askButton: 'हा प्रश्न इचारा',
      sampleQueries: [
        {
          tag: 'वऱ्हाडी बोली (Varhadi Vidarbha)',
          query: 'मले शेतीसाठी कर्जमाफी आणि शासकीय अनुदान कसं भेटन ते सांगा.',
          meaning: 'कर्जमाफी आणि अनुदानाचे पैसे कसे मिळवायचे?'
        },
        {
          tag: 'नमो शेतकरी योजना',
          query: 'नमो शेतकरी महासन्मान निधीचे पैसे कोणले भेटतात अन् काय कागद लागतात?',
          meaning: 'नमो शेतकरी योजनेची पात्रता व आवश्यक कागदपत्रे.'
        },
        {
          tag: 'पीक विमा चौकशी',
          query: 'अतिवृष्टीने सोयाबीन आणि कापूस नासून गेला, विमा कंपनीले तक्रार कशी द्यायची?',
          meaning: '१ रुपयात पीक विमा नुकसानीची ७२ तासांत माहिती कशी द्यावी?'
        }
      ]
    },
    voice: {
      title: 'बोलून प्रश्न इचारा (Voice Assistant)',
      subtitle: 'आपल्या वऱ्हाडी बोलीत बोला, माईक दाबा अन् इचारा.',
      recordStart: 'माईक सुरू करा (Record)',
      recordStop: 'थांबवा (Stop)',
      recordingTime: 'बोलण्याची वेळ',
      uploadAudio: 'रेकॉर्डिंग फाईल अपलोड करा (WAV, MP3, WebM)',
      processing: 'तुमचा आवाज ऐकणे चालू हाय...',
      previewTitle: 'तुम्ही काय बोलले अन् बोलीभाषा',
      detectedDialect: 'ओळखलेली बोलीभाषा',
      originalTranscript: 'तुम्ही बोललेला मूळ आवाज (Original Spoken)',
      normalizedQuery: 'शासकीय शोध रूप (Normalized Query)',
      editTranscript: 'बदला / दुरुस्त करा (Edit)',
      saveEdit: 'दुरुस्ती जतन करा',
      cancelEdit: 'रद्द करा',
      submitToChat: 'या प्रश्नाचे उत्तर काढा',
      confidence: 'विश्वासार्हता',
      duration: 'लागलेली वेळ',
      noAudioRecorded: 'आधी माईक दाबून बोला किंवा फाईल अपलोड करा.',
      micPermissionError: 'मायक्रोफोन चालू करायची परवानगी द्यावी लागेल.',
      dialectNote: 'तुम्ही बोललेला शब्द तसाच राहतो, तो बदलला जात नाही.'
    },
    chat: {
      title: 'योजनांची थेट माहिती (Grounded Chat)',
      subtitle: 'सरकारी जीआर तपासून दिलेल्या पानांच्या पुराव्यासह अचूक उत्तर.',
      inputPlaceholder: 'तुमचा प्रश्न इथं लिहा (उदा. मले २ लाख कर्जमाफी कशी भेटन?)...',
      sendButton: 'पाठवा',
      thinking: 'सरकारी कागदपत्रे तपासून उत्तर तयार करत हाय...',
      sourcesTitle: 'पुरावा: सरकारी कागदपत्रे अन् पान नंबर (Citations)',
      page: 'पान क्र.',
      similarity: 'जुळणी प्रमाण',
      viewEnglish: 'इंग्रजीत पहा (English)',
      hideEnglish: 'इंग्रजी बंद करा',
      translating: 'इंग्रजीत भाषांतर होत हाय...',
      audioListen: 'मराठीत आवाज ऐका (Audio)',
      audioPlaying: 'आवाज चालू हाय...',
      dialectBadge: 'बोलीभाषा',
      normalizedBadge: 'प्रमाण रूप',
      ratePrompt: 'हे उत्तर बरोबर हाय का?',
      rateCorrectionPlaceholder: 'काही चूक वाटल्यास इथं लिहा...',
      submitFeedback: 'अभिप्राय द्या',
      feedbackSuccess: 'धन्यवाद! तुमचा अभिप्राय नोंदवून घेतला हाय.',
      emptyChatPrompt: 'कोणताही प्रश्न इचारा किंवा वरील उदाहरणांवर टिचकी मारा.'
    },
    kb: {
      title: 'सरकारी जीआर कागदपत्रे (Knowledge Base)',
      subtitle: 'सरकारी शासन निर्णय (PDF) अपलोड करा, सिस्टिम थेट वाचून इंडेक्स करेल.',
      uploadHeader: 'नवीन जीआर (PDF) टाका',
      fileLabel: 'PDF फाईल निवडा',
      titleLabel: 'कागदपत्राचे नाव',
      authorityLabel: 'विभाग',
      uploadBtn: 'कागदपत्र जोडा व इंडेक्स करा',
      uploading: 'कागदपत्र वाचणे चालू हाय...',
      statsTotalDocs: 'एकूण कागदपत्रे',
      statsTotalChunks: 'तपासलेले परिच्छेद',
      indexedListHeader: 'सिस्टिममध्ये जमा असलेले कागदपत्रे',
      docDelete: 'काढून टाका',
      rebuildBtn: 'पुन्हा तपासा',
      rebuilding: 'पुन्हा तपासणे चालू हाय...',
      emptyList: 'अजून एकही कागदपत्र जोडलेलं नाही.'
    },
    eval: {
      title: 'अचूकता तपासणी डॅशबोर्ड (Evaluation Dashboard)',
      subtitle: 'आपल्या वऱ्हाडी आणि प्रमाण मराठीतील खरीखुरी मोजलेली अचूकता.',
      btnRunAsr: 'ASR चाचणी घ्या',
      btnRunRag: 'RAG चाचणी घ्या',
      runningAsr: 'ASR तपासणी चालू हाय...',
      runningRag: '३० प्रश्नांची तपासणी चालू...',
      asrSectionTitle: 'आवाज ओळख चाचणी (WER व CER)',
      modelSelectLabel: 'मॉडेल निवडा:',
      werLabel: 'शब्दांमधील चूक (WER)',
      werDesc: 'कमी चूक म्हणजे जास्त चांगलं',
      cerLabel: 'अक्षरांमधील चूक (CER)',
      cerDesc: 'अक्षरांचे अचूक प्रमाण',
      exactMatchLabel: '१००% तंतोतंत जुळणी',
      exactMatchDesc: 'जसेच्या तसे बरोबर वाक्ये',
      latencyLabel: 'सरासरी वेळ',
      latencyDesc: 'एका वाक्याला लागणारा वेळ',
      categoryBreakdownTitle: 'बोलीनुसार अचूकता विश्लेषण',
      samplesCount: 'चाचणी वाक्ये',
      ragSectionTitle: 'सरकारी माहिती शोध अचूकता (RAG 30 Benchmark)',
      recallLabel: 'माहिती सापडणे (Recall)',
      recallDesc: 'अपेक्षित पुरावा सापडण्याचे प्रमाण',
      precisionLabel: 'योग्य परिच्छेद (Precision)',
      precisionDesc: 'शोधलेल्या भागांची सुसंगतता',
      mrrLabel: 'पहिले योग्य पान (MRR)',
      mrrDesc: 'पहिल्या प्रयत्नात योग्य संदर्भ मिळणे',
      suppressionLabel: 'खोट्या गोष्टी रोखणे',
      suppressionDesc: 'माहिती नसताना खोटं न बोलण्याचे प्रमाण',
      noDataTitle: 'अजून चाचणी घेतलेली नाही',
      noDataDesc: 'तपासणी करण्यासाठी वरील बटण दाबा.'
    },
    footer: {
      text: '© २०२६ BharatLangTech AI — विदर्भातील शेतकरी बांधवांसाठी आपली वऱ्हाडी बोलीभाषा सहाय्यक. सर्व काही Apple Silicon (M2) वर ऑफलाइन चालते.'
    }
  },

  // 3. Hindi (हिंदी)
  hi: {
    nav: {
      home: 'गृह (Home)',
      voice: 'आवाज़ सहायक',
      chat: 'संवाद (Chat)',
      kb: 'ज्ञान भंडार',
      eval: 'मूल्यांकन',
      dialectBadge: 'बोली-जागरूक',
      tagline: 'स्थानीय भाषा व बोलीभाषा बहुभाषी सहायक',
      appleM2: 'Apple M2 (MPS)'
    },
    home: {
      badge: 'ओपन-सोर्स स्थानीय बुद्धिमत्ता • 100% लोकल होस्टेड',
      title: 'BharatLangTech AI',
      subtitle: 'स्थानीय भाषा और बोलियों को समझने वाला बहुभाषी कृषि व सरकारी योजना सहायक',
      description: 'विदर्भ की वऱ्हाडी और मानक मराठी बोलने वाले नागरिकों के लिए विशेष वॉयस इंटेलिजेंस प्लेटफ़ॉर्म। आधिकारिक सरकारी प्रस्तावों (GR) पर आधारित साक्ष्य-सत्यापित उत्तर।',
      btnVoice: 'बोलकर पूछें (Voice Assistant)',
      btnChat: 'टाइप करके पूछें (Text Chat)',
      btnKb: 'सरकारी दस्तावेज़ (PDF Knowledge)',
      statusAsrTitle: 'ध्वनि पहचान (ASR)',
      statusAsrDesc: 'Int8 CTranslate2 (Apple Silicon CPU) • मराठी व वऱ्हाडी ध्वनि पहचान',
      statusDialectTitle: 'बोलीभाषा व अनुवाद',
      statusDialectDesc: 'मूल बोली को सुरक्षित रखकर मानक मराठी में सामान्यीकरण • NLLB-200',
      statusLlmTitle: 'स्थानीय भाषा मॉडल (LLM)',
      statusLlmDesc: 'Ollama Qwen2.5 1.5B (Apple Metal) • शून्य क्लाउड लागत और पूर्ण गोपनीयता',
      statusRagTitle: 'ज्ञान भंडार (RAG)',
      statusRagDesc: 'Multilingual E5 + FAISS • PyMuPDF और देवनागरी Tesseract OCR',
      demoTitle: 'विदर्भ के किसानों के प्रात्यक्षिक प्रश्न (Farmer Demonstration Queries)',
      demoSubtitle: 'नीचे दिए गए किसी भी प्रश्न पर क्लिक करके वऱ्हाडी या मराठी में साक्ष्य-आधारित उत्तर देखें:',
      askButton: 'यह प्रश्न पूछें',
      sampleQueries: [
        {
          tag: 'वऱ्हाडी बोली (Varhadi Vidarbha)',
          query: 'मले शेतीसाठी कर्जमाफी आणि शासकीय अनुदान कसं भेटन ते सांगा.',
          meaning: 'किसानों के लिए ऋण माफ़ी और सरकारी अनुदान का लाभ कैसे प्राप्त करें?'
        },
        {
          tag: 'मानक मराठी (Standard Marathi)',
          query: 'नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष आणि आवश्यक कागदपत्रे कोणती आहेत?',
          meaning: 'नमो शेतकरी सन्मान निधि योजना के पात्रता मानदंड और आवश्यक दस्तावेज़।'
        },
        {
          tag: 'फसल बीमा पूछताछ (Crop Insurance)',
          query: 'अतिवृष्टीमुळे कापूस आणि सोयाबीन पिकाचे नुकसान झाल्यास नुकसान भरपाई कशी मागता येईल?',
          meaning: '१ रुपये फसल बीमा योजना के अंतर्गत ७२ घंटों में क्षति की पूर्वसूचना कैसे दें?'
        }
      ]
    },
    voice: {
      title: 'आवाज़ सहायक (Voice Scheme Assistant)',
      subtitle: 'माइक्रोफ़ोन का उपयोग करके वऱ्हाडी या मराठी में बोलें, या ऑडियो फ़ाइल अपलोड करें।',
      recordStart: 'माइक चालू करें (Record)',
      recordStop: 'रोकें (Stop)',
      recordingTime: 'रिकॉर्डिंग समय',
      uploadAudio: 'ऑडियो फ़ाइल अपलोड करें (WAV, MP3, WebM)',
      processing: 'ध्वनि पहचान प्रक्रिया जारी है...',
      previewTitle: 'पहचाना गया पाठ और बोली विश्लेषण',
      detectedDialect: 'पहचानी गई बोलीभाषा',
      originalTranscript: 'मूल बोला गया पाठ (Original Spoken)',
      normalizedQuery: 'मानकीकृत प्रश्न (Normalized for RAG)',
      editTranscript: 'संपादित करें (Edit)',
      saveEdit: 'सुधार सहेजें और पुनः जांचें',
      cancelEdit: 'रद्द करें',
      submitToChat: 'इस प्रश्न का उत्तर पाएं',
      confidence: 'सटीकता विश्वास (Confidence)',
      duration: 'प्रक्रिया समय',
      noAudioRecorded: 'कृपया पहले बोलें या ऑडियो फ़ाइल अपलोड करें।',
      micPermissionError: 'माइक्रोफ़ोन अनुमति अस्वीकृत या माइक्रोफ़ोन अनुपलब्ध।',
      dialectNote: 'आपका मूल बोला गया पाठ सुरक्षित रखा जाता है और उसे बदला नहीं जाता।'
    },
    chat: {
      title: 'सरकारी योजना संवाद (Grounded Chat)',
      subtitle: 'आधिकारिक सरकारी आदेशों के आधार पर साक्ष्य-सत्यापित उत्तर, मूल दस्तावेज़ और पृष्ठ संख्या सहित।',
      inputPlaceholder: 'अपना प्रश्न यहाँ टाइप करें (उदा. ऋण माफ़ी की पात्रता क्या है?)...',
      sendButton: 'भेजें',
      thinking: 'सरकारी दस्तावेज़ों की जांच कर सटीक उत्तर तैयार किया जा रहा है...',
      sourcesTitle: 'संदर्भित सरकारी दस्तावेज़ और पृष्ठ संख्या (Verified Citations)',
      page: 'पृष्ठ सं.',
      similarity: 'सटीकता स्कोर',
      viewEnglish: 'अंग्रेजी अनुवाद देखें (English Translation)',
      hideEnglish: 'अंग्रेजी छिपाएं',
      translating: 'अंग्रेजी में अनुवाद हो रहा है...',
      audioListen: 'मराठी में उत्तर सुनें (Audio)',
      audioPlaying: 'ऑडियो चल रहा है...',
      dialectBadge: 'बोलीभाषा',
      normalizedBadge: 'मानक रूप',
      ratePrompt: 'क्या यह उत्तर उपयोगी और सटीक था?',
      rateCorrectionPlaceholder: 'यदि कोई त्रुटि या सुधार हो तो यहाँ लिखें...',
      submitFeedback: 'प्रतिक्रिया दर्ज करें',
      feedbackSuccess: 'धन्यवाद! आपकी प्रतिक्रिया समीक्षा के लिए दर्ज कर ली गई है।',
      emptyChatPrompt: 'कोई भी प्रश्न पूछें या ऊपर दिए गए उदाहरणों में से चुनें।'
    },
    kb: {
      title: 'सरकारी दस्तावेज़ ज्ञान भंडार (Knowledge Base)',
      subtitle: 'महाराष्ट्र शासन के आधिकारिक आदेश (GR) अपलोड करें। PyMuPDF और Tesseract OCR द्वारा अनुक्रमण।',
      uploadHeader: 'नया सरकारी आदेश (PDF) अपलोड करें',
      fileLabel: 'PDF फ़ाइल चुनें',
      titleLabel: 'योजना का नाम / दस्तावेज़ शीर्षक',
      authorityLabel: 'जारीकर्ता विभाग / प्राधिकरण',
      uploadBtn: 'दस्तावेज़ प्रोसेस और इंडेक्स करें',
      uploading: 'दस्तावेज़ स्कैनिंग और OCR प्रक्रिया जारी है...',
      statsTotalDocs: 'कुल दस्तावेज़',
      statsTotalChunks: 'इंडेक्स किए गए पैराग्राफ',
      indexedListHeader: 'उपलब्ध सरकारी दस्तावेज़',
      docDelete: 'हटाएं',
      rebuildBtn: 'इंडेक्स पुनः बनाएं',
      rebuilding: 'पुनः इंडेक्सिंग जारी है...',
      emptyList: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।'
    },
    eval: {
      title: 'मूल्यांकन और सटीकता डैशबोर्ड (Evaluation Dashboard)',
      subtitle: 'मानव-सत्यापित संदर्भ सेट पर आधारित वास्तविक सटीकता आंकड़े (Zero Fabricated Metrics).',
      btnRunAsr: 'ASR बेंचमार्क चलाएं',
      btnRunRag: 'RAG बेंचमार्क चलाएं',
      runningAsr: 'ASR परीक्षण जारी...',
      runningRag: '30 प्रश्नों की जांच जारी...',
      asrSectionTitle: 'ध्वनि पहचान मूल्यांकन (Speech Recognition - WER & CER)',
      modelSelectLabel: 'मॉडल चुनें:',
      werLabel: 'Word Error Rate (WER)',
      werDesc: 'शब्द स्तर पर त्रुटि अनुपात (कम होना बेहतर)',
      cerLabel: 'Character Error Rate (CER)',
      cerDesc: 'अक्षर स्तर पर त्रुटि अनुपात',
      exactMatchLabel: 'सटीक मिलान (Exact Match)',
      exactMatchDesc: '100% सटीक वाक्य',
      latencyLabel: 'औसत समय (Latency)',
      latencyDesc: 'प्रति वाक्य प्रसंस्करण समय',
      categoryBreakdownTitle: 'बोली-विशिष्ट सटीकता विश्लेषण',
      samplesCount: 'परीक्षण वाक्य',
      ragSectionTitle: 'सरकारी योजना खोज सटीकता (RAG 30 Question Benchmark)',
      recallLabel: 'Recall @ Top 4',
      recallDesc: 'अपेक्षित जानकारी मिलने की दर',
      precisionLabel: 'Precision @ Top 4',
      precisionDesc: 'खोजे गए अंशों की प्रासंगिकता',
      mrrLabel: 'Mean Reciprocal Rank (MRR)',
      mrrDesc: 'प्रथम प्रासंगिक उद्धरण की स्थिति',
      suppressionLabel: 'अप्रासंगिक प्रश्नों की रोकथाम',
      suppressionDesc: 'काल्पनिक उत्तर न देने की दर',
      noDataTitle: 'कोई परीक्षण डेटा उपलब्ध नहीं है',
      noDataDesc: 'वास्तविक मॉडल परीक्षण के लिए ऊपर "बेंचमार्क चलाएं" बटन दबाएं।'
    },
    footer: {
      text: '© 2026 BharatLangTech AI — भारतीय नागरिकों के लिए बोली-जागरूक बहुभाषी वॉयस प्लेटफ़ॉर्म। सभी मॉडल Apple Silicon (M2) पर ऑफ़लाइन चलते हैं।'
    }
  },

  // 4. English
  en: {
    nav: {
      home: 'Home',
      voice: 'Voice Assistant',
      chat: 'Text Chat',
      kb: 'Knowledge Base',
      eval: 'Evaluation',
      dialectBadge: 'Dialect-Aware',
      tagline: 'Multilingual Voice Intelligence for Regional Dialects',
      appleM2: 'Apple M2 (MPS)'
    },
    home: {
      badge: 'Open-Source Local Intelligence • 100% Locally Hosted',
      title: 'BharatLangTech AI',
      subtitle: 'Multilingual Agricultural & Government Scheme Intelligence Platform',
      description: 'Dialect-aware voice intelligence platform tailored for Marathi and Varhadi (Vidarbha) speaking citizens. Grounded strictly in verified Maharashtra government resolutions and agricultural policies.',
      btnVoice: 'Start Voice Assistant',
      btnChat: 'Start Text Chat',
      btnKb: 'Government Documents (PDF)',
      statusAsrTitle: 'Speech Recognition (ASR)',
      statusAsrDesc: 'Int8 CTranslate2 (Apple Silicon CPU) • Accurate Marathi & Varhadi ASR',
      statusDialectTitle: 'Dialect & Translation',
      statusDialectDesc: 'Non-destructive Varhadi normalization • NLLB-200 / IndicTrans2',
      statusLlmTitle: 'Local Language Model (LLM)',
      statusLlmDesc: 'Ollama Qwen2.5 1.5B (Apple Metal) • Zero Cloud Costs & Complete Privacy',
      statusRagTitle: 'Knowledge Base (RAG)',
      statusRagDesc: 'Multilingual E5 + FAISS • PyMuPDF & Devanagari Tesseract OCR',
      demoTitle: 'Farmer Demonstration Queries (Vidarbha Region)',
      demoSubtitle: 'Click any question below to test evidence-grounded answers in Varhadi or Marathi:',
      askButton: 'Ask this question',
      sampleQueries: [
        {
          tag: 'Varhadi Dialect (Vidarbha)',
          query: 'मले शेतीसाठी कर्जमाफी आणि शासकीय अनुदान कसं भेटन ते सांगा.',
          meaning: 'How can I get farmer loan waiver and government agricultural subsidies?'
        },
        {
          tag: 'Standard Marathi',
          query: 'नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष आणि आवश्यक कागदपत्रे कोणती आहेत?',
          meaning: 'What are the eligibility criteria and documents for Namo Shetkari Yojana?'
        },
        {
          tag: 'Crop Insurance Inquiry',
          query: 'अतिवृष्टीमुळे कापूस आणि सोयाबीन पिकाचे नुकसान झाल्यास नुकसान भरपाई कशी मागता येईल?',
          meaning: 'How to claim crop insurance compensation for heavy rain damage to cotton and soybean?'
        }
      ]
    },
    voice: {
      title: 'Voice Scheme Assistant',
      subtitle: 'Speak in Varhadi or Marathi using your microphone, or upload a recorded audio file.',
      recordStart: 'Record Voice',
      recordStop: 'Stop Recording',
      recordingTime: 'Recording Time',
      uploadAudio: 'Upload Audio File (WAV, MP3, WebM)',
      processing: 'Processing speech & detecting dialect...',
      previewTitle: 'Recognized Speech & Dialect Analysis',
      detectedDialect: 'Detected Dialect',
      originalTranscript: 'Original Spoken Transcript (Preserved)',
      normalizedQuery: 'Standardized Marathi Query (Normalized for RAG)',
      editTranscript: 'Edit Transcript',
      saveEdit: 'Save & Reprocess',
      cancelEdit: 'Cancel',
      submitToChat: 'Ask Scheme Assistant with this Query',
      confidence: 'Recognition Confidence',
      duration: 'Processing Duration',
      noAudioRecorded: 'Please record audio or upload an audio file first.',
      micPermissionError: 'Microphone access denied or unavailable in your browser.',
      dialectNote: 'Your original spoken transcript is permanently preserved and never overwritten.'
    },
    chat: {
      title: 'Evidence-Grounded Scheme Chat',
      subtitle: 'Accurate answers grounded directly in official Maharashtra Government Resolutions with exact page citations.',
      inputPlaceholder: 'Type your question in Varhadi, Marathi, Hindi, or English (e.g. loan waiver eligibility)...',
      sendButton: 'Send',
      thinking: 'Searching government resolutions & generating grounded answer...',
      sourcesTitle: 'Verified Source Documents & Page Citations',
      page: 'Page',
      similarity: 'Relevance Score',
      viewEnglish: 'View English Translation',
      hideEnglish: 'Hide English',
      translating: 'Translating to English...',
      audioListen: 'Listen in Marathi (Audio)',
      audioPlaying: 'Playing Audio...',
      dialectBadge: 'Dialect',
      normalizedBadge: 'Normalized Form',
      ratePrompt: 'Was this answer helpful and accurate?',
      rateCorrectionPlaceholder: 'Suggest corrections or missing details here...',
      submitFeedback: 'Submit Citizen Feedback',
      feedbackSuccess: 'Thank you! Your feedback has been recorded for administrative review.',
      emptyChatPrompt: 'Ask any question or pick one of the sample demonstration queries above.'
    },
    kb: {
      title: 'Government Scheme Document Repository',
      subtitle: 'Upload official Maharashtra Government Resolutions (GRs). Processed with PyMuPDF & Tesseract OCR.',
      uploadHeader: 'Upload New Scheme Resolution (PDF)',
      fileLabel: 'Select PDF Document',
      titleLabel: 'Scheme / Document Title',
      authorityLabel: 'Issuing Department / Authority',
      uploadBtn: 'Process & Index Document',
      uploading: 'Scanning PDF & Extracting Text (OCR)...',
      statsTotalDocs: 'Total Documents',
      statsTotalChunks: 'Indexed Semantic Chunks',
      indexedListHeader: 'Indexed Government Resolutions in Knowledge Base',
      docDelete: 'Delete',
      rebuildBtn: 'Rebuild FAISS Index',
      rebuilding: 'Rebuilding Vector Index...',
      emptyList: 'No documents uploaded yet.'
    },
    eval: {
      title: 'Evaluation & Accuracy Benchmark Dashboard',
      subtitle: 'Empirical accuracy metrics measured on human-verified Marathi and Varhadi reference datasets (No Fabricated Metrics).',
      btnRunAsr: 'Run ASR Benchmark',
      btnRunRag: 'Run RAG Benchmark',
      runningAsr: 'Running Speech Benchmark...',
      runningRag: 'Evaluating 30 Questions...',
      asrSectionTitle: 'Speech Recognition Accuracy (WER & CER)',
      modelSelectLabel: 'Select Model:',
      werLabel: 'Word Error Rate (WER)',
      werDesc: 'Word level error rate (Lower is better)',
      cerLabel: 'Character Error Rate (CER)',
      cerDesc: 'Character level error rate',
      exactMatchLabel: 'Exact Match Rate',
      exactMatchDesc: '100% exact transcript matches',
      latencyLabel: 'Average Latency',
      latencyDesc: 'Processing time per sentence',
      categoryBreakdownTitle: 'Dialect-Specific Recognition Breakdown',
      samplesCount: 'Test Sentences',
      ragSectionTitle: 'Scheme Retrieval Accuracy (30-Question Benchmark)',
      recallLabel: 'Recall @ Top 4',
      recallDesc: 'Proportion of expected facts retrieved',
      precisionLabel: 'Precision @ Top 4',
      precisionDesc: 'Relevance of retrieved chunks',
      mrrLabel: 'Mean Reciprocal Rank (MRR)',
      mrrDesc: 'Position of first relevant citation',
      suppressionLabel: 'Unsupported Claim Suppression',
      suppressionDesc: 'Rejection of out-of-domain speculation',
      noDataTitle: 'No Benchmark Data Available',
      noDataDesc: 'Click "Run Benchmark" above to test the active models against verified ground truth.'
    },
    footer: {
      text: '© 2026 BharatLangTech AI — Dialect-Aware Multilingual Voice Intelligence Platform for Indian Citizens. All inference runs 100% locally on Apple Silicon (M2). No proprietary cloud APIs.'
    }
  }
};

export const getTranslation = (lang: string): TranslationDictionary => {
  return translations[lang] || translations.mr;
};
