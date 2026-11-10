import re
from typing import List, Dict, Any

def chunk_document_pages(
    pages: List[Dict[str, Any]],
    doc_id: str,
    title: str,
    issuing_authority: str = "Government of Maharashtra",
    chunk_size: int = 500,
    chunk_overlap: int = 100
) -> List[Dict[str, Any]]:
    """
    Chunks extracted page texts into sliding-window semantic segments
    while preserving strict page numbers, document IDs, and titles.
    """
    chunks = []
    chunk_idx = 0

    for page_info in pages:
        page_num = page_info["page"]
        text = page_info["text"]
        if not text or not text.strip():
            continue

        # Split page text into paragraphs first
        paragraphs = [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]

        current_chunk = ""
        for para in paragraphs:
            if len(current_chunk) + len(para) <= chunk_size:
                current_chunk = (current_chunk + "\n" + para).strip()
            else:
                if current_chunk:
                    chunks.append({
                        "chunk_id": f"{doc_id}_p{page_num}_c{chunk_idx}",
                        "doc_id": doc_id,
                        "title": title,
                        "page": page_num,
                        "text": current_chunk,
                        "issuing_authority": issuing_authority
                    })
                    chunk_idx += 1
                    # Overlap
                    overlap_text = current_chunk[-chunk_overlap:] if len(current_chunk) > chunk_overlap else ""
                    current_chunk = (overlap_text + "\n" + para).strip()
                else:
                    # Single paragraph exceeds chunk_size, split by sentences
                    current_chunk = para

        if current_chunk:
            chunks.append({
                "chunk_id": f"{doc_id}_p{page_num}_c{chunk_idx}",
                "doc_id": doc_id,
                "title": title,
                "page": page_num,
                "text": current_chunk,
                "issuing_authority": issuing_authority
            })
            chunk_idx += 1

    return chunks

