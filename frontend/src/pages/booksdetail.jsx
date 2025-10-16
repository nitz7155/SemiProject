import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import Tab from '../components/tab';
import ReviewForm from '../components/reviewform';

function BookDetail(){
    const navigate = useNavigate()
    const [flag, setFlag] = useState(false);

    return (
        <main>
            <button className='back-btn' onClick={()=>navigate(-1)}>목록으로</button>
            
            {/* 상세정보 section */}
            <section className='detail-top'>
            </section>

            {/* 탭 */}
            <Tab flag={flag} setFlag={setFlag}/>
            {/* 탭 누르는 결과에 따라 리뷰 또는 QnA로 이동 */}
            {!flag && <ReviewForm />}
        </main>
    )
}

export default BookDetail