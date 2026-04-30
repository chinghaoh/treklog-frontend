import { theme } from '../theme'
import { useState, useEffect } from 'react'
import client from '../api/client'
import AddCountryModal from './modal/AddCountryModal'
import { useNavigate } from 'react-router-dom'

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
  const [currencies, setCurrencies] = useState([])
  const [rateFormat, setRateFormat] = useState('1eur')

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

    // client.get('/currencies/')
    //   .then(res => setCurrencies(res.data))
    //   .catch(err => console.error(err))
  }, [])

  const statusMap = {
    visited: 'visited',
    want_to_visit: 'wantToVisit',
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
        <button
          onClick={() => setShowAddCountry(true)}
          className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
          + Add country
        </button>
      </div>

      {/* Row 1 — Stats */}
      <div className="grid grid-cols-4 gap-2">
        {statCards.map((s) => (
          <div key={s.label} className={`${theme.tw.surface} ${theme.tw.border} rounded-lg p-2.5`}>
            <p className={`text-sm font-medium ${theme.tw.textMain} mb-1`}>{s.label}</p>
            <p className={`text-lg ${theme.tw.textMain} mb-1`}>{s.value}</p>
            <p className={`text-xs ${s.color} mb-1`}>{s.tag}</p>
          </div>
        ))}
      </div>

      {/* Row 2 — Hotels / Flights / Currency */}
      <div className="grid grid-cols-3 gap-2">

        {/* Hotels — future */}
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3 opacity-45`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${theme.tw.textMain}`}>Hotels</p>
            <span className={`text-xs px-2 py-0.5 rounded-md ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`}>Coming soon</span>
          </div>
          <p className={`text-xs ${theme.tw.textMuted}`}>Track your hotel bookings per country</p>
        </div>

        {/* Flights — future */}
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3 opacity-45`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${theme.tw.textMain}`}>Flights</p>
            <span className={`text-xs px-2 py-0.5 rounded-md ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`}>Coming soon</span>
          </div>
          <p className={`text-xs ${theme.tw.textMuted}`}>Track your flights and routes</p>
        </div>

        {/* Currency — live */}
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${theme.tw.textMain}`}>Currency</p>
            <div className="flex gap-1">
              <button
                onClick={() => setRateFormat('1eur')}
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  rateFormat === '1eur'
                    ? `${theme.tw.primaryBg} text-white`
                    : `${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`
                }`}>
                1 EUR =
              </button>
              <button
                onClick={() => setRateFormat('pereur')}
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  rateFormat === 'pereur'
                    ? `${theme.tw.primaryBg} text-white`
                    : `${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`
                }`}>
                per EUR
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {currencies.length === 0 && (
              <p className={`text-xs ${theme.tw.textMuted}`}>No currencies yet — add countries to see rates</p>
            )}
            {currencies.map((c) => (
              <div key={c.code} className={`flex items-center justify-between py-1 border-b ${theme.tw.borderDivider} last:border-0`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <p className={`text-xs font-medium ${theme.tw.textMain}`}>{c.code}</p>
                    <p className={`text-xs ${theme.tw.textMuted}`}>{c.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${theme.tw.textMain}`}>
                    {rateFormat === '1eur'
                      ? c.rate.toLocaleString('en-US', { maximumFractionDigits: 2 })
                      : (1 / c.rate).toLocaleString('en-US', { maximumFractionDigits: 4 })
                    }
                  </p>
                  <p className={`text-xs ${theme.tw.textMuted}`}>
                    {rateFormat === '1eur' ? '1 EUR' : 'per EUR'}
                  </p>
                </div>
              </div>
            ))}
            {currencies.length > 0 && (
              <p className={`text-xs ${theme.tw.textMuted} pt-0.5`}>Updated {currencies[0]?.updated_at}</p>
            )}
          </div>
        </div>

      </div>

      {/* Row 3 — My countries + Recent items */}
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
                  {c.status === 'visited' ? 'Visited' : 'Want to visit'}
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