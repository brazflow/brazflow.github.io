import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

import QuickRunPage from './pages/QuickRunPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <div className="app-container">
      <nav style={{ padding: 10 }}>
        <Link to="/">Quick Run</Link> | <Link to="/upload">Upload</Link>
      </nav>
      <main style={{ padding: 16 }}>
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
