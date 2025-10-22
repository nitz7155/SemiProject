from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    authors = Column(String)
    publisher = Column(String)
    datetime = Column(Date)
    isbn = Column(String, unique=True)
    price = Column(Integer)
    thumbnail = Column(String)
    contents = Column(String)
    status = Column(Boolean)
    category = Column(String)

class User(Base):
    __tablename__ = "users"g

class Question(Base):
    __tablename__ = "questions"

class Answers(Base):
    __tablename__ = "answers"