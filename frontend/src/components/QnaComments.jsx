import { useState } from 'react';

const QnaComments = ({ comments, setQnaList }) => {
    const [activeId, setActiveId] = useState(null);
    const [changeComment, setChangeComment] = useState('');

    const toggleId = (id) => {
        setActiveId(prev => (prev === id ? null : id));
    };

    const handleDeleteComment = (id) => {
        setQnaList(prev => prev.map(qna => ({
            ...qna,
            comments: qna.comments.filter(comment => comment.id !== id)
        })));
    };

    const handleEditComment = (id, comment) => {
        if (activeId !== null) {
            setQnaList(prev => prev.map(qna => ({
                ...qna,
                comments: qna.comments.map(comment => (
                    comment.id === id ?
                    { ...comment, "comment": changeComment } :
                    comment
                ))
            })));
            setChangeComment('');
        } else {
             setChangeComment(comment);
        }
        toggleId(id);
    };

    return (
        <div style={{'width': '95%', 'marginLeft': 'auto'}}>
            {comments.map((comment) => (
                <div key={comment.id} style={{'border': '1px solid black'}}>
                    <div>{comment.answer_nickname}<span>  🕒{comment.created_at}</span></div>
                    <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                        {activeId === comment.id ? (
                            <textarea style={{'resize': 'none'}}
                                      required
                                      onChange={(e) => setChangeComment(e.target.value)}
                                      value={changeComment}></textarea>
                        ) : (
                            <div>{comment.comment}</div>
                        )}
                        <div style={{'display': 'flex', 'gap': '20px'}}>
                            <div onClick={() => handleEditComment(comment.id, comment.comment)}>수정하기</div>
                            <div onClick={() => handleDeleteComment(comment.id)}>삭제하기</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QnaComments;