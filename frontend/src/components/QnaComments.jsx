import { useState, useRef, useEffect } from 'react';
import QnaSetDate from './QnaSetDate';

const QnaComments = ({ setQnaActiveId, comments, setQnaList, parentId, editActive, setEditActive }) => {
    const [activeId, setActiveId] = useState(null);
    const [content, setContent] = useState('');
    const contentRef = useRef(null);

    useEffect(() => {
        if (editActive.parentId === parentId && editActive.childId !== null && contentRef.current) {
            contentRef.current.focus();
        }
    }, [editActive, parentId]);

    const handleDeleteComment = (id) => {
        setQnaList(prev => prev.map(qna => ({
            ...qna,
            comments: qna.comments.filter(comment => comment.id !== id)
        })));
    };

    const handleEditComment = (id, comment) => {
        if (comment === content) {
            /* empty */
        } else if (activeId === id) {
            setQnaList(prev => prev.map(qna => ({
                ...qna,
                comments: qna.comments.map(comment => (
                    comment.id === id ?
                    { ...comment, "content": content, "updated_at": QnaSetDate() } :
                    comment
                ))
            })));
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
                                <textarea style={{'resize': 'none'}}
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