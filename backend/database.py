from dotenv import load_dotenv
from fastapi import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import Session
import os

# PostgreSQL 연결 문자열
# db url 필요
ENV_PATH = Path(__file__).parent / '.env'
load_dotenv(ENV_PATH)

DB_URL = os.getenv("DB_URL")

# 엔진 및 세션 설정
engine = create_engine(
    DB_URL
    )

# 세션 
SessionLocal = sessionmaker(autocommit=False,  # 확정을 자동으로 주지 않겠다 
                            autoflush=False,   # 새로고침을 자동으로 하지 않겠다 
                            bind=engine)       # 어떤 데이터베이스랑 연결시켜서 세션을 만들건지 지정

# Base 클래스
Base = declarative_base()

# FastAPI 의존성 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)