from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.app.core.config import settings
from backend.app.database.models import Base

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db() -> None:
    """Create all database tables if they do not exist."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """FastAPI Dependency for database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
