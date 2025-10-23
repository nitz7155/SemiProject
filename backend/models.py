from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, func, ForeignKey, REAL, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class Book(Base):
    __tablename__ = "books"
    __table_args__ = {'sqlite_autoincrement': True}  # SQLite 에서만 사용

    # PostgreSQL에선 id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, primary_key=True)
    title = Column(String)
    authors = Column(String)
    publisher = Column(String)
    published_at = Column(DateTime)
    isbn = Column(String, unique=True)
    price = Column(Integer)
    thumbnail = Column(String)
    contents = Column(String)
    status = Column(Boolean)
    rating = Column(REAL, default=0.0)

    book_review = relationship("Review",
                          back_populates="review_book",
                          cascade='all, delete-orphan')
    question_book = relationship("Question", back_populates="book_question", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'sqlite_autoincrement': True} # SQLite 에서만 사용

    # PostgreSQL에선 id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    nickname = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    user_review = relationship("Review",
                               back_populates="review_user",
                               cascade='all, delete-orphan')
    user_searchlog = relationship("SearchLogs",
                                  back_populates="searchlog_user",
                                  cascade='all, delete-orphan')
    question_user = relationship("Question", back_populates="user_question", cascade="all, delete-orphan")
    answer_user = relationship("Answer", back_populates="user_answer", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    __table_args__ = {'sqlite_autoincrement': True} # SQLite 에서만 사용

    # PostgreSQL에선 id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_question = relationship("User", back_populates="question_user")
    book_question = relationship("Book", back_populates="question_book")
    answer_question = relationship("Answer", back_populates="question_answer", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"
    __table_args__ = {'sqlite_autoincrement': True} # SQLite 에서만 사용

    # PostgreSQL에선 id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_answer = relationship("User", back_populates="answer_user")
    question_answer = relationship("Question", back_populates="answer_question")

class Review(Base) :
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="Cascade"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="Cascade"), nullable=False)
    rating = Column(Integer, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime)
    is_public = Column(Boolean, default=True, nullable=False)

    review_user = relationship("User",
                          back_populates="user_review")
    review_book = relationship("Book",
                          back_populates="book_review")

    __table_args__ = (
        CheckConstraint('rating BETWEEN 0 AND 5', name='check_rating_range'),
    )

class SearchLogs(Base) :
    __tablename__ = "searchlogs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="Cascade"), nullable=False)
    keyword = Column(String)
    created_at = Column(DateTime, default=datetime.now())

    searchlog_user = relationship("User",
                        back_populates="user_searchlog")