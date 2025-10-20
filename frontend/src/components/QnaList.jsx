import { useState, useRef } from "react";
import QnaComments from "./QnaComments.jsx";

// TODO: 아래 주석 구현
// user_id, nickname은 useEffect에서 비동기처리로 값 가져옴
// useEffect로 nickname을 useState 훅에 세팅함
// useEffect로 ref설정 current.focus()로 댓글 내용 포커스
const user_id = 0;
const nickname = '홍길동';

const QnaList = ({ qnaList, setQnaList }) => {
    const [answerNickname, setAnswerNickname] = useState(nickname);
    const [comment, setComment] = useState('');
    const [activeId, setActiveId] = useState(null);
    const contentRef = useRef(null);
    const [increment, setIncrement] = useState(0);
    const [qnaEdit, setQnaEdit] = useState('');
    const [qnaActiveId, setQnaActiveId] = useState(null);

    const toggleActiveId = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const handleDivClick = (id) => {
        toggleActiveId(id);
    };

    const handleFormSubmit = (e, id) => {
        e.preventDefault();
        toggleActiveId(id);

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
            "answer_nickname": answerNickname,
            "comment": comment,
            "created_at": `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`,
            "updated_at": ''
        }

        setIncrement((prev) => prev + 1);
        setComment('');
        setQnaList((prev) => prev.map((qna) =>
            qna.id === id ? { ...qna, comments: [...qna.comments, data] } : qna
        ))
    };

    const handleDeleteQna = (id) => {
        setQnaList(prev => prev.filter(qna => qna.id !== id));
    };

    const handleEditQna = (id, content) => {
        if (qnaActiveId !== null) {
            setQnaList(prev => prev.map(qna =>
                qna.id === id ?
                { ...qna, "content": qnaEdit } :
                qna
            ));
            setQnaEdit('');
        } else {
            setQnaEdit(content);
        }
        setQnaActiveId(prev => prev !== null ? null : id);
    };

    return (
        <div>
            <h1>질문 목록 ({qnaList.length})</h1>
            {qnaList.map((qna) => (
                <div key={qna.id}>
                    <div style={{'border': '1px solid black'}}>
                        <div>제목: {qna.title}  🕒{qna.created_at} 작성자: {qna.question_nickname}</div>
                        <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                            {qnaActiveId === qna.id ? (
                                <textarea style={{'resize': 'none'}}
                                          value={qnaEdit}
                                          onChange={(e) =>
                                                    setQnaEdit(e.target.value)}/>
                            ) : (
                                qna.content
                            )}
                            <div style={{'display': 'flex', 'gap': '20px'}}>
                                <div onClick={() => handleEditQna(qna.id, qna.content)}>수정하기</div>
                                <div onClick={() => handleDeleteQna(qna.id)}>삭제하기</div>
                                <div onClick={() => handleDivClick(qna.id)}>답변하기</div>
                            </div>
                        </div>
                    </div>
                    <QnaComments comments={qna.comments} setQnaList={setQnaList}/>
                    {activeId === qna.id && (
                        <form onSubmit={(e) => handleFormSubmit(e, qna.id)}>
                            <p>답변자 이름: {answerNickname}</p>
                            <p>답변 내용</p>
                            <textarea style={{'resize': 'none'}}
                                      required
                                      ref={contentRef}
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