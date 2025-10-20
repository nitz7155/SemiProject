import json
import pandas as pd
from . import models, database

def seed_from_json():
    with open("book_kakao_cleaned.json", encoding="utf-8") as f:
        books = json.load(f)

    db = database.SessionLocal()
    for book in books:
        if not db.query(models.Book).filter_by(isbn=book["isbn"]).first():
            db_book = models.Book(**book)
            db.add(db_book)
    db.commit()
    db.close()

def seed_from_csv():
    df = pd.read_csv("book_kakao_cleaned.csv")
    df.fillna("", inplace=True)
    db = database.SessionLocal()
    for _, row in df.iterrows():
        book = models.Book(**row.to_dict())
        db.add(book)
    db.commit()
    db.close()