import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Router>

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <ScrollToTop />
    </Router>
  )
}

export default App
