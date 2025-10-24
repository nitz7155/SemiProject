import { useState, useRef, useEffect } from "react";
import QnaComments from "./QnaComments.jsx";

const QnaList = ({ qnaList, setReload, bookId }) => {
    const [content, setContent] = useState('');
    const [activeId, setActiveId] = useState(null);
    const contentRef = useRef(null);
    const editRef = useRef(null);
    const [qnaEdit, setQnaEdit] = useState('');
    const [qnaActiveId, setQnaActiveId] = useState(null);
    const [editActive, setEditActive] = useState({ parentId: null, childId: null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (activeId !== null) {
            contentRef.current.focus();
        }
    }, [activeId]);

    useEffect(() => {
        if (qnaActiveId !== null && editActive.parentId === null) {
            editRef.current.focus();
        }
    }, [qnaActiveId, editActive]);

    const toggleActiveId = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const handleDivClick = (id) => {
        toggleActiveId(id);
    };

    const handleFormSubmit = async (e, question_id) => {
        e.preventDefault();
        toggleActiveId(question_id);
        setIsSubmitting(true);
        const data = {
            "content": content
        };

        try {
            const res = await fetch(`http://localhost:8000/books/${bookId}/questions/${question_id}/answers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`${res.status}`);
            }
            setReload(prev => !prev);
        } catch (e) {
            console.error(e);
        } finally {
            setContent('');
            setIsSubmitting(false);
        }
    };

    const handleDeleteQna = async (question_id) => {
        try {
            setIsSubmitting(true);
            const res = await fetch(`http://localhost:8000/books/${bookId}/questions/${question_id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error(`${res.status}`);
            }
            setReload(prev => !prev);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditQna = async (question_id, content) => {
        if (qnaEdit === content) {
            setQnaEdit('');
            setQnaActiveId(null);
        } else if (question_id === qnaActiveId && editActive.parentId === null) {
            setIsSubmitting(true);

            const data = {
                "content": qnaEdit
            };

            try {
                const res = await fetch(`http://localhost:8000/books/${bookId}/questions/${question_id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    throw new Error(`${res.status}`)
                }
            } catch (e) {
                console.error(e);
            } finally {
                setReload(prev => !prev);
                setIsSubmitting(false);
                setQnaEdit('');
                setQnaActiveId(null);
            }
        } else {
            setQnaEdit(content);
            setQnaActiveId(question_id);
        }
        setEditActive({ parentId: null, childId: null });
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
                            {qnaActiveId === qna.id && editActive.parentId === null ? (
                                <textarea disabled={isSubmitting}
                                          ref={editRef}
                                          style={{'resize': 'none'}}
                                          required
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
                    <QnaComments setQnaActiveId={setQnaActiveId}
                                 comments={qna.comments}
                                 parentId={qna.id}
                                 editActive={editActive}
                                 setEditActive={setEditActive}
                                 setReload={setReload}
                                 bookId={bookId}
                                 questionId={qna.id}/>
                    {activeId === qna.id && (
                        <form onSubmit={(e) => handleFormSubmit(e, qna.id)}>
                            <p>답변자 이름: {qna.question_nickname}</p>
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