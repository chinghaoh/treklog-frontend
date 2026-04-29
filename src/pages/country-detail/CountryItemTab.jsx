import { useState, useEffect } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'
import AddItemModal from '../modal/AddItemModal'
import EditItemModal from '../modal/EditItemModal'


function CountryItemTab({ entry, onRefresh }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddItem, setShowAddItem] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [editItem, setEditItem] = useState(null)  

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'landmark', label: 'Landmark' },
    { key: 'food', label: 'Food' },
    { key: 'activity', label: 'Activity' },
    { key: 'restaurant', label: 'Restaurant' },
  ]

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'done', label: 'Done' },
    { key: 'pending', label: 'Pending' },
  ]

  const filtered = entry.items
    .filter(i => categoryFilter === 'all' || i.category === categoryFilter)
    .filter(i => {
      if (statusFilter === 'done') return i.is_done
      if (statusFilter === 'pending') return !i.is_done
      return true
    })

  const doneCount = entry.items.filter(i => i.is_done).length
  const pendingCount = entry.items.length - doneCount

  const toggleItem = (itemId, currentDone) => {
    client.patch(`/items/${itemId}/`, { is_done: !currentDone })
      .then(() => onRefresh())
  }

  const handleDeleteItem = (itemId) => {
    client.delete(`/items/${itemId}/`)
      .then(() => {
        setConfirmDelete(null)
        onRefresh()
      })
  }

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-3">

      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl`}>

        {/* Filters */}
        <div className={`px-4 py-3 border-b ${theme.tw.borderDivider} flex items-center justify-between gap-4`}>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  categoryFilter === c.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {statusFilters.map(s => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === s.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div className={`grid grid-cols-[20px_1fr_100px_100px_80px_32px] gap-3 px-4 py-2 border-b ${theme.tw.borderDivider} ${theme.tw.surfaceSunk}`}>
          <div></div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Item</div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Category</div>
          <div className={`text-xs ${theme.tw.textMuted}`}>Region</div>
          <div className={`text-xs ${theme.tw.textMuted} text-right`}>Status</div>
          <div className={`text-xs ${theme.tw.textMuted} text-right`}>Actions</div>
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
            <div className={`text-sm ${theme.tw.textMuted} px-4 py-8 text-center`}>No items found.</div>
          ) : (
            filtered.map(i => {
            const checkboxClass = i.is_done ? theme.tw.checkboxChecked : theme.tw.checkboxEmpty
            return (
              <div key={i.id}>
                {confirmDelete === i.id ? (
                  <div className={`grid grid-cols-[20px_1fr_40px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} items-center bg-red-500/5`}>
                    <div></div>
                    <div>
                      <span className={`text-sm font-medium ${theme.tw.textMain}`}>{i.name}</span>
                      <p className="text-xs text-red-400 mt-0.5">Are you sure you want to delete this item?</p>
                    </div>
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className={`text-xs px-2 py-1 rounded ${theme.tw.surface} border border-gray-400 dark:border-gray-500 ${theme.tw.textMain}`}
                      >Cancel</button>
                      <button
                        onClick={() => handleDeleteItem(i.id)}
                        className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                      >Delete</button>
                    </div>
                  </div>
                ) : (
                  <div className={`grid grid-cols-[20px_1fr_100px_100px_80px_32px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} last:border-0 items-center`}>
                    <div
                      onClick={() => toggleItem(i.id, i.is_done)}
                      className={`w-4 h-4 rounded cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 ${checkboxClass}`}
                    ></div>
                    <span className={`text-sm ${i.is_done ? `${theme.tw.textMuted} line-through` : theme.tw.textMain}`}>{i.name}</span>
                    <span className={`text-xs ${theme.tw.textMuted}`}>{i.category_display}</span>
                    <span className={`text-xs ${theme.tw.textMuted}`}>{i.region_name || 'No region'}</span>
                    <span className={`text-xs text-right ${i.is_done ? theme.tw.statVisited : theme.tw.statWant}`}>
                      {i.is_done ? 'Done' : 'Pending'}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === i.id ? null : i.id) }}
                        className={`text-sm px-1 ${activeMenu === i.id ? theme.tw.primaryText : theme.tw.textMuted}`}
                      >···</button>
                      {activeMenu === i.id && (
                        <div className={`absolute right-0 top-6 ${theme.tw.surface} border ${theme.tw.borderDivider} rounded-lg z-10 shadow-lg min-w-36`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditItem(i); setActiveMenu(null) }}
                            className={`w-full text-left px-3 py-2 text-xs ${theme.tw.textMain} ${theme.tw.cardHover} border-b ${theme.tw.borderDivider}`}
                          >✏️ Edit item</button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(i.id); setActiveMenu(null) }}
                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                          >🗑 Delete item</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Footer */}
        <div className={`px-4 py-3 border-t ${theme.tw.borderDivider} ${theme.tw.surfaceSunk} flex items-center justify-between`}>
          <p className={`text-xs ${theme.tw.textMain}`}>
            {filtered.length} items · {doneCount} done · {pendingCount} pending
          </p>
          <button 
          onClick={() => setShowAddItem(true)}
          className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors`}>
            + Add item
          </button>
        </div>

      </div>

      {showAddItem && (
        <AddItemModal
          entry={entry}
          onClose={() => setShowAddItem(false)}
          onRefresh={onRefresh}
        />
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          regions={entry.regions}
          onClose={() => setEditItem(null)}
          onRefresh={onRefresh}
        />
      )}

    </div>
  )
}

export default CountryItemTab