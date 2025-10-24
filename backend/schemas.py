from datetime import datetime

from pydantic import BaseModel, ConfigDict

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

    model_config = ConfigDict(from_attributes=True)
########################################################################################################################
""" Question """
class QuestionBase(BaseModel):
    content: str

    model_config = ConfigDict(from_attributes=True)

class QuestionResponse(QuestionBase):
    id: int
    user_id: int
    question_nickname: str
    title: str
    book_id: int
    created_at: datetime
    updated_at: datetime | None
    comments: list["AnswerResponse"] = []

class QuestionCreate(QuestionBase):
    title: str

class QuestionUpdate(QuestionBase):
    pass
########################################################################################################################
""" Answer """
class AnswerBase(BaseModel):
    content: str

    model_config = ConfigDict(from_attributes=True)

class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int
    answer_nickname: str
    created_at: datetime
    updated_at: datetime | None

class AnswerCreate(AnswerBase):
    pass

class AnswerUpdate(AnswerBase):
    pass
########################################################################################################################
QuestionResponse.model_rebuild()
########################################################################################################################