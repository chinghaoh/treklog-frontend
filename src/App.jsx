import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Countries from './pages/Countries'
import MyCountries from './pages/MyCountries'
import CountryDetail from './pages/CountryDetail'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/my-countries" element={<MyCountries />} />
          <Route path="/my-countries/:id" element={<CountryDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App