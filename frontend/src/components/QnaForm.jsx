import { useState, useEffect, useRef } from "react";
import QnaList from "./QnaList.jsx";

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
    const nameRef = useRef(null);
    const contentRef = useRef(null);
    const [qnaList, setQnaList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [increment, setIncrement] = useState(0);

    useEffect(() => {
        nameRef.current.focus()
    }, []);

    const handleInputKeyDown = (e, currentRef) => {
        if (e.key === 'Enter' && currentRef === nameRef) {
            e.preventDefault();
            contentRef.current.focus();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const data = {
            "id": increment,
            "user_id": user_id,
            "question_nickname": user_nickname,
            "book_id": book_id,
            "title": title,
            "content": content,
            "comments": [], // 조인해서 값 들어감
            "created_at": `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`,
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
                       ref={nameRef}
                       value={title}
                       type="text"
                       placeholder="제목을 입력하세요"
                       onChange={(e) => setTitle(e.target.value)}
                       onKeyDown={(e) => handleInputKeyDown(e, nameRef)}/>
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