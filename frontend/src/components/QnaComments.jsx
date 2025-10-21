import { useState } from 'react';
import QnaSetDate from './QnaSetDate';

const QnaComments = ({ comments, setQnaList, isActive, onActivate }) => {
    const [activeId, setActiveId] = useState(null);
    const [content, setContent] = useState('');

    const toggleId = (id) => {
        console.log("toggle", id);
        setActiveId(prev => (prev === id ? null : id));
    };

    const handleDeleteComment = (id) => {
        setQnaList(prev => prev.map(qna => ({
            ...qna,
            comments: qna.comments.filter(comment => comment.id !== id)
        })));
    };

    const handleEditComment = (id, comment) => {
        onActivate();
        if (activeId !== null && activeId === id) {
            setQnaList(prev => prev.map(qna => ({
                ...qna,
                comments: qna.comments.map(comment => (
                    comment.id === id ?
                    { ...comment, "content": content, "updated_at": QnaSetDate() } :
                    comment
                ))
            })));
            setContent('');
        } else {
            setContent(comment);
        }
        toggleId(id);
    };

    return (
        <div style={{'width': '95%', 'marginLeft': 'auto'}}>
            {comments.map((comment) => (
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
                        {activeId === comment.id ? (
                            <textarea style={{'resize': 'none'}}
                                      required
                                      onChange={(e) =>
                                                setContent(e.target.value)}
                                      value={content}
                            />
                        ) : (
                            <div>{comment.content}</div>
                        )}
                        <div style={{'display': 'flex', 'gap': '20px'}}>
                            {isActive ? (
                                <div>
                                    수정하기
                                </div>
                            ) : (
                                <div onClick={() => handleEditComment(comment.id, comment.content)}>
                                    수정하기
                                </div>
                            )}
                            <div onClick={() => handleDeleteComment(comment.id)}>
                                삭제하기
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QnaComments;