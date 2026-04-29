import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { theme } from '../../theme'
import OverviewTab from './OverviewTab'
import RegionsTab from './RegionsTab'
import MapTab from './MapTab'
import NotesTab from './NotesTab'
import CountryItemTab from './CountryItemTab'
import EditStatusModal from '../modal/EditStatusModal'

import client from '../../api/client'

const statusMap = {
  visited: 'visited',
  want_to_visit: 'wantToVisit',
  living_there: 'livingThere',
}

function CountryDetail() {
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const { id, tab } = useParams()
  const activeTab = tab || 'overview'
  const [showEditStatus, setShowEditStatus] = useState(false)
  useEffect(() => {
    client.get(`/my-countries/${id}/`)
      .then(res => setEntry(res.data))
      .catch(err => console.error(err))
  }, [id])

  const refetch = () => {
    client.get(`/my-countries/${id}/`)
      .then(res => setEntry(res.data))
      .catch(err => console.error(err))
  }

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
          {entry.visited_at && (
            <span className={`text-xs ${theme.tw.textMuted}`}>
              · {new Date(entry.visited_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <button 
          onClick={() => setShowEditStatus(true)}
          className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
          Edit status
        </button>
      </div>

      {/* Tab bar */}
      <div className={`flex gap-0 border-b ${theme.tw.borderDivider}`}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'regions', label: 'Regions' },
          { key: 'items', label: 'Items' },
          { key: 'map', label: 'Map' },
          { key: 'notes', label: 'Notes' },
          { key: 'hotels', label: 'Hotels', future: true },
          { key: 'flights', label: 'Flights', future: true },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => !tab.future && navigate(`/my-countries/${id}/${tab.key}`)}
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

      {activeTab === 'overview' && <OverviewTab entry={entry} onRefresh={refetch} />}
      {activeTab === 'regions' && <RegionsTab entry={entry} onRefresh={refetch} />}
      {activeTab === 'items' && <CountryItemTab entry={entry} onRefresh={refetch} />}
      {activeTab === 'map' &&  <MapTab entry={entry} onRefresh={refetch} />}  
      {activeTab === 'notes' && <NotesTab entry={entry} onRefresh={refetch} />}
      

      {showEditStatus && (
        <EditStatusModal
          entry={entry}
          onClose={() => setShowEditStatus(false)}
          onRefresh={refetch}
        />
      )}

    </div>
  )
}

export default CountryDetail