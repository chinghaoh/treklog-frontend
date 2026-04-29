import { theme } from '../theme'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect } from 'react'
import client from '../api/client'
import AddCountryModal from './modal/AddCountryModal'
import { useNavigate } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'


function Dashboard() {

  const navigate = useNavigate()

  const [stats, setStats] = useState({
    visited: 0,
    want_to_visit: 0,
    total_items: 0,
    items_done: 0,
  })

  const [countries, setCountries] = useState([])

  const [recentItems, setRecentItems] = useState([])

  const [showAddCountry, setShowAddCountry] = useState(false)

  

  useEffect(() => {
    client.get('/my-countries/stats/')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
  
    client.get('/my-countries/')
      .then(res => setCountries(res.data))
      .catch(err => console.error(err))

    client.get('/items/')
      .then(res => setRecentItems(Array.isArray(res.data) ? res.data : res.data.results ?? []))
      .catch(err => console.error(err))
  }, [])

  const statusMap = {
    visited: 'visited',
    want_to_visit: 'wantToVisit',
    living_there: 'livingThere',
  }

  const statCards = [
    { label: 'Countries visited', value: stats.visited, tag: 'Visited', color: theme.tw.textMuted },
    { label: 'Want to visit', value: stats.want_to_visit, tag: 'Bucket list', color: theme.tw.textMuted },
    { label: 'Total items logged', value: stats.total_items, tag: 'Landmarks & food', color: theme.tw.textMuted },
    { label: 'Items done', value: stats.items_done, tag: `${stats.total_items ? Math.round((stats.items_done / stats.total_items) * 100) : 0}% complete`, color: theme.tw.statDone },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>Dashboard</h1>
          <p className={`text-sm ${theme.tw.textMuted} mt-0.5`}>Your travel overview</p>
        </div>
        <button onClick={() => setShowAddCountry(true)}
          className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
          + Add country
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {statCards.map((s) => (
          <div key={s.label} className={`${theme.tw.surface} ${theme.tw.border} rounded-lg p-2.5`}>
            <p className={`text-sm font-medium ${theme.tw.textMain} mb-1`}>{s.label}</p>
            <p className={`text-lg  ${theme.tw.textMain} mb-1`}>{s.value}</p>
            <p className={`text-xs ${s.color} mb-1`}>{s.tag}</p>
          </div>
        ))}
      </div>

      {/* World map */}
      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3`}>
        <p className={`text-sm font-medium ${theme.tw.textMain} mb-2`}>World map</p>
        <div className="rounded-lg overflow-hidden" style={{ height: '240px', backgroundColor: theme.colors.map.background, zIndex: 0, position: 'relative' }}>
        <MapContainer
          center={[54, 15]}
          zoom={3}
          minZoom={2}
          maxZoom={6}
          scrollWheelZoom={true}
          zoomControl={false}
          worldCopyJump={false}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              noWrap={true}
            />
          </MapContainer>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMain}`}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.visited }}></span>Visited
          </span>
          <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMain}`}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.wantToVisit }}></span>Want to visit
          </span>
          <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMain}`}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.livingThere }}></span>Living there
          </span>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-2 gap-2">

        {/* My countries */}
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3`}>
          <p className={`text-sm font-medium ${theme.tw.textMain} mb-2`}>My countries</p>
          <div className="flex flex-col gap-1.5">
          {countries.slice(0, 5).map((c) => (
              <div 
              key={c.id} 
              onClick={() => navigate(`/my-countries/${c.id}/overview`)}
              style={{ cursor: 'pointer' }}
              className={`flex items-center justify-between ${theme.tw.cardHover}`}>
              <div className="flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/24x18/${c.country.iso_code.toLowerCase()}.png`}
                  alt={c.country.name}
                  className="rounded-sm"
                />
                <span className={`text-sm ${theme.tw.textMain}`}>{c.country.name}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md"
                style={{
                  background: theme.colors.status[statusMap[c.status]].bg,
                  color: theme.colors.status[statusMap[c.status]].text,
                }}>
                {c.status === 'visited' ? 'Visited' : c.status === 'want_to_visit' ? 'Want to visit' : 'Living there'}
              </span>
            </div>
            ))}
            <p 
            onClick={() => navigate('/my-countries')}
            className={`text-xs ${theme.tw.textMuted} pt-1 cursor-pointer`}>View all →</p>
          </div>
        </div>

        {/* Recent items */}
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3`}>
          <p className={`text-sm font-medium ${theme.tw.textMain} mb-2`}>Recent items</p>
          <div className="flex flex-col gap-1.5">
          {recentItems.slice(0, 5).map((item) => (
              <div 
              key={item.id}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/my-countries/${item.country_entry_id}/items`)}
              className={`flex items-center gap-2 ${theme.tw.cardHover}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.is_done ? theme.tw.dotDone : theme.tw.dotPending}`}></span>
              <span className={`text-sm flex-1 ${theme.tw.textMain}`}>{item.name}</span>
              <span className={`text-xs ${theme.tw.textMuted}`}>{item.category}</span>
            </div>
            ))}
            <p 
            onClick={() => navigate('/my-items')}
            className={`text-xs ${theme.tw.textMuted} pt-1 cursor-pointer`}>View all →</p>
          </div>
        </div>
      </div>

      {showAddCountry && (
        <AddCountryModal
          onClose={() => setShowAddCountry(false)}
          onRefresh={() => {
            client.get('/my-countries/stats/').then(res => setStats(res.data))
            client.get('/my-countries/').then(res => setCountries(res.data))
          }}
        />
      )}
      
    </div>
  )
}

export default Dashboard