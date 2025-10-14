import {Link, useNavigate} from 'react-router-dom'

function BookDetail(){
    const navigate = useNavigate()

    return (
        <main>
            <button className='back-btn' onClick={()=>navigate(-1)}>목록으로</button>
            
            {/* 상세정보 section */}
            <section className='detail-top'>
            </section>

            {/* 탭 */}
            <div className="tabs" role="tablist" aria-label="상세 탭">
                <button className='tab' role="tab">리뷰</button>
                <button className='tab' role="tab">QnA</button>
            </div>

        </main>
    )
}

export default BookDetail