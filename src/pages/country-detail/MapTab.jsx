import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { feature } from 'topojson-client'
import { theme } from '../../theme'
import client from '../../api/client'
import 'leaflet/dist/leaflet.css'

function MapTab({ entry, onRefresh }) {
  const [worldData, setWorldData] = useState(null)
  const [regionBoundaries, setRegionBoundaries] = useState({})
  const [loading, setLoading] = useState(true)

  const numericCode = parseInt(entry.country.numeric_code)

  // Load world atlas data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        const countries = feature(data, data.objects.countries)
        setWorldData(countries)
        setLoading(false)
      })
  }, [])

  // Fetch region boundaries
  useEffect(() => {
    const fetchBoundaries = async () => {
      for (const region of entry.regions) {
        if (!region.boundary) {
          try {
            const res = await client.post(`/my-countries/${entry.id}/regions/${region.id}/fetch-boundary/`)
            setRegionBoundaries(prev => ({ ...prev, [region.id]: res.data.boundary }))
            await new Promise(r => setTimeout(r, 1100))
          } catch (e) {}
        } else {
          setRegionBoundaries(prev => ({ ...prev, [region.id]: region.boundary }))
        }
      }
      onRefresh()
    }
    fetchBoundaries()
  }, [entry.id])

  const countryStyle = () => ({
    fillColor: '#e8e8e8',
    fillOpacity: 0.3,
    color: '#ccc',
    weight: 0.5,
  })

  const regionStyle = {
    fillColor: theme.colors.secondary,
    fillOpacity: 0.4,
    color: theme.colors.secondary,
    weight: 2,
  }

  // Find bounds of selected country for auto-zoom
  const getCountryBounds = () => {
    if (!worldData) return null
    const country = worldData.features.find(f => parseInt(f.id) === numericCode)
    if (!country) return null
    return country
  }

  const selectedCountry = getCountryBounds()

  return (
    <div className="flex flex-col gap-3">

      {loading && (
        <p className={`text-sm ${theme.tw.textMuted}`}>Loading map...</p>
      )}

      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl overflow-hidden`} style={{ height: '500px' }}>
        {!loading && (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              noWrap={true}
            />

            {/* All countries */}
            {worldData && (
              <GeoJSON
                data={worldData}
                style={countryStyle}
              />
            )}

            {/* Region boundaries */}
            {Object.entries(regionBoundaries).map(([regionId, boundary]) => (
              <GeoJSON
                key={regionId}
                data={boundary}
                style={regionStyle}
              />
            ))}

          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center">
      <span className={`flex items-center gap-1.5 text-xs ${theme.tw.textMuted}`}>
        <span className="w-2 h-2 rounded-sm inline-block" style={{ background: theme.colors.secondary }}></span>
        Regions
      </span>
    </div>

    </div>
  )
}

export default MapTab