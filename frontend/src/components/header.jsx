import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import '../App.css'

function Header() {
    return (
        <header className="header">
            <div className="header-inner">
            <Link to="/" className="brand">Book&Share</Link>
            <nav style={{fontSize:13}}>Demo</nav>
            </div>
        </header>
    )
}

export default Header