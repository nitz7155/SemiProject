import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

export default function SearchResultList({ results }) {
    if (!results || results.length === 0) {
        return <div style={{ padding: 12 }}>검색 결과가 없습니다.</div>
    }

    return (
        <div>
            {results.map(book => (
                <Link
                    key={book.isbn13}
                    to={`/book/${book.isbn13}`}
                    className="card"
                    style={{ margin: 10 }}
                >
                    <div className="title">{book.title}</div>
                    <div className="meta">
                        <span>{book.contents}</span>
                        <span className="badge">{book.authors}</span>
                        <span className="badge">{book.publisher}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}