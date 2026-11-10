import time
from typing import Dict, Any, List
from backend.app.services.translation.normalization import (
    detect_language_and_dialect,
    normalize_varhadi_to_marathi
)
from backend.app.services.rag.retrieval import faiss_retriever
from backend.app.services.llm.ollama_client import ollama_client
from backend.app.core.logging import logger

async def answer_government_scheme_query(
    user_query: str,
    language: str = "mr"
) -> Dict[str, Any]:
    """
    End-to-End Grounded Question Answering Engine:
    Dialect Normalization -> Semantic Vector Retrieval -> Grounded Local LLM Reasoning -> Structured Output.
    """
    start_time = time.time()

    # Step 1: Detect dialect and normalize Varhadi expressions
    detection = detect_language_and_dialect(user_query)
    normalized_query, replacements = normalize_varhadi_to_marathi(user_query)

    # Step 2: Retrieve relevant chunks from FAISS vector index
    # We query using the normalized Marathi query
    retrieved_chunks = faiss_retriever.search(
        query=normalized_query,
        top_k=4,
        similarity_threshold=0.30
    )

    # Step 3: Local LLM evidence-based reasoning
    llm_result = await ollama_client.generate_rag_answer(
        query=normalized_query,
        retrieved_chunks=retrieved_chunks,
        language=language
    )

    duration = time.time() - start_time

    # Step 4: Assemble source references
    sources = []
    for c in retrieved_chunks:
        sources.append({
            "document_id": c.get("doc_id"),
            "document_title": c.get("title"),
            "page": c.get("page"),
            "similarity_score": c.get("similarity_score"),
            "excerpt": c.get("text", "")[:280] + ("..." if len(c.get("text", "")) > 280 else "")
        })

    is_sufficient_evidence = len(retrieved_chunks) > 0 and (
        "उपलब्ध शासकीय कागदपत्रांमध्ये या प्रश्नाचे पुरेसे पुरावे उपलब्ध नाहीत" not in llm_result["answer"]
    )

    return {
        "original_query": user_query,
        "normalized_query": normalized_query,
        "detected_dialect": detection["dialect"],
        "dialect_replacements": replacements,
        "answer": llm_result["answer"],
        "sources": sources,
        "is_sufficient_evidence": is_sufficient_evidence,
        "llm_model": llm_result["model"],
        "is_fallback": llm_result.get("is_fallback", False),
        "total_latency_sec": round(duration, 3)
    }
