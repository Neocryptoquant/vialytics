from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
# from vialytics_api.core.config import settings # Hardcode for debugging/stability
SQLALCHEMY_DATABASE_URL = "sqlite:////home/eaa/sol-quant/hackathon/vialytics/vialytics-core/wallet.db"
# SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # Needed for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
