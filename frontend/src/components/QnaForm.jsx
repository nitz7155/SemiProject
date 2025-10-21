import { useState, useEffect, useRef } from "react";
import QnaList from "./QnaList.jsx";
import QnaSetDate from './QnaSetDate';

/*
* 임시 테이블 구조
* questions(
*   id PK, user_id FK->users, book_id FK->books, title, content, created_at, updated_at
* )
* answers(
*   id PK, question_id FK->questions, user_id FK->users, comment, created_at, updated_at
* )
* users(
*   id PK, email UNIQUE, password_hash, nickname, created_at
* )
* */

// 임시 유저 아이디
const user_id = 0;
// 임시 유저 닉네임, 조인으로 가져오기
const user_nickname = '홍길동';
// 임시 책 번호
const book_id = 0;

// TODO: props로 book_id 전달 받기
const QnaForm = () => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const [qnaList, setQnaList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [increment, setIncrement] = useState(0);

    useEffect(() => {
        titleRef.current.focus()
    }, []);

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            contentRef.current.focus();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = {
            "id": increment,
            "user_id": user_id,
            "question_nickname": user_nickname,
            "book_id": book_id,
            "title": title,
            "content": content,
            "comments": [],
            "created_at": QnaSetDate(),
            "updated_at": ''
        };

        setIncrement((prev) => prev + 1);
        setTitle('');
        setContent('');
        setQnaList((prev) => [
            ...prev,
            data
        ]);
    };

    return (
        <div>
            <h1>도서 Q&A</h1>
            <form onSubmit={handleFormSubmit}>
                <p>제목</p>
                <input required
                       ref={titleRef}
                       value={title}
                       type="text"
                       placeholder="제목을 입력하세요"
                       onChange={(e) => setTitle(e.target.value)}
                       onKeyDown={(e) => handleInputKeyDown(e)}/>
                <p>질문 내용</p>
                <textarea style={{'resize': 'none'}}
                          required
                          ref={contentRef}
                          value={content}
                          rows="5" cols="50"
                          placeholder="궁금한 점을 질문해주세요"
                          onChange={(e) => setContent(e.target.value)}/>
                <br/>
                <button type="submit">질문 등록</button>
            </form>
            <QnaList qnaList={qnaList} setQnaList={setQnaList}/>
        </div>
    );
};

export default QnaForm;