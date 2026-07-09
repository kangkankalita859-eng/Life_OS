import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Timeline from './pages/Timeline'
import MemoryCapture from './pages/MemoryCapture'
import EmotionExplorer from './pages/EmotionExplorer'
import LifeCategories from './pages/LifeCategories'
import Search from './pages/Search'
import Statistics from './pages/Statistics'
import TimeCapsules from './pages/TimeCapsules'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Navigation from './components/layout/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/capture" element={<MemoryCapture />} />
          <Route path="/emotions" element={<EmotionExplorer />} />
          <Route path="/categories" element={<LifeCategories />} />
          <Route path="/search" element={<Search />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/timecapsules" element={<TimeCapsules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
