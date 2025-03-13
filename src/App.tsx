import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './Pages/LoginPage.tsx'
import Register from './Pages/RegisterPage.tsx'
import BookPage from './Pages/BookPage.tsx'
import Test from './Pages/HistoryPage.tsx'

function App() {
  return (
    <>
      <BrowserRouter basename="/stayease">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<BookPage />} />
          <Route path="/history" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
