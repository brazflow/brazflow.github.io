import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

import QuickRunPage from './pages/QuickRunPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="app-container">
      <nav className="header">
        <Link to="/">Quick Run</Link> | <Link to="/upload">Upload</Link>
      </nav>
      <Sidebar />
      <main style={{ marginLeft: 300 }}>
        <Routes>
          <Route path="/" element={<QuickRunPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:runId" element={<ResultsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
