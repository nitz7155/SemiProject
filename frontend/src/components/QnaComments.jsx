import { useState, useRef, useEffect } from 'react';

const QnaComments = ({ setQnaActiveId, comments, parentId, editActive, setEditActive, setReload, bookId, questionId }) => {
    const [activeId, setActiveId] = useState(null);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (editActive.parentId === parentId && editActive.childId !== null && contentRef.current) {
            contentRef.current.focus();
        }
    }, [editActive, parentId]);

    const handleDeleteComment = async (answer_id) => {
        try {
            setIsSubmitting(true);
            const res = await fetch(`http://localhost:8000/books/${bookId}/questions/${questionId}/answers/${answer_id}`, {
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

    const handleEditComment = async (answer_id, comment) => {
        if (comment === content) {
            /* empty */
        } else if (activeId === answer_id) {
            setIsSubmitting(true);
            const data = {
                "content": content
            };

            try {
                const res = await fetch(`http://localhost:8000/books/${bookId}/questions/${questionId}/answers/${answer_id}`, {
                    method: "PATCH",
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
                setIsSubmitting(false);
            }
        }
        setContent('');
        setActiveId(null);
        setEditActive({ parentId: null, childId: null });
        setQnaActiveId(null);
    };

    return (
        <div style={{'width': '95%', 'marginLeft': 'auto'}}>
            {comments.map((comment) => {
                const isActive = editActive.parentId === parentId && editActive.childId === comment.id;
                return (
                    <div key={comment.id} style={{'border': '1px solid black'}}>
                        <div>
                            {comment.answer_nickname}
                            {comment.updated_at ? (
                                <span>  수정: {comment.updated_at}</span>
                            ) : (
                                <span>  생성: {comment.created_at}</span>
                            )}
                        </div>
                        <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                            {isActive ? (
                                <textarea disabled={isSubmitting}
                                          style={{'resize': 'none'}}
                                          required
                                          ref={contentRef}
                                          onChange={(e) =>
                                                    setContent(e.target.value)}
                                          value={content}
                                />
                            ) : (
                                <div>{comment.content}</div>
                            )}
                            <div style={{'display': 'flex', 'gap': '20px'}}>
                                {isActive ? (
                                    <div onClick={() => handleEditComment(comment.id, comment.content)}>
                                        수정하기
                                    </div>
                                ) : (
                                    <div onClick={() => {
                                        setEditActive({ parentId: parentId, childId: comment.id });
                                        setContent(comment.content);
                                        setActiveId(comment.id);
                                    }}>
                                        수정하기
                                    </div>
                                )}
                                <div onClick={() => handleDeleteComment(comment.id)}>
                                    삭제하기
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default QnaComments;