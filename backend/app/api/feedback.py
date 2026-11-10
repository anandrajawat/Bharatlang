from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
from backend.app.database.session import get_db
from backend.app.database.models import Feedback, Message

router = APIRouter(prefix="/api/feedback", tags=["Citizen Feedback & Admin Review"])

class FeedbackCreateRequest(BaseModel):
    message_id: str
    rating: int = Field(..., ge=1, le=5, description="Citizen satisfaction rating 1 to 5")
    correction: Optional[str] = None
    feedback_notes: Optional[str] = None

@router.post("")
async def submit_feedback(req: FeedbackCreateRequest, db: Session = Depends(get_db)):
    """Stores citizen feedback, corrections, and satisfaction ratings."""
    msg = db.query(Message).filter(Message.id == req.message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Referenced message not found.")

    feedback_record = Feedback(
        message_id=req.message_id,
        rating=req.rating,
        correction=req.correction.strip() if req.correction else None,
        feedback_notes=req.feedback_notes.strip() if req.feedback_notes else None,
        review_status="pending"
    )
    db.add(feedback_record)

    # If citizen provided a transcript correction, update corrected_transcript in message
    if req.correction and req.correction.strip():
        msg.corrected_transcript = req.correction.strip()

    db.commit()
    db.refresh(feedback_record)

    return {
        "status": "success",
        "message": "Feedback recorded successfully. Thank you for helping improve BharatLangTech AI.",
        "feedback_id": feedback_record.id
    }

@router.get("")
async def list_feedback(db: Session = Depends(get_db)):
    """Admin view for reviewing collected transcript corrections and citizen ratings."""
    feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).limit(50).all()
    return [
        {
            "id": f.id,
            "message_id": f.message_id,
            "rating": f.rating,
            "correction": f.correction,
            "feedback_notes": f.feedback_notes,
            "review_status": f.review_status,
            "created_at": f.created_at.isoformat() if f.created_at else None
        } for f in feedbacks
    ]
