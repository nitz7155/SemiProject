from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import Book, Question, Answer, User
from schemas import QuestionResponse, QuestionCreate, QuestionUpdate, AnswerResponse, AnswerCreate, AnswerUpdate
from json import loads, JSONDecodeError

router = APIRouter(prefix="/books", tags=["QnA"])

def check_book(book_id: int, db: Session):
    """ 책 존재 여부 검증 """
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다.")

@router.get("/{book_id}/questions", response_model=list[QuestionResponse])
def read_questions(book_id: int, db: Session=Depends(get_db)):
    """ 전체 QnA 조회 """
    check_book(book_id, db)

    questions = (
        db.query(Question)
          .options(
            selectinload(Question.answer_question)
            .selectinload(Answer.user_answer),
            selectinload(Question.user_question)
          )
          .filter(Question.book_id == book_id)
          .all()
    )
    results = []

    for q in questions: # type: Question
        results.append(
            QuestionResponse(
                id=q.id,
                user_id=q.user_id,
                question_nickname=q.user_question.nickname,
                title=q.title,
                content=q.content,
                book_id=q.book_id,
                created_at=q.created_at,
                updated_at=q.updated_at,
                comments=[
                    AnswerResponse(
                        id=a.id,
                        question_id=a.question_id,
                        user_id=a.user_id,
                        content=a.content,
                        answer_nickname=a.user_answer.nickname,
                        created_at=a.created_at,
                        updated_at=a.updated_at
                    )
                    for a in q.answer_question
                ]
            )
        )

    return results

@router.post("/{book_id}/questions")
def create_question(data: QuestionCreate, book_id: int, user_info: str = Cookie(None), db: Session=Depends(get_db)):
    """ 질문 생성 """
    check_book(book_id, db) # user_info -> user_id, nickname

    if not user_info:
        user_info = {"user_id": 1, "nickname": "홍길동"}
    else:
        try:
            user_info = loads(user_info)
        except JSONDecodeError:
            raise HTTPException(status_code=401, detail="유저 정보가 잘못되었습니다.")

    user = db.query(User).filter(User.id == user_info["user_id"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당되는 유저가 없습니다.")

    question = Question(
        user_id=int(user_info["user_id"]),
        book_id=book_id,
        title=data.title,
        content=data.content
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return Response(status_code=201)

@router.patch("/{book_id}/questions/{question_id}")
def update_question(data: QuestionUpdate, book_id: int, question_id: int, db: Session=Depends(get_db)):
    """ 질문 업데이트 """
    check_book(book_id, db)

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        raise HTTPException(status_code=404, detail="질문을 찾을 수 없습니다.")

    question.content = data.content

    db.commit()
    db.refresh(question)

    return Response(status_code=204)

@router.delete("/{book_id}/questions/{question_id}")
def delete_question(book_id: int, question_id: int, db: Session=Depends(get_db)):
    """ 질문 삭제 """
    check_book(book_id, db)

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        raise HTTPException(status_code=404, detail="질문을 찾을 수 없습니다.")

    db.delete(question)
    db.commit()

    return Response(status_code=204)

@router.post("/{book_id}/questions/{question_id}/answers")
def create_answer(data: AnswerCreate, book_id: int, question_id: int, user_info: str = Cookie(None), db: Session=Depends(get_db)):
    """ 답변 생성 """
    check_book(book_id, db)

    if not user_info:
        user_info = {"user_id": 1, "nickname": "홍길동"}
    else:
        try:
            user_info = loads(user_info)
        except JSONDecodeError:
            raise HTTPException(status_code=401, detail="유저 정보가 잘못되었습니다.")

    user = db.query(User).filter(User.id == user_info["user_id"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="해당되는 유저가 없습니다.")

    answer = Answer(
        user_id=int(user_info["user_id"]),
        question_id=question_id,
        content=data.content
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    return Response(status_code=201)

@router.patch("/{book_id}/questions/{question_id}/answers/{answer_id}")
def update_answer(data: AnswerUpdate, book_id: int, question_id: int, answer_id: int, db: Session=Depends(get_db)):
    """ 답변 업데이트 """
    check_book(book_id, db)

    answer = db.query(Answer).filter(Answer.id == answer_id, Answer.question_id == question_id).first()

    if not answer:
        raise HTTPException(status_code=404, detail="답변을 찾을 수 없습니다.")

    answer.content = data.content

    db.commit()
    db.refresh(answer)

    return Response(status_code=204)

@router.delete("/{book_id}/questions/{question_id}/answers/{answer_id}")
def delete_answer(book_id: int, question_id: int, answer_id: int, db: Session=Depends(get_db)):
    """ 답변 삭제 """
    check_book(book_id, db)

    answer = db.query(Answer).filter(Answer.id == answer_id, Answer.question_id == question_id).first()

    if not answer:
        raise HTTPException(status_code=404, detail="답변을 찾을 수 없습니다.")

    db.delete(answer)
    db.commit()

    return Response(status_code=204)