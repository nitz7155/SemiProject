from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Book, User, Question, Answer
from schemas import QuestionResponse, QuestionCreate

router = APIRouter(prefix='/books', tags=['QnA'])

def check_book(book_id: int, db: Session):
    """ 책 존재 여부 검증 """
    data = db.query(Book).filter(Book.id == book_id).first()

    if not data:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다.")

@router.get('/{book_id}/questions')
def read_questions(book_id: int, db: Session=Depends(get_db)):
    """ 전체 QnA 조회 """
    check_book(book_id, db)

    questions = db.query(Question).filter(Question.book_id == book_id).all()

    if not questions:
        raise HTTPException(status_code=404, detail="QnA를 찾을 수 없습니다.")

    return questions

@router.post('/{book_id}/questions', response_model=QuestionResponse, status_code=201)
def create_question(data: QuestionCreate, book_id: int, user_id: int = 0, db: Session=Depends(get_db)):
    """ 질문 생성 """
    check_book(book_id, db)

    question = Question(
        user_id=user_id,
        book_id=book_id,
        title=data.title,
        content=data.content
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question

@router.patch('/{book_id}/questions/{question_id}')
def update_question(book_id: int, question_id: int, db: Session=Depends(get_db)):
    """ 질문 업데이트 """
    check_book(book_id, db)
    pass

@router.delete('/{book_id}/questions/{question_id}')
def delete_question(book_id: int, question_id: int, db: Session=Depends(get_db)):
    """ 질문 삭제 """
    check_book(book_id, db)
    pass

@router.post('/{book_id}/questions/{question_id}/answers')
def create_answer(book_id: int, question_id: int, user_id: int = 0, db: Session=Depends(get_db)):
    """ 답변 생성 """
    check_book(book_id, db)
    pass

@router.patch('/{book_id}/questions/{question_id}/answers/{answer_id}')
def update_answer(book_id: int, question_id: int, answer_id: int, db: Session=Depends(get_db)):
    """ 답변 업데이트 """
    check_book(book_id, db)
    pass

@router.delete('/{book_id}/questions/{question_id}/answers/{answer_id}')
def delete_answer(book_id: int, question_id: int, answer_id: int, db: Session=Depends(get_db)):
    """ 답변 삭제 """
    check_book(book_id, db)
    pass