import { useState, useRef } from 'react'
import '../App.css'
import ReviewList from './reviewlist'

function ReviewForm() {
    const [content, setContent] = useState('')
    const [rate, setRate] = useState(5)
    const [review, setReview] = useState([])
    const [id, setID] = useState(1)
    const [name, setName] = useState('')

    const inputRef = useRef(0)

    const addReview = (e) => {
        e.preventDefault();
        if (content.trim()) {
            setReview([...review, {"id" : id, "name" : name, "content" : content, "rate" : rate}]);
            setID(id+1);
        }
        setContent('');
        setRate(5);
        setName('');
        inputRef.current.focus()
    }

    return (
        <section>
            <form onSubmit={addReview}>
                <select
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}>
                    {[5,4,3,2,1].map((n) => (
                    <option key={n} value={n}>{"★".repeat(n)}</option>
                    ))}
                </select>
                <input ref={inputRef}
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    placeholder='이름'
                    maxLength={30}/>
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="리뷰를 남겨주세요 (최대 200자)"
                    maxLength={200}
                />
                <button type="submit">등록</button>
            </form>
            <ReviewList review={review}/>
        </section>
    )
}        
        
export default ReviewForm
        