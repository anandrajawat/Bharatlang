from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from backend.app.database.session import get_db
from backend.app.database.models import EvaluationResult
from backend.app.evaluation.asr_metrics import run_asr_benchmark
from backend.app.evaluation.retrieval_metrics import evaluate_retrieval_benchmark
from backend.app.core.logging import logger

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation & Benchmarking"])

@router.get("/summary")
async def get_evaluation_summary(db: Session = Depends(get_db)):
    """
    Returns actual evaluation metrics from completed benchmarks.
    Displays genuine empty state if no benchmark data has been run yet.
    """
    eval_records = db.query(EvaluationResult).order_by(EvaluationResult.evaluation_date.desc()).limit(20).all()

    # Get live status of RAG index
    rag_benchmark = evaluate_retrieval_benchmark()

    return {
        "has_asr_evaluation": len(eval_records) > 0,
        "recent_benchmarks": [
            {
                "id": r.id,
                "model_name": r.model_name,
                "benchmark_type": r.benchmark_type,
                "language": r.language,
                "wer": r.wer,
                "cer": r.cer,
                "latency_sec": r.latency,
                "evaluation_date": r.evaluation_date.isoformat() if r.evaluation_date else None,
                "details": r.details
            } for r in eval_records
        ],
        "rag_retrieval_benchmark": rag_benchmark
    }

@router.post("/run-asr")
async def trigger_asr_benchmark(
    model_name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Runs live end-to-end ASR benchmark on human-verified Marathi and Varhadi reference test set.
    Calculates genuine WER, CER, latency, and category performance.
    """
    logger.info(f"Triggering ASR benchmark for model '{model_name}'...")
    res = await run_asr_benchmark(model_name)

    # Save evaluation result to database
    record = EvaluationResult(
        model_name=res["model_name"],
        benchmark_type="asr",
        language="Marathi & Varhadi",
        wer=res["overall_wer"],
        cer=res["overall_cer"],
        latency=res["avg_latency_sec"],
        details=res
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "status": "success",
        "evaluation_id": record.id,
        "results": res
    }

@router.post("/run-rag")
async def trigger_rag_benchmark():
    """
    Evaluates semantic retrieval accuracy across 30 curated government scheme questions.
    """
    logger.info("Evaluating RAG retrieval benchmark across 30 questions...")
    res = evaluate_retrieval_benchmark(top_k=4)
    return {
        "status": "success",
        "results": res
    }
