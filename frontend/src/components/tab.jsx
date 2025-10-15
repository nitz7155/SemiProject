import '../App.css'

function Tab({setFlag}) {

    return (
        <div className="flex gap-2 border-b pb-2">
          <button 
          className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm"
          onClick={()=>setFlag(false)}>리뷰</button>
          <button 
          className="px-3 py-2 rounded-xl text-sm text-gray-400"
          onClick={()=>setFlag(true)}>QnA</button>
        </div>
    )
}

export default Tab