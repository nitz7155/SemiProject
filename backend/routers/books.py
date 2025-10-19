# app/routers/books.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(prefix="/books",
                   tags=["Books"])

@router.get("/", response_model=list[schemas.Book])
def get_books(query: str = "",
               category: str = "",
               db: Session = Depends(database.get_db)):
    return crud.get_books(db, query=query, category=category)