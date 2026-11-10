import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), nullable=False, default="citizen_user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    language = Column(String(20), nullable=False, default="mr")  # mr, mr-varhadi, hi, en
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False)
    
    # Speech & Dialect Details
    original_transcript = Column(Text, nullable=True)
    corrected_transcript = Column(Text, nullable=True)
    detected_dialect = Column(String(50), nullable=True)  # Standard Marathi, Varhadi, Mixed, English
    
    # Query & Translation
    translated_query = Column(Text, nullable=True)
    
    # Generated Answer & Sources
    generated_answer = Column(Text, nullable=False)
    translated_answer = Column(Text, nullable=True)
    sources = Column(JSON, nullable=True)  # List of {document_id, title, page, score, excerpt}
    audio_path = Column(String(255), nullable=True)
    latency_ms = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    feedbacks = relationship("Feedback", back_populates="message", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    source_url = Column(String(500), nullable=True)
    issuing_authority = Column(String(255), nullable=True, default="महाराष्ट्र शासन / Govt of Maharashtra")
    publication_date = Column(String(50), nullable=True)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    processing_status = Column(String(50), default="pending")  # pending, indexed, failed
    chunk_count = Column(Integer, default=0)
    file_size_kb = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    message_id = Column(String(36), ForeignKey("messages.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 (poor) to 5 (excellent)
    correction = Column(Text, nullable=True)
    feedback_notes = Column(Text, nullable=True)
    review_status = Column(String(50), default="pending")  # pending, reviewed, accepted, rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    message = relationship("Message", back_populates="feedbacks")


class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    model_name = Column(String(100), nullable=False)
    benchmark_type = Column(String(50), nullable=False)  # asr, translation, rag
    language = Column(String(50), nullable=False)  # Standard Marathi, Varhadi, English
    wer = Column(Float, nullable=True)
    cer = Column(Float, nullable=True)
    latency = Column(Float, nullable=True)  # in seconds or ms
    details = Column(JSON, nullable=True)  # Full benchmark details, sample metrics
    evaluation_date = Column(DateTime, default=datetime.datetime.utcnow)
