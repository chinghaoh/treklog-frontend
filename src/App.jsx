import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Countries from './pages/Countries'
import MyCountries from './pages/MyCountries'
import CountryDetail from './pages/CountryDetail'
import Dashboard from './pages/Dashboard'
import WorldMap from './pages/WorldMap'

function App() {
  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/my-countries" element={<MyCountries />} />
          <Route path="/my-countries/:id" element={<CountryDetail />} />
          <Route path="/map" element={<WorldMap />} />
        </Routes>
      </main>
    </div>
  )
}

export default App