from sqlalchemy.orm import Session
import models, schemas

def get_books(db: Session, query: str = "", category: str = ""):
    q = db.query(models.Book)
    if query:
        from sqlalchemy import or_
        q = q.filter(or_(
            models.Book.title.ilike(f"%{query}%"),
            models.Book.authors.ilike(f"%{query}%"),
            models.Book.publisher.ilike(f"%{query}%"),
            models.Book.contents.ilike(f"%{query}%")
        ))
    if category:
        q = q.filter(models.Book.category.ilike(f"%{category}%"))
    return q.all()