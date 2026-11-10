import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import faiss
import numpy as np
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.rag.embeddings import embedding_engine

INDEX_FILE = settings.INDEXES_DIR / "faiss_index.bin"
METADATA_FILE = settings.INDEXES_DIR / "chunks_metadata.json"

class FAISSRetriever:
    """
    FAISS-based vector retrieval system with metadata persistence,
    cosine similarity scoring, and document deletion support.
    """

    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index: Optional[faiss.Index] = None
        self.metadata_store: List[Dict[str, Any]] = []
        self._load_index_from_disk()

    def _init_new_index(self):
        # IndexFlatIP calculates inner product; on normalized embeddings, this equals cosine similarity.
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata_store = []

    def _load_index_from_disk(self) -> None:
        if INDEX_FILE.exists() and METADATA_FILE.exists():
            try:
                logger.info(f"Loading existing FAISS index from {INDEX_FILE}...")
                self.index = faiss.read_index(str(INDEX_FILE))
                with open(METADATA_FILE, "r", encoding="utf-8") as f:
                    self.metadata_store = json.load(f)
                logger.info(f"Loaded index with {self.index.ntotal} vectors and {len(self.metadata_store)} metadata records.")
            except Exception as e:
                logger.error(f"Failed to load FAISS index from disk: {e}. Reinitializing empty index.")
                self._init_new_index()
        else:
            self._init_new_index()

    def save_to_disk(self) -> None:
        """Persists FAISS index binary and metadata JSON to disk."""
        if self.index is not None:
            settings.INDEXES_DIR.mkdir(parents=True, exist_ok=True)
            faiss.write_index(self.index, str(INDEX_FILE))
            with open(METADATA_FILE, "w", encoding="utf-8") as f:
                json.dump(self.metadata_store, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved FAISS index ({self.index.ntotal} vectors) to {INDEX_FILE}.")

    def add_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """Encodes and appends new document chunks to the FAISS index."""
        if not chunks:
            return 0

        texts = [c["text"] for c in chunks]
        embeddings = embedding_engine.encode_passages(texts)

        if self.index is None:
            self._init_new_index()

        self.index.add(embeddings)
        self.metadata_store.extend(chunks)
        self.save_to_disk()
        return len(chunks)

    def delete_document(self, doc_id: str) -> int:
        """
        Removes all vectors belonging to doc_id and rebuilds the FAISS index.
        """
        if not self.metadata_store:
            return 0

        remaining_chunks = [c for c in self.metadata_store if c.get("doc_id") != doc_id]
        removed_count = len(self.metadata_store) - len(remaining_chunks)

        if removed_count == 0:
            return 0

        logger.info(f"Deleting document {doc_id} ({removed_count} chunks)...")
        # Rebuild index
        self._init_new_index()
        if remaining_chunks:
            texts = [c["text"] for c in remaining_chunks]
            embeddings = embedding_engine.encode_passages(texts)
            self.index.add(embeddings)
            self.metadata_store = remaining_chunks

        self.save_to_disk()
        return removed_count

    def search(
        self,
        query: str,
        top_k: int = settings.RETRIEVAL_TOP_K,
        similarity_threshold: float = settings.RETRIEVAL_SIMILARITY_THRESHOLD
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic similarity search against indexed document chunks.
        Filters by similarity threshold and removes duplicates.
        """
        if self.index is None or self.index.ntotal == 0 or not self.metadata_store:
            return []

        query_vec = embedding_engine.encode_query(query).reshape(1, -1)
        k = min(top_k * 2, self.index.ntotal)
        scores, indices = self.index.search(query_vec, k)

        results = []
        seen_texts = set()

        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.metadata_store):
                continue
            if score < similarity_threshold:
                continue

            chunk = dict(self.metadata_store[idx])
            chunk["similarity_score"] = round(float(score), 4)

            # Deduplication
            text_prefix = chunk["text"][:100]
            if text_prefix in seen_texts:
                continue
            seen_texts.add(text_prefix)

            results.append(chunk)
            if len(results) >= top_k:
                break

        return results

    def get_stats(self) -> Dict[str, Any]:
        doc_ids = set(c.get("doc_id") for c in self.metadata_store)
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "total_chunks": len(self.metadata_store),
            "indexed_documents_count": len(doc_ids),
            "indexed_document_ids": list(doc_ids)
        }

faiss_retriever = FAISSRetriever()

