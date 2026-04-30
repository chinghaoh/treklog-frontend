import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { feature } from 'topojson-client'
import { useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import client from '../api/client'
import 'leaflet/dist/leaflet.css'

function WorldMap() {
  const navigate = useNavigate()
  const [worldData, setWorldData] = useState(null)
  const [countryLookup, setCountryLookup] = useState({})
  const [stats, setStats] = useState({ visited: 0, want_to_visit: 0 })

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => setWorldData(feature(data, data.objects.countries)))
  }, [])

  
  useEffect(() => {
    client.get('/my-countries/')
      .then(res => {
        const entries = Array.isArray(res.data) ? res.data : res.data.results ?? []
        const lookup = {}
        entries.forEach(e => {
          const code = parseInt(e.country.numeric_code)
          lookup[code] = { id: e.id, status: e.status, name: e.country.name, iso: e.country.iso_code, regions: e.regions_count ?? 0, items: e.item_count ?? 0 }
        })
        setCountryLookup(lookup)
      })

    client.get('/my-countries/stats/')
      .then(res => setStats(res.data))
  }, [])

  // Color each country feature by status
  const countryStyle = (feature) => {
    const entry = countryLookup[parseInt(feature.id)]
    if (!entry) return { fillColor: theme.colors.legend.untracked, fillOpacity: 0.15, color: '#aaa', weight: 0.5 }
    if (entry.status === 'visited') return { fillColor: theme.colors.legend.visited, fillOpacity: 0.7, color: '#fff', weight: 1 }
    if (entry.status === 'want_to_visit') return { fillColor: theme.colors.legend.wantToVisit, fillOpacity: 0.7, color: '#fff', weight: 1 }
    return { fillColor: theme.colors.legend.untracked, fillOpacity: 0.15, color: '#aaa', weight: 0.5 }
  }

  // Hover + click per feature
  const onEachFeature = (feature, layer) => {
    const entry = countryLookup[parseInt(feature.id)]
    if (!entry) return

    const statusLabel = entry.status === 'visited' ? 'Visited' : 'Want to visit'

    layer.bindTooltip(`
      <div style="font-size:12px;line-height:1.6">
        <strong>${entry.name}</strong><br/>
        ${entry.regions} regions · ${entry.items} items<br/>
        <span>${statusLabel}</span>
      </div>
    `, { sticky: true })

    layer.on('click', () => navigate(`/my-countries/${entry.id}`))
    layer.on('mouseover', e => e.target.setStyle({ fillOpacity: 0.9 }))
    layer.on('mouseout', e => e.target.setStyle(countryStyle(feature)))
  }

  return (
    <div className="flex flex-col gap-2">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>World Map</h1>
          <p className={`text-sm ${theme.tw.textMuted} mt-0.5`}>Your travel footprint</p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border}`}>
            <span className={theme.tw.textMuted}>Visited </span>
            <span className={`font-medium ${theme.tw.textMain}`}>{stats.visited}</span>
          </span>
          <span className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border}`}>
            <span className={theme.tw.textMuted}>Want to visit </span>
            <span className={`font-medium ${theme.tw.textMain}`}>{stats.want_to_visit}</span>
          </span>
        </div>
      </div>

      {/* Map */}
      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl overflow-hidden`} style={{ height: 'calc(100vh - 160px)' }}>
        {worldData && Object.keys(countryLookup).length >= 0 && (
          <MapContainer
            center={[20, 0]}
            zoom={3}
            minZoom={3}
            maxZoom={6}
            scrollWheelZoom={true}
            zoomControl={true}
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
            <GeoJSON
              key={JSON.stringify(countryLookup)}
              data={worldData}
              style={countryStyle}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center">
        <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMuted}`}>
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.visited }}></span>
          Visited
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMuted}`}>
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.wantToVisit }}></span>
          Want to visit
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMuted}`}>
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.legend.untracked }}></span>
          Not tracked
        </span>
      </div>

    </div>
  )
}

export default WorldMap