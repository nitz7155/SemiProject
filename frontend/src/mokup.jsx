import React, { useEffect, useMemo, useRef, useState } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

/**
 * BookShare Mockup (React) – v1 (초급자용 프론트 목업)
 * - 검색 입력은 "메인 상단"에 위치합니다.
 * - 데이터는 로컬 목업 배열을 사용합니다.
 * - 라우트: "/"(Home), "/books/:isbn13"(상세)
 * - 리뷰는 로컬 상태로만 동작(새로고침 시 초기화)
 */

// ---- Mock Data ------------------------------------------------------------
const MOCK_BOOKS = [
  { isbn13: "9788998139766", title: "리액트를 다루는 기술", authors: "김민준", publisher: "길벗", datetime: "2019-11-20", thumbnail: "", contents: "리액트 핵심을 다루는 실전 가이드." },
  { isbn13: "9791162243077", title: "클린 아키텍처", authors: "로버트 C. 마틴", publisher: "인사이트", datetime: "2019-01-10", thumbnail: "", contents: "소프트웨어 설계의 원칙과 구조." },
  { isbn13: "9791161753676", title: "파이썬 알고리즘 인터뷰", authors: "박상길", publisher: "책만", datetime: "2020-08-05", thumbnail: "", contents: "코딩 인터뷰를 위한 파이썬 알고리즘." },
  { isbn13: "9791162540649", title: "이펙티브 타입스크립트", authors: "댄 밴더캄", publisher: "인사이트", datetime: "2020-01-15", thumbnail: "", contents: "타입스크립트를 더 잘 쓰는 62가지 방법." },
  { isbn13: "9788966263158", title: "밑바닥부터 시작하는 딥러닝", authors: "사이토 고키", publisher: "한빛미디어", datetime: "2017-01-01", thumbnail: "", contents: "NumPy로 구현하는 딥러닝 기초." },
  { isbn13: "9791158392239", title: "Do it! 점프 투 파이썬", authors: "박응용", publisher: "이지스퍼블리싱", datetime: "2019-06-01", thumbnail: "", contents: "왕초보를 위한 파이썬 입문." },
  { isbn13: "9788966262281", title: "혼자 공부하는 자바", authors: "신용권", publisher: "한빛미디어", datetime: "2020-06-01", thumbnail: "", contents: "기초부터 객체지향까지 자바 학습." },
  { isbn13: "9791161753881", title: "모두의 딥러닝", authors: "김성훈", publisher: "길벗", datetime: "2020-02-20", thumbnail: "", contents: "텐서플로로 배우는 딥러닝 기본." },
  { isbn13: "9788966260959", title: "스프링 입문을 위한 자바 객체 지향", authors: "최범균", publisher: "한빛미디어", datetime: "2016-03-01", thumbnail: "", contents: "객체지향 핵심과 스프링 입문." },
  { isbn13: "9788931466062", title: "컴퓨터 네트워킹 하향식 접근", authors: "Kurose, Ross", publisher: "피어슨", datetime: "2013-04-15", thumbnail: "", contents: "네트워크 전반을 하향식으로 설명." }
];

// ---- UI Helpers ----------------------------------------------------------
function Star({ n = 0 }) {
  return <span className="select-none">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function EmptyThumb() {
  return (
    <div className="w-full aspect-[3/4] bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400">
      No Image
    </div>
  );
}

// ---- Pages ---------------------------------------------------------------
function Home() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return MOCK_BOOKS;
    return MOCK_BOOKS.filter(
      (b) => b.title.toLowerCase().includes(kw) || b.authors.toLowerCase().includes(kw)
    );
  }, [q]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [q]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      {/* 메인 상단 검색바 */}
      <section className="mb-6">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="도서 제목 또는 저자 검색"
            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            className="px-4 py-3 rounded-xl border bg-white hover:bg-gray-50 active:scale-[0.99]"
            onClick={() => null}
            title="검색"
          >검색</button>
        </div>
        <p className="text-gray-500 text-sm mt-2">예) 리액트, 파이썬, 클린 아키텍처</p>
      </section>

      {/* 검색 결과 */}
      <section>
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-16">검색 결과가 없습니다. 키워드를 변경해 보세요.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paged.map((b) => (
                <Link key={b.isbn13} to={`/books/${b.isbn13}`} className="group block">
                  <article className="bg-white border rounded-2xl p-3 hover:shadow-md transition shadow-sm h-full flex flex-col">
                    <EmptyThumb />
                    <h3 className="mt-3 font-semibold line-clamp-2 group-hover:underline">{b.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{b.authors}</p>
                    <p className="text-xs text-gray-400 mt-auto">{b.publisher}</p>
                  </article>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >이전</button>
              <span className="text-sm text-gray-600">{page} / {Math.max(1, Math.ceil(filtered.length / pageSize))}</span>
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                disabled={page * pageSize >= filtered.length}
                onClick={() => setPage((p) => p + 1)}
              >다음</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function BookDetail() {
  const { isbn13 } = useParams();
  const navigate = useNavigate();
  const book = useMemo(
    () => MOCK_BOOKS.find((b) => b.isbn13 === isbn13) || MOCK_BOOKS[0],
    [isbn13]
  );

  // 리뷰(로컬 상태)
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }, [reviews]);

  function addReview() {
    if (!content.trim()) {
      inputRef.current?.focus();
      return;
    }
    const item = { id: Date.now(), rating, content: content.trim() };
    setReviews((prev) => [item, ...prev]);
    setContent("");
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6">
      <button className="mb-4 text-sm text-gray-500 hover:underline" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <EmptyThumb />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600 mt-1">{book.authors} · {book.publisher}</p>
          <p className="text-gray-400 text-sm mt-1">ISBN: {book.isbn13} · 출간일: {book.datetime}</p>
          <p className="mt-4 leading-relaxed text-gray-700">{book.contents}</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">평균 별점</span>
            <Star n={Math.round(avg)} />
            <span className="text-sm text-gray-500">({reviews.length})</span>
          </div>
        </div>
      </section>

      {/* 탭: 리뷰만 활성 */}
      <section className="mt-8">
        <div className="flex gap-2 border-b pb-2">
          <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">리뷰</button>
          <button className="px-3 py-2 rounded-xl text-sm text-gray-400" title="QnA는 최종 버전에 추가 예정" disabled>QnA</button>
        </div>

        {/* Review Form */}
        <div className="mt-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full md:w-auto"
          >
            {[5,4,3,2,1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰를 남겨주세요 (최대 200자)"
            maxLength={200}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button onClick={addReview} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">등록</button>
        </div>

        {/* Review List */}
        <ul className="mt-4 space-y-2">
          {reviews.length === 0 && (
            <li className="text-gray-500 text-sm">아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="border rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Star n={r.rating} />
                <span className="text-sm text-gray-500">방금 전</span>
              </div>
              <p className="mt-1 text-gray-800">{r.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// ---- Shell (Header/Footer) ----------------------------------------------
function Shell() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-tight">BookShare</Link>
          <nav className="text-sm text-gray-500">{/* 최소 메뉴 자리 */}</nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books/:isbn13" element={<BookDetail/>} />
      </Routes>

      <footer className="mt-10 border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} BookShare Mockup
        </div>
      </footer>
    </div>
  );
}

export default function App(){
  return (
    <HashRouter>
      <Shell/>
    </HashRouter>
  );
}
