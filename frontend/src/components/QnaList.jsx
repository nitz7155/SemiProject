import { useState, useRef, useEffect } from "react";
import QnaComments from "./QnaComments.jsx";
import QnaSetDate from './QnaSetDate';

// TODO: 아래 주석 구현
// user_id, nickname은 useEffect에서 비동기처리로 값 가져옴
// useEffect로 nickname을 useState 훅에 세팅함
// useEffect로 ref설정 current.focus()로 댓글 내용 포커스
const user_id = 0;
const nickname = '홍길동';

const QnaList = ({ qnaList, setQnaList }) => {
    const [answerNickname, setAnswerNickname] = useState(nickname);
    const [content, setContent] = useState('');
    const [activeId, setActiveId] = useState(null);
    const contentRef = useRef(null);
    const [increment, setIncrement] = useState(0);
    const [qnaEdit, setQnaEdit] = useState('');
    const [qnaActiveId, setQnaActiveId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleActiveId = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const handleDivClick = (id) => {
        toggleActiveId(id);
    };

    const handleFormSubmit = (e, id) => {
        e.preventDefault();
        toggleActiveId(id);

        const data = {
            "id": increment,
            "question_id": id,
            "user_id": user_id,
            "answer_nickname": answerNickname,
            "content": content,
            "created_at": QnaSetDate(),
            "updated_at": ''
        }

        setIncrement((prev) => prev + 1);
        setContent('');
        setQnaList((prev) => prev.map((qna) =>
            qna.id === id ? { ...qna, comments: [...qna.comments, data] } : qna
        ))
    };

    const handleDeleteQna = (id) => {
        setQnaList(prev => prev.filter(qna => qna.id !== id));
    };

    const handleEditQna = (id, content) => {
        if (qnaActiveId !== null && id === qnaActiveId) {
            setQnaList(prev => prev.map(qna =>
                qna.id === id ?
                { ...qna, "content": qnaEdit, "updated_at": QnaSetDate()} :
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
                        <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                            <div>
                                제목: {qna.title}
                            </div>
                            <div>
                                {qna.question_nickname}
                                {qna.updated_at ? (
                                    <span>  {qna.updated_at}(수정됨)</span>
                                ) : (
                                    <span>  {qna.created_at}</span>
                                )}
                            </div>
                        </div>
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
                    <QnaComments comments={qna.comments}
                                 setQnaList={setQnaList}
                                 isActive={activeIndex === qna.id}
                                 onActivate={() => setActiveIndex(qna.id)}/>
                    {activeId === qna.id && (
                        <form onSubmit={(e) => handleFormSubmit(e, qna.id)}>
                            <p>답변자 이름: {answerNickname}</p>
                            <p>답변 내용</p>
                            <textarea style={{'resize': 'none'}}
                                      required
                                      ref={contentRef}
                                      value={content}
                                      rows="5" cols="50"
                                      placeholder="댓글을 입력하세요"
                                      onChange={(e) => setContent(e.target.value)}/>
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