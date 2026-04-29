import { useState, useEffect } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'
import AddRegionModal from '../modal/AddRegionModal'
import AddItemModal from '../modal/AddItemModal'
import EditRegionModal from '../modal/EditRegionModal'
import { useNavigate } from 'react-router-dom'

function RegionsTab({ entry, onRefresh }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState({})
  const [showAddRegion, setShowAddRegion] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [addItemRegionId, setAddItemRegionId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [editRegion, setEditRegion] = useState(null)

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleDeleteRegion = (regionId) => {
    client.delete(`/regions/${regionId}/`)
      .then(() => {
        setConfirmDelete(null)
        onRefresh()
      })
  }

  const toggleRegion = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = entry.regions.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const unassignedItems = entry.items.filter(i => i.region === null)

  const toggleItem = (itemId, currentDone) => {
    client.patch(`/items/${itemId}/`, { is_done: !currentDone })
      .then(() => onRefresh())
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Search + Add */}
      <div className="flex gap-2">
        <input
          placeholder="Search regions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${theme.tw.surface} ${theme.tw.border} ${theme.tw.textMain} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500`}
        />
        <button
          onClick={() => setShowAddRegion(true)}
          className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
          + Add region
        </button>
      </div>

      {/* Region cards */}
      {filtered.map(r => (
        <div key={r.id} className={`${theme.tw.surface} ${theme.tw.border} rounded-xl `}>

          {/* Region header */}
          {confirmDelete === r.id ? (
            <div className="flex items-center justify-between px-4 py-3 bg-red-500/5">
              <div>
                <span className={`text-sm font-medium ${theme.tw.textMain}`}>{r.name}</span>
                <p className="text-xs text-red-400 mt-0.5">This will delete all items in this region. Are you sure?</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className={`text-xs px-2 py-1 rounded ${theme.tw.surface} border border-gray-400 dark:border-gray-500 ${theme.tw.textMain}`}
                >Cancel</button>
                <button
                  onClick={() => handleDeleteRegion(r.id)}
                  className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                >Delete</button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => toggleRegion(r.id)}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${theme.tw.primaryText}`}>
                  {expanded[r.id] ? '−' : '+'}
                </span>
                <span className={`text-sm font-medium ${theme.tw.textMain}`}>{r.name}</span>
                <span className={`text-xs ${theme.tw.textMuted}`}>{r.type_display}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${theme.tw.chip}`}>{r.item_count} items</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setAddItemRegionId(r.id); setShowAddItem(true) }}
                  className={`text-xs ${theme.tw.primaryText}`}
                >+ Add item</button>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === r.id ? null : r.id) }}
                    className={`text-sm px-1 ${activeMenu === r.id ? theme.tw.primaryText : theme.tw.textMuted}`}
                  >···</button>
                  {activeMenu === r.id && (
                    <div className={`absolute right-0 top-6 ${theme.tw.surface} border ${theme.tw.borderDivider} rounded-lg overflow-hidden z-10 shadow-lg min-w-36`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditRegion(r); setActiveMenu(null) }}
                        className={`w-full text-left px-3 py-2 text-xs ${theme.tw.textMain} ${theme.tw.cardHover} border-b ${theme.tw.borderDivider}`}
                      >✏️ Edit region</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(r.id); setActiveMenu(null) }}
                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                      >🗑 Delete region</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          {expanded[r.id] && (
            <div className={`border-t ${theme.tw.borderDivider}`}>
              {entry.items.filter(i => i.region === r.id).length === 0 ? (
                <p className={`text-xs ${theme.tw.textMuted} px-4 py-3`}>No items yet.</p>
              ) : (
                entry.items.filter(i => i.region === r.id).map(i => {
                  const checkboxClass = i.is_done ? theme.tw.checkboxChecked : theme.tw.checkboxEmpty
                  return (
                    <div key={i.id} 
                    onClick={() => navigate(`/my-countries/${i.country_entry_id}/items`)}
                    className={`flex items-center gap-3 px-4 py-2.5 border-b cursor-pointer ${theme.tw.cardHover} ${theme.tw.borderDivider} last:border-0`}>
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleItem(i.id, i.is_done) }}
                        className={`w-4 h-4 rounded cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 ${checkboxClass}`}>
                      </div>
                      <span className={`text-sm flex-1 ${i.is_done ? `${theme.tw.textMuted} line-through` : theme.tw.textMain}`}>{i.name}</span>
                      <span className={`text-xs ${theme.tw.textMuted}`}>{i.category_display}</span>
                    </div>
                  )
                })
              )}
            </div>
          )}

        </div>
      ))}

      {/* No region group */}
      {unassignedItems.length > 0 && (
        <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl`}>
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer"
            onClick={() => toggleRegion('unassigned')}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${theme.tw.primaryText}`}>
                {expanded['unassigned'] ? '−' : '+'}
              </span>
              <span className={`text-sm font-medium ${theme.tw.textMain}`}>No region</span>
              <span className={`text-xs ${theme.tw.textMuted}`}>General</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${theme.tw.chip}`}>{unassignedItems.length} items</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setAddItemRegionId(null); setShowAddItem(true) }}
              className={`text-xs ${theme.tw.primaryText}`}
            >+ Add item</button>
          </div>
          {expanded['unassigned'] && (
            <div className={`border-t ${theme.tw.borderDivider}`}>
              {unassignedItems.map(i => {
                const checkboxClass = i.is_done ? theme.tw.checkboxChecked : theme.tw.checkboxEmpty
                return (
                  <div key={i.id} 
                  onClick={() => navigate(`/my-countries/${i.country_entry_id}/items`)}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b cursor-pointer ${theme.tw.cardHover} ${theme.tw.borderDivider} last:border-0`}>
                    <div
                      onClick={(e) => { e.stopPropagation(); toggleItem(i.id, i.is_done) }}
                      className={`w-4 h-4 rounded cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 ${checkboxClass}`}>
                    </div>
                    <span className={`text-sm flex-1 ${i.is_done ? `${theme.tw.textMuted} line-through` : theme.tw.textMain}`}>{i.name}</span>
                    <span className={`text-xs ${theme.tw.textMuted}`}>{i.category_display}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showAddRegion && (
        <AddRegionModal
          entry={entry}
          onClose={() => setShowAddRegion(false)}
          onRefresh={onRefresh}
        />
      )}

      {showAddItem && (
        <AddItemModal
          entry={entry}
          onClose={() => setShowAddItem(false)}
          onRefresh={onRefresh}
          defaultRegionId={addItemRegionId}
        />
      )}

      {editRegion && (
        <EditRegionModal
          region={editRegion}
          onClose={() => setEditRegion(null)}
          onRefresh={onRefresh}
        />
      )}

    </div>
  )
}

export default RegionsTab