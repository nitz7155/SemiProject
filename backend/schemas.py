from pydantic import BaseModel
from datetime import date

class BookBase(BaseModel):
    title: str
    authors: str
    publisher: str
    datetime: date
    isbn: str
    price: int
    thumbnail: str
    contents: str
    status: bool
    category: str

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int

    class Config:
        orm_mode = True