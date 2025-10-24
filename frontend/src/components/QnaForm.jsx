import { useState, useEffect, useRef } from "react";
import QnaList from "./QnaList.jsx";

const QnaForm = ({ bookId }) => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const [qnaList, setQnaList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [reload, setReload] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        titleRef.current.focus();
        (async () => {
            try {
                const res = await fetch(`http://localhost:8000/books/${bookId}/questions`);

                if (res.status === 404) {
                    setQnaList([])
                } else if (!res.ok) {
                    throw new Error(`${res.status}`);
                } else {
                    const result = await res.json();
                    setQnaList(result);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [bookId, reload]);

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            contentRef.current.focus();
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            "title": title,
            "content": content,
        };

        setTitle('');
        setContent('');

        try {
            const res = await fetch(`http://localhost:8000/books/${bookId}/questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (res.status === 404) {
                setQnaList([])
            } else if (!res.ok) {
                throw new Error(`${res.status}`);
            } else {
                setReload(prev => !prev);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>도서 Q&A</h1>
            <form onSubmit={handleFormSubmit}>
                <p>질문 제목</p>
                <input
                    required
                    disabled={isSubmitting}
                    ref={titleRef}
                    value={title}
                    type="text"
                    placeholder="제목을 입력하세요"
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(e)}
                />
                <p>질문 내용</p>
                <textarea
                    required
                    disabled={isSubmitting}
                    style={{ 'resize': 'none' }}
                    ref={contentRef}
                    value={content}
                    rows="5" cols="50"
                    placeholder="궁금한 점을 질문해주세요"
                    onChange={(e) => setContent(e.target.value)}
                />
                <br />
                <button type="submit">질문 등록</button>
            </form>
            <QnaList qnaList={qnaList} setReload={setReload} bookId={bookId}/>
        </div>
    );
};

export default QnaForm;