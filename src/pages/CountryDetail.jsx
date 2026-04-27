import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import client from '../api/client'

const statusMap = {
  visited: 'visited',
  want_to_visit: 'wantToVisit',
  living_there: 'livingThere',
}

function CountryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    client.get(`/my-countries/${id}/`)
      .then(res => setEntry(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!entry) return <div className={`text-sm ${theme.tw.textMuted}`}>Loading...</div>

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/my-countries')}
            className={`text-sm ${theme.tw.textMuted}`}
          >
            ← Back
          </button>
          <div className={theme.tw.dividerX}></div>
          <img
            src={`https://flagcdn.com/24x18/${entry.country.iso_code.toLowerCase()}.png`}
            className="rounded-sm"
          />
          <div>
            <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>{entry.country.name}</h1>
            <p className={`text-sm ${theme.tw.textMuted}`}>{entry.country.region}</p>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              background: theme.colors.status[statusMap[entry.status]].bg,
              color: theme.colors.status[statusMap[entry.status]].text,
            }}
          >
            {entry.status_display}
          </span>
        </div>
        <button className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.btnSecondary}`}>
          Edit status
        </button>
      </div>

      {/* Tab bar */}
      <div className={`flex gap-0 border-b ${theme.tw.borderDivider}`}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'regions', label: 'Regions' },
          { key: 'map', label: 'Map' },
          { key: 'notes', label: 'Notes' },
          { key: 'hotels', label: 'Hotels', future: true },
          { key: 'flights', label: 'Flights', future: true },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => !tab.future && setActiveTab(tab.key)}
            className={`text-sm px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === tab.key
                ? theme.tw.tabActive
                : tab.future
                  ? theme.tw.tabFuture
                  : theme.tw.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  )
}

export default CountryDetail