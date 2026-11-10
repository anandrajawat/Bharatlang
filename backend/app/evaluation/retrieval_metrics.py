from typing import List, Dict, Any
from backend.app.services.rag.retrieval import faiss_retriever

# 30 Curated Government Scheme Test Questions across categories
CURATED_RAG_BENCHMARK_QUESTIONS: List[Dict[str, Any]] = [
    # 1-7: Core eligibility & benefits
    {"id": "q01", "query": "नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष काय आहेत?", "expected_keywords": ["पात्रता", "शेतकरी", "हप्ता"], "type": "eligibility"},
    {"id": "q02", "query": "Who is eligible for PM Kisan Samman Nidhi in Maharashtra?", "expected_keywords": ["eligible", "farmer", "landholding"], "type": "eligibility"},
    {"id": "q03", "query": "महात्मा ज्योतिराव फुले शेतकरी कर्जमुक्ती योजनेअंतर्गत किती कर्जमाफी मिळते?", "expected_keywords": ["कर्जमुक्ती", "रुपये", "लाख"], "type": "benefits"},
    {"id": "q04", "query": "What financial benefit is provided under Namo Shetkari Mahasanman Nidhi?", "expected_keywords": ["benefit", "6000", "installment"], "type": "benefits"},
    {"id": "q05", "query": "पंतप्रधान पीक विमा योजनेअंतर्गत पिकांचे कोणते नुकसान समाविष्ट आहे?", "expected_keywords": ["पीक विमा", "नुकसान", "अतिवृष्टी", "दुष्काळ"], "type": "benefits"},
    {"id": "q06", "query": "शेतकरी अपघात सुरक्षा सानुग्रह अनुदान योजनेचे निकष काय आहेत?", "expected_keywords": ["अपघात", "सुरक्षा", "अनुदान", "कुटुंब"], "type": "eligibility"},
    {"id": "q07", "query": "ठिबक सिंचन योजनेवर लहान व सीमांत शेतकऱ्यांना किती टक्के अनुदान मिळते?", "expected_keywords": ["ठिबक सिंचन", "अनुदान", "टक्के"], "type": "benefits"},

    # 8-14: Required documents & checklist
    {"id": "q08", "query": "पीक विमा भरण्यासाठी कोणती कागदपत्रे लागतात?", "expected_keywords": ["कागदपत्रे", "७/१२", "आधार", "बँक"], "type": "documents"},
    {"id": "q09", "query": "What documents are required to apply for drip irrigation subsidy on MahaDBT?", "expected_keywords": ["documents", "7/12", "aadhaar", "bank"], "type": "documents"},
    {"id": "q10", "query": "कर्जमाफी योजनेसाठी आधार प्रमाणीकरण करणे आवश्यक आहे का?", "expected_keywords": ["आधार", "प्रमाणीकरण", "ई-केवायसी"], "type": "documents"},
    {"id": "q11", "query": "What is the requirement of 7/12 extract for agriculture schemes?", "expected_keywords": ["7/12", "land", "record"], "type": "documents"},
    {"id": "q12", "query": "कृषी पंप वीज जोडणीसाठी अर्जासोबत काय जोडावे लागते?", "expected_keywords": ["वीज", "पंप", "कागदपत्रे"], "type": "documents"},
    {"id": "q13", "query": "नमो शेतकरी योजनेसाठी बँक खाते आधार संलग्न असणे का गरजेचे आहे?", "expected_keywords": ["आधार", "संलग्न", "डीबीटी"], "type": "documents"},
    {"id": "q14", "query": "Do tenant farmers or sharecroppers require special documents for crop insurance?", "expected_keywords": ["tenant", "documents", "agreement"], "type": "documents"},

    # 15-21: Application procedures & portals
    {"id": "q15", "query": "महाडीबीटी पोर्टलवर शेतकरी योजनांसाठी नोंदणी कशी करावी?", "expected_keywords": ["महाडीबीटी", "नोंदणी", "अर्ज"], "type": "procedure"},
    {"id": "q16", "query": "How can a farmer apply for crop loss compensation online?", "expected_keywords": ["apply", "online", "portal", "compensation"], "type": "procedure"},
    {"id": "q17", "query": "पीक विमा भरण्याची अंतिम मुदत कधी असते?", "expected_keywords": ["मुदत", "दिनांक", "विमा"], "type": "procedure"},
    {"id": "q18", "query": "Where should a farmer submit grievance if PM-Kisan installment is stopped?", "expected_keywords": ["grievance", "officer", "taluka", "help"], "type": "procedure"},
    {"id": "q19", "query": "तालुका कृषी कार्यालयात जाऊन कोणकोणत्या योजनांची माहिती घेता येते?", "expected_keywords": ["कृषी", "कार्यालय", "योजना"], "type": "procedure"},
    {"id": "q20", "query": "How is the direct benefit transfer amount credited to the farmer?", "expected_keywords": ["transfer", "account", "dbt"], "type": "procedure"},
    {"id": "q21", "query": "अतिवृष्टीमुळे नुकसान झाल्यास किती तासांत विमा कंपनीला पूर्वसूचना द्यावी लागते?", "expected_keywords": ["तास", "७२ तास", "सूचना"], "type": "procedure"},

    # 22-26: Dialectal Varhadi scheme queries
    {"id": "q22", "query": "मले शेतीसाठी कर्जमाफी आणि अनुदान कसं भेटन ते सांगा?", "expected_keywords": ["कर्जमाफी", "अनुदान", "पात्रता"], "type": "varhadi"},
    {"id": "q23", "query": "कापूस आणि सोयाबीन पिकाची नुकसानी झाली हाये, म्हाले पयशे कवा भेटतील?", "expected_keywords": ["नुकसान", "पैसे", "विमा"], "type": "varhadi"},
    {"id": "q24", "query": "ह्या योजनेसाठी काय काय कागदपत्तुर पायजेत?", "expected_keywords": ["कागदपत्रे", "कागद"], "type": "varhadi"},
    {"id": "q25", "query": "वावरात विहिरीसाठी शासकीय अनुदान भेटते का?", "expected_keywords": ["विहीर", "अनुदान", "शेत"], "type": "varhadi"},
    {"id": "q26", "query": "आमच्या गावात दुष्काळ जाहीर झालाय का नाही कसं तपासावं?", "expected_keywords": ["दुष्काळ", "शासन", "तपासणी"], "type": "varhadi"},

    # 27-30: Unsupported / Out-of-scope / Missing information queries
    {"id": "q27", "query": "विदर्भात सोन्याची खाण शोधण्यासाठी सरकार अनुदान देते का?", "expected_keywords": [], "type": "unsupported"},
    {"id": "q28", "query": "What is the government subsidy for buying private helicopter in Nagpur?", "expected_keywords": [], "type": "unsupported"},
    {"id": "q29", "query": "शेतकऱ्यांसाठी मोफत परदेश दौरा योजना महाराष्ट्र शासनाने सुरू केली आहे का?", "expected_keywords": [], "type": "unsupported"},
    {"id": "q30", "query": "२०४५ सालच्या खरीप हंगामासाठी पीक विमा हप्ता दर काय असेल?", "expected_keywords": [], "type": "unsupported"}
]

def evaluate_retrieval_benchmark(top_k: int = 4) -> Dict[str, Any]:
    """
    Evaluates the RAG retrieval engine on 30 curated scheme questions.
    Calculates:
    - Recall@K
    - Precision@K
    - Mean Reciprocal Rank (MRR)
    - Citation Coverage
    - Unsupported Query Handling
    """
    stats = faiss_retriever.get_stats()
    if stats["total_chunks"] == 0:
        return {
            "status": "empty_index",
            "message": "No documents currently indexed in knowledge base.",
            "total_chunks": 0,
            "recall_at_k": 0.0,
            "precision_at_k": 0.0,
            "mrr": 0.0,
            "citation_coverage": 0.0,
            "eval_date": None
        }

    reciprocal_ranks = []
    hits_at_k = 0
    total_retrieved = 0
    relevant_retrieved = 0
    citations_present = 0

    results_log = []

    for item in CURATED_RAG_BENCHMARK_QUESTIONS:
        query = item["query"]
        expected_keywords = item["expected_keywords"]
        is_unsupported = (item["type"] == "unsupported")

        chunks = faiss_retriever.search(query=query, top_k=top_k, similarity_threshold=0.25)
        total_retrieved += len(chunks)

        if not is_unsupported:
            hit = False
            first_rank = 0
            for rank, c in enumerate(chunks, 1):
                c_text = c.get("text", "").lower()
                # Check if any expected keyword is in retrieved chunk
                if any(kw.lower() in c_text for kw in expected_keywords):
                    if not hit:
                        hit = True
                        first_rank = rank
                    relevant_retrieved += 1

            if hit:
                hits_at_k += 1
                reciprocal_ranks.append(1.0 / first_rank)
                citations_present += 1
            else:
                reciprocal_ranks.append(0.0)
        else:
            # For unsupported questions, the best outcome is low similarity / zero matches
            if len(chunks) == 0:
                hits_at_k += 1
                reciprocal_ranks.append(1.0)
            else:
                reciprocal_ranks.append(0.0)

        results_log.append({
            "id": item["id"],
            "type": item["type"],
            "query": query,
            "retrieved_count": len(chunks),
            "top_score": chunks[0]["similarity_score"] if chunks else 0.0
        })

    num_q = len(CURATED_RAG_BENCHMARK_QUESTIONS)
    recall = round(hits_at_k / num_q, 4)
    precision = round(relevant_retrieved / max(total_retrieved, 1), 4)
    mrr = round(sum(reciprocal_ranks) / max(len(reciprocal_ranks), 1), 4)
    citation_cov = round(citations_present / max(num_q - 4, 1), 4)

    return {
        "status": "success",
        "benchmark_questions_count": num_q,
        "indexed_chunks": stats["total_chunks"],
        "indexed_documents": stats["indexed_documents_count"],
        "recall_at_k": recall,
        "precision_at_k": precision,
        "mrr": mrr,
        "citation_coverage": citation_cov,
        "unsupported_claim_suppression": round(sum(1 for r in results_log if r["type"] == "unsupported" and r["retrieved_count"] == 0) / 4.0, 2),
        "results": results_log[:10]  # Preview first 10
    }

