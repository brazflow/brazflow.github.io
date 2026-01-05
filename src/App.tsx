import { Routes, Route } from 'react-router-dom'

import QuickRunPage from './pages/QuickRunPage'
import ResultsPage from './pages/ResultsPage'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="font-roboto bg-brazflow-bg text-brazflow-text min-h-screen flex flex-col w-screen">
      <div className="flex flex-col flex-1 h-screen overflow-hidden md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 box-border h-screen overflow-y-auto">
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
