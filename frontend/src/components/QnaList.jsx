import { useState, useRef } from "react";
import QnaComments from "./QnaComments.jsx";

const QnaList = ({ qnaList, setQnaList }) => {
    const [answerer, setAnswerer] = useState('');
    const [comment, setComment] = useState('');
    const [activeId, setActiveId] = useState(null);
    const nameRef = useRef(null);
    const contentRef = useRef(null);
    const [increment, setIncrement] = useState(0);

    const handleInputKeyDown = (e, currentRef) => {
        if (e.key === 'Enter' && currentRef === nameRef) {
            e.preventDefault();
            contentRef.current.focus();
        }
    };

    const toggleActiveId = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const handleDivClick = (id) => {
        toggleActiveId(id);
    };

    const handleFormSubmit = (e, id) => {
        e.preventDefault();
        toggleActiveId(id);

        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, "0");
        const date = String(new Date().getDate()).padStart(2, "0");
        const data = {
            "id": increment,
            "asker_id": id,
            "answerer": answerer,
            "comment": comment,
            "created_at": `${year}-${month}-${date}`
        }

        setIncrement((prev) => prev + 1);
        setAnswerer('');
        setComment('');
        setQnaList((prev) => prev.map((qna) =>
            qna.id === id
            ? { ...qna, comments: [...(qna.comments || []), data] }
            : qna
        ))
    };

    return (
        <div>
            <h1>질문 목록 ({qnaList.length})</h1>
            {qnaList.map((qna) => (
                <div key={qna.id}>
                    <div style={{'border': '1px solid black'}}>
                        <div>{qna.asker}<span>  🕒{qna.created_at}</span></div>
                        <p style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                            {qna.content}
                            <div style={{'display': 'flex', 'gap': '20px'}}>
                                <div onClick={() => handleDivClick(qna.id)}>답변하기</div>
                                <div>삭제하기</div>
                            </div>
                        </p>
                    </div>
                    <QnaComments comments={qna.comments}/>
                    {activeId === qna.id && (
                        <form onSubmit={(e) => handleFormSubmit(e, qna.id)}>
                            <p>답변자 이름</p>
                            <input ref={nameRef}
                                   value={answerer}
                                   type="text"
                                   placeholder="답변자 이름"
                                   onChange={(e) => setAnswerer(e.target.value)}
                                   onKeyDown={handleInputKeyDown}/>
                            <p>답변 내용</p>
                            <textarea ref={contentRef}
                                      value={comment}
                                      rows="5" cols="50"
                                      placeholder="댓글을 입력하세요"
                                      onChange={(e) => setComment(e.target.value)}/>
                            <br/>
                            <button type="submit">댓글 등록</button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
};

export default QnaList;