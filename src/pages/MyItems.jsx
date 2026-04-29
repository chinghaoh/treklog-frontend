import { useState, useEffect } from 'react'
import { theme } from '../theme'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'landmark', label: 'Landmark' },
  { key: 'food', label: 'Food' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'activity', label: 'Activity' },
  { key: 'accommodation', label: 'Accommodation' },
]

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'done', label: 'Done' },
  { key: 'pending', label: 'Pending' },
]

const ITEMS_PER_PAGE = 10

function MyItems() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()


  const fetchItems = () => {
    client.get('/items/')
      .then(res => setItems(Array.isArray(res.data) ? res.data : res.data.results ?? []))
  }

  useEffect(() => { fetchItems() }, [])

  const toggleItem = (itemId, currentDone) => {
    client.patch(`/items/${itemId}/`, { is_done: !currentDone })
      .then(() => fetchItems())
  }

  const countries = [...new Map(items.map(i => [i.country_iso, { name: i.country_name, iso: i.country_iso }])).values()]

  const filtered = items
    .filter(i => search === '' || i.name.toLowerCase().includes(search.toLowerCase()))
    .filter(i => countryFilter === 'all' || i.country_iso === countryFilter)
    .filter(i => categoryFilter === 'all' || i.category === categoryFilter)
    .filter(i => {
      if (statusFilter === 'done') return i.is_done
      if (statusFilter === 'pending') return !i.is_done
      return true
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const doneCount = items.filter(i => i.is_done).length
  const pendingCount = items.length - doneCount

  const resetPage = () => setCurrentPage(1)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>My items</h1>
        <p className={`text-sm ${theme.tw.textMuted} mt-0.5`}>
          {items.length} items · {doneCount} done · {pendingCount} pending
        </p>
      </div>

      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl overflow-hidden`}>

        {/* Search + country filter */}
        <div className={`flex gap-2 px-4 py-3 border-b ${theme.tw.borderDivider}`}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage() }}
            placeholder="Search items..."
            className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
          />
          <select
            value={countryFilter}
            onChange={e => { setCountryFilter(e.target.value); resetPage() }}
            className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500`}
          >
            <option value="all">All countries</option>
            {countries.map(c => (
              <option key={c.iso} value={c.iso}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Category + status filters */}
        <div className={`flex items-center justify-between px-4 py-2 border-b  ${theme.tw.borderDivider} flex-wrap gap-2`}>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => { setCategoryFilter(c.key); resetPage() }}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === c.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`
                  }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map(s => (
              <button
                key={s.key}
                onClick={() => { setStatusFilter(s.key); resetPage() }}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === s.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div className={`grid grid-cols-[20px_1fr_100px_130px_100px_80px] gap-3 px-4 py-2 border-b  ${theme.tw.borderDivider} ${theme.tw.surfaceSunk}`}>
          <div></div>
          <div className={`text-xs ${theme.tw.textMain}`}>Item</div>
          <div className={`text-xs ${theme.tw.textMain}`}>Category</div>
          <div className={`text-xs ${theme.tw.textMain}`}>Country</div>
          <div className={`text-xs ${theme.tw.textMain}`}>Region</div>
          <div className={`text-xs ${theme.tw.textMain} text-right`}>Status</div>
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div className={`text-sm ${theme.tw.textMuted} px-4 py-8 text-center`}>No items found.</div>
        ) : (
          paginated.map(i => {
            const checkboxClass = i.is_done ? theme.tw.checkboxChecked : theme.tw.checkboxEmpty
            return (
                <div 
                    key={i.id} 
                    onClick={() => navigate(`/my-countries/${i.country_entry_id}/overview`)}
                    className={`grid grid-cols-[20px_1fr_100px_130px_100px_80px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} last:border-0 items-center cursor-pointer ${theme.tw.cardHover}`}
                    >
                <div
                    onClick={(e) => { e.stopPropagation(); toggleItem(i.id, i.is_done) }}
                    className={`w-4 h-4 rounded cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 ${checkboxClass}`}
                ></div>
                <span className={`text-sm ${i.is_done ? `${theme.tw.textMuted} line-through` : theme.tw.textMain}`}>{i.name}</span>
                <span className={`text-xs ${theme.tw.textMuted}`}>{i.category_display}</span>
                <div className="flex items-center gap-1.5">
                  <img src={`https://flagcdn.com/16x12/${i.country_iso.toLowerCase()}.png`} className="rounded-sm" />
                  <span className={`text-xs ${theme.tw.textMuted}`}>{i.country_name}</span>
                </div>
                <span className={`text-xs ${theme.tw.textMuted}`}>{i.region_name || 'No region'}</span>
                <span className={`text-xs text-right ${i.is_done ? theme.tw.statVisited : theme.tw.statWant}`}>
                  {i.is_done ? 'Done' : 'Pending'}
                </span>
              </div>
            )
          })
        )}

        {/* Footer */}
        <div className={`px-4 py-3 border-t ${theme.tw.borderDivider} ${theme.tw.surfaceSunk} flex items-center justify-between`}>
          <p className={`text-xs ${theme.tw.textMuted}`}>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} items
          </p>
          {totalPages > 1 && (
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted} disabled:opacity-40`}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    page === currentPage ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`
                  }`}
                >{page}</button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted} disabled:opacity-40`}
              >Next →</button>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default MyItems