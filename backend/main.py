import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routers import qna, books
from pathlib import Path
import uvicorn

# 환경변수 설정
ENV_PATH = Path(__file__).parent / '.env'
load_dotenv(ENV_PATH)

# 환경변수 가져오기
REACT_HOST = os.getenv('REACT_HOST', "react-server")

if REACT_HOST.startswith('http'):
    ORIGIN = REACT_HOST
else:
    ORIGIN = f"https://{REACT_HOST}.onrender.com"

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(books.router)
app.include_router(qna.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )