import {useState} from 'react'
import '../App.css'

function ContentExpander({content, maxlength=20}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const expandContent = isExpanded ? content : 
                        (content.trim().length >= maxlength ? content.slice(0, maxlength)+'...' : content)
    
    return (
            <p className="mt-1 text-gray-800"
            onClick={()=>setIsExpanded(!isExpanded)}>{expandContent}</p>
    )
}

function ReviewList({review}) {   
    
    return (
        <ul className="mt-4 space-y-2">
          {review.length === 0 && (
            <li className="text-gray-500 text-sm">아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</li>
          )}
          {review.map((r) => (
            <li key={r.id} className="border rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span>{"★".repeat(r.rate)} /</span>
                <span>{r.name} /</span>
                <span className="text-sm text-gray-500">방금 전</span>
              </div>
              {/* <p className="mt-1 text-gray-800">{r.content}</p> */}
              <ContentExpander content={r.content}/>
            </li>
          ))}
        </ul>
    )
}

export default ReviewList
        
        