import { Routes, Route } from 'react-router-dom'
import './App.css'

import QuickRunPage from './pages/QuickRunPage'
import ResultsPage from './pages/ResultsPage'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="app-container">
      <div className="app-body">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<QuickRunPage />} />
            <Route path="/results/:taskId" element={<ResultsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App