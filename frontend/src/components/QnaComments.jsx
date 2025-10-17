const QnaComments = ({ comments }) => {
    return (
        <div style={{'width': '95%', 'marginLeft': 'auto'}}>
            {comments.map((comment) => (
                <div key={comment.id} style={{'border': '1px solid black'}}>
                    <div>{comment.answerer}<span>  🕒{comment.created_at}</span></div>
                    <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                        <p>{comment.comment}</p>
                        <div>삭제하기</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QnaComments;