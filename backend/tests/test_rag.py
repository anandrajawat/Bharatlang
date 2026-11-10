import pytest
from backend.app.services.rag.chunking import chunk_document_pages
from backend.app.services.rag.retrieval import faiss_retriever

def test_document_chunking():
    pages = [
        {"page": 1, "text": "परिच्छेद १: नमो शेतकरी महासन्मान निधी.\n\nपरिच्छेद २: पात्रता निकष."},
        {"page": 2, "text": "परिच्छेद ३: आवश्यक कागदपत्रे.\n\nपरिच्छेद ४: अर्ज प्रक्रिया."}
    ]
    chunks = chunk_document_pages(pages, doc_id="test_doc", title="Test Scheme")
    assert len(chunks) >= 2
    assert chunks[0]["doc_id"] == "test_doc"
    assert chunks[0]["page"] == 1
    assert "नमो शेतकरी" in chunks[0]["text"]

def test_faiss_retrieval_seeded_query():
    # Search for loan waiver
    results = faiss_retriever.search("शेतकरी कर्जमाफी आणि २ लाख रुपये कर्जमुक्ती", top_k=2)
    assert len(results) > 0
    top_doc = results[0]
    assert "कर्जमुक्ती" in top_doc["title"] or "कर्जमाफी" in top_doc["text"]
    assert top_doc["similarity_score"] > 0.50

def test_faiss_unsupported_query_filtering():
    # Search for an out-of-domain query with strict similarity threshold
    results = faiss_retriever.search("quantum computing black hole astrophysics semiconductor lithography", top_k=2, similarity_threshold=0.85)
    assert len(results) == 0
