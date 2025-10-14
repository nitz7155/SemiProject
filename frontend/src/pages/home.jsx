import { useState, useRef, useEffect } from 'react'
import {Link} from 'react-router-dom'
import '../App.css'


function Home() {
    // 가상데이터
    const MOCK_BOOKS = [
    { isbn13: "9788998139766", title: "리액트를 다루는 기술", authors: "김민준", publisher: "길벗", contents: "리액트 핵심을 다루는 실전 가이드." },
    { isbn13: "9791162243077", title: "클린 아키텍처", authors: "로버트 C. 마틴", publisher: "인사이트", contents: "소프트웨어 설계의 원칙과 구조." },
    { isbn13: "9791161753676", title: "파이썬 알고리즘 인터뷰", authors: "박상길", publisher: "책만", contents: "코딩 인터뷰를 위한 파이썬 알고리즘." },
    { isbn13: "9788966263158", title: "밑바닥부터 시작하는 딥러닝", authors: "사이토 고키", publisher: "한빛미디어", contents: "NumPy로 구현하는 딥러닝 기초." },
    { isbn13: "9791158392239", title: "Do it! 점프 투 파이썬", authors: "박응용", publisher: "이지스퍼블리싱", contents: "왕초보를 위한 파이썬 입문." },
    { isbn13: "9788966262281", title: "혼자 공부하는 자바", authors: "신용권", publisher: "한빛미디어", contents: "기초부터 객체지향까지 자바 학습." },
    { isbn13: "9791161753881", title: "모두의 딥러닝", authors: "김성훈", publisher: "길벗", contents: "딥러닝 기본 개념 정리." },
    { isbn13: "9788966260959", title: "스프링 입문을 위한 자바 객체 지향", authors: "최범균", publisher: "한빛미디어", contents: "객체지향 핵심과 스프링 입문." },
    { isbn13: "9788931466062", title: "컴퓨터 네트워킹 하향식 접근", authors: "Kurose, Ross", publisher: "피어슨", contents: "네트워크 전반을 하향식으로 설명." },
    { isbn13: "9791186697561", title: "모던 자바스크립트 Deep Dive", authors: "이웅모", publisher: "위키북스", contents: "JS 핵심을 깊게 파는 안내서." }
    ];

    const [text, setText] = useState('')

    return (
        <main className="container">
            {/* 검색 창 */}
            <section className="search-area" aria-label="검색">
                <div className="search-row">
                    <input className="input" aria-label="도서 검색" value={text} onChange={(e)=>setText(e.target.text)} placeholder='도서 제목 또는 저자 검색'/>
                    <button >검색</button>
                </div>
            </section>
            {/* 검색 결과 페이지 */}
            <section className="grid" aria-live="polite">
                <Link className="card" to={'/books'}>
                    <div className="title">제목</div>
                    <div className="meta">
                        <span>저자</span>
                        <span className="badge">출판사</span>
                    </div>
                </Link>
            </section>
        </main>
    )
}

export default Home