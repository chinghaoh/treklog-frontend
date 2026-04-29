import { useState, useEffect } from 'react'
import { theme } from '../theme'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'
import AddCountryModal from './modal/AddCountryModal'
import EditStatusModal from './modal/EditStatusModal'


function MyCountries() {

  const navigate = useNavigate()
  const ITEMS_PER_PAGE = 10

  const [countries, setCountries] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddCountry, setShowAddCountry] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) 
  const [confirmDelete, setConfirmDelete] = useState(null) 
  const [editCountry, setEditCountry] = useState(null)

  

  useEffect(() => {
    client.get('/my-countries/')
      .then(res => setCountries(Array.isArray(res.data) ? res.data : res.data.results ?? []))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  const filters = [
    { key: 'all', label: 'All' },
    { key: 'visited', label: 'Visited' },
    { key: 'want_to_visit', label: 'Want to visit' },
    { key: 'living_there', label: 'Living there' },
  ]

  const filtered = activeFilter === 'all'
    ? countries
    : countries.filter(c => c.status === activeFilter)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const statusMap = {
    visited: 'visited',
    want_to_visit: 'wantToVisit',
    living_there: 'livingThere',
  }

  const statusLabel = {
    visited: 'Visited',
    want_to_visit: 'Want to visit',
    living_there: 'Living there',
  }

  const handleDelete = (id) => {
    client.delete(`/my-countries/${id}/`)
      .then(() => {
        setConfirmDelete(null)
        setActiveMenu(null)
        client.get('/my-countries/')
          .then(res => setCountries(Array.isArray(res.data) ? res.data : res.data.results ?? []))
      })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>My countries</h1>
          <p className={`text-sm ${theme.tw.textMuted} mt-0.5`}>{countries.length} countries tracked</p>
        </div>
        <button 
        onClick={() => setShowAddCountry(true)}
        className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
          + Add country
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => { setActiveFilter(f.key); setCurrentPage(1) }}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === f.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive}`
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Country list */}
      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl`}>

        {/* Column headers */}
        <div className={`grid grid-cols-[32px_1fr_120px_120px_80px_40px] gap-3 px-4 py-2 border-b ${theme.tw.borderDivider} ${theme.tw.surfaceSunk}`}>
          <div></div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Country</div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Status</div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Visited</div>
          <div className={`text-xs ${theme.tw.textMuted} text-right`}>Items</div>
          <div></div>
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div className={`text-sm ${theme.tw.textMuted} px-4 py-8 text-center`}>No countries found.</div>
        ) : (
          paginated.map((c) => (
            <div key={c.id}>
              {confirmDelete === c.id ? (
                <div className={`grid grid-cols-[32px_1fr_40px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} items-center bg-red-500/5`}>
                <img src={`https://flagcdn.com/24x18/${c.country.iso_code.toLowerCase()}.png`} alt={c.country.name} className="rounded-sm" />
                <div>
                  <div className={`text-sm font-medium ${theme.tw.textMain}`}>{c.country.name}</div>
                  <div className="text-xs text-red-400">This will delete all regions and items. Are you sure?</div>
                </div>
                <div className="flex gap-1.5 items-center justify-end">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className={`text-xs px-2 py-1 rounded ${theme.tw.surface} border border-gray-400 dark:border-gray-500 cursor-pointer ${theme.tw.textMain}`}
                    >Cancel</button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                  >Delete</button>
                </div>
              </div>
              ) : (
                <div
                  onClick={() => navigate(`/my-countries/${c.id}/overview`)}
                  className={`grid grid-cols-[32px_1fr_120px_120px_80px_40px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} items-center ${theme.tw.cardHover} cursor-pointer transition-colors relative`}
                >
                  <img src={`https://flagcdn.com/24x18/${c.country.iso_code.toLowerCase()}.png`} alt={c.country.name} className="rounded-sm" />
                  <div>
                    <div className={`text-sm font-medium ${theme.tw.textMain}`}>{c.country.name}</div>
                    <div className={`text-xs ${theme.tw.textMuted}`}>{c.country.region}</div>
                  </div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-md"
                      style={{
                        background: theme.colors.status[statusMap[c.status]].bg,
                        color: theme.colors.status[statusMap[c.status]].text,
                      }}>
                      {statusLabel[c.status]}
                    </span>
                  </div>
                  <div className={`text-xs ${theme.tw.textMuted}`}>
                    {c.visited_at ? new Date(c.visited_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}
                  </div>
                  <div className={`text-xs ${theme.tw.textMuted} text-right`}>{c.item_count ?? 0} items</div>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === c.id ? null : c.id) }}
                      className={`text-sm px-2 cursor-pointer ${activeMenu === c.id ? theme.tw.primaryText : theme.tw.textMuted}`}
                    >···</button>
                    {activeMenu === c.id && (
                      <div className={`absolute right-0 top-6 ${theme.tw.surface} border ${theme.tw.borderDivider} rounded-lg overflow-hidden z-10 shadow-lg min-w-36`}>
                        <button
                            onClick={(e) => { 
                              e.stopPropagation()
                              setEditCountry(c)
                              setActiveMenu(null) 
                            }}
                            className={`w-full text-left px-3 py-2 text-xs ${theme.tw.textMain} ${theme.tw.cardHover} border-b cursor-pointer ${theme.tw.borderDivider}`}
                          >✏️ Edit status</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(c.id); setActiveMenu(null) }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 cursor-pointer hover:bg-red-500/10"
                        >🗑 Delete country</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className={`text-xs ${theme.tw.textMuted}`}>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} countries
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted} ${theme.tw.btnDisabled}`}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  page === currentPage ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted}`
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`text-xs px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMuted} ${theme.tw.btnDisabled}`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {showAddCountry && (
        <AddCountryModal
          onClose={() => setShowAddCountry(false)}
          onRefresh={() => {
            client.get('/my-countries/').then(res => setCountries(res.data))
          }}
        />
      )}

      {editCountry && (
        <EditStatusModal
          entry={editCountry}
          onClose={() => setEditCountry(null)}
          onRefresh={() => {
            client.get('/my-countries/')
              .then(res => setCountries(Array.isArray(res.data) ? res.data : res.data.results ?? []))
          }}
        />
      )}
    </div>
  )
}

export default MyCountries