import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import SearchResultList from '../components/SearchResultList';


export default function Home() {
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

    const [ text, setText ] = useState('');
    const [ results, setResults ] = useState([]);
    const [ history, setHistory ] = useState(() => {
        try {
            const raw = localStorage.getItem('search_history');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('search_history', JSON.stringify(history));
        } catch { /* ignore */}
    }, [history]);

    function handleChange(e) {
        setText(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') doSearch();
    }

    function doSearch() {
        const q = text.trim().toLowerCase();
        if (!q) {
            setResults([]);
            return;
        }

        const found = MOCK_BOOKS.filter(book =>
            book.title.toLowerCase().includes(q) ||
            book.authors.toLowerCase().includes(q)
        );
        setResults(found)

        const entry = {
            id: Date.now(),
            query: text,
            count: found.length,
            sample: found[0] || null,
            time: new Date().toISOString()
        };
        setHistory(prev => [entry, ...prev].slice(0, 20));
    }

    function clearHistory() {
        setHistory([]);
    }

    return (
        <main className="container">
            {/* 검색 창 */}
            <section className="search-area" aria-label="검색">
                <div className="search-row">
                    <input
                        className="input"
                        aria-label="도서 검색"
                        value={text}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        placeholder='도서 제목 또는 저자 검색'
                    />
                    <button
                        onClick={doSearch}
                    >
                        검색
                    </button>
                </div>
            </section>
            {/* 검색 이력 및 버튼 */}
            <div style={{ marginBottom: 12 }}>
                <strong>검색 이력</strong>
                <button
                    onClick={clearHistory}
                    style={{ marginLeft: 8 }}
                >
                    이력 삭제
                </button>
            </div>
            <section className="grid" aria-live="polite">
                
                {/* h == history */}
                {/* 검색 이력 */}
                {Array.isArray(history) && history.length > 0 ? (
                    history.map(h => (
                        <Link
                            key={String(h.id || h.query)}
                            className="card"
                            to={`/books/${h.id}`}
                        >
                            <div className="title">{String(h.query || '')}</div>
                            <div className="meta">
                                <span>{h.sample && h.sample.title ? h.sample.title: `${h.count}건`}</span>
                                {/* <span className="badge">{h.sample ? h.sample.authors: '저자 없음'}</span>
                                <span className="badge">{h.sample ? h.sample.publisher: '출판사'}</span> */}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="empty">검색 이력이 없습니다.</div>
                )}

            </section>

            <hr style={{ width: '100%' }} />
            
            <div style={{ margin: 12 }} >
                <strong>검색결과</strong>
            </div>
            
            <section className="grid" aria-live="polite">
                <SearchResultList results={results} />
            </section>
            
        </main>
    );
}