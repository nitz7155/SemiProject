import { useState, useEffect, useRef } from "react";
import QnaList from "./QnaList.jsx";

const QnaForm = () => {
    const nameRef = useRef(null);
    const contentRef = useRef(null);
    const [qnaList, setQnaList] = useState([]);
    const [asker, setAsker] = useState('');
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

        if (!asker) {
            return alert('이름을 입력하세요')
        } else if (!content) {
            return alert('내용을 입력하세요')
        }

        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, "0");
        const date = String(new Date().getDate()).padStart(2, "0");
        const data = {
            "id": increment,
            "asker": asker,
            "content": content,
            "comments": [],
            "created_at": `${year}-${month}-${date}`
        };

        setIncrement((prev) => prev + 1);
        setAsker('');
g        setContent('');
        setQnaList((prev) => [
            ...prev,
            data
        ]);
    };

    return (
        <div>
            <h1>도서 Q&A</h1>
            <form onSubmit={handleFormSubmit}>
                <p>이름</p>
                <input ref={nameRef}
                       value={asker}
                       type="text"
                       placeholder="이름을 입력하세요"
                       onChange={(e) => setAsker(e.target.value)}
                       onKeyDown={(e) => handleInputKeyDown(e, nameRef)}/>
                <p>질문 내용</p>
                <textarea ref={contentRef}
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