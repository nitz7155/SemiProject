import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import Home from './pages/home'
import BookDetail from './pages/booksdetail'


function App() {
  
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/books/:id' element={<BookDetail/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
