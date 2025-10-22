from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    authors = Column(String)
    publisher = Column(String)
    datetime = Column(DateTime)
    isbn = Column(String, unique=True)
    price = Column(Integer)
    thumbnail = Column(String)
    contents = Column(String)
    status = Column(Boolean)
    category = Column(String)

    question_book = relationship(
        "Question",
        back_populates="book_question",
        cascade="all, delete-orphan"
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    nickname = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    question_user = relationship(
        "Question",
        back_populates="user_question",
        cascade="all, delete-orphan"
    )

    answer_user = relationship(
        "Answer",
        back_populates="user_answer",
        cascade="all, delete-orphan"
    )

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_question = relationship(
        "User",
        back_populates="question_user"
    )

    book_question = relationship(
        "Book",
        back_populates="question_book"
    )

    answer_question = relationship(
        "Answer",
        back_populates="question_answer",
        cascade="all, delete-orphan"
    )

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_answer = relationship(
        "User",
        back_populates="answer_user"
    )

    question_answer = relationship(
        "Question",
        back_populates="answer_question"
    )