from datetime import datetime
from pydantic import BaseModel

class BookBase(BaseModel):
    title: str
    authors: str
    publisher: str
    datetime: datetime
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

########################################################################################################################
class QuestionBase(BaseModel):
    title: str
    content: str

    class Config:
        orm_mode = True

class QuestionResponse(QuestionBase):
    id: int
    created_at: datetime
    updated_at: datetime

class QuestionCreate(QuestionBase):
    pass
########################################################################################################################