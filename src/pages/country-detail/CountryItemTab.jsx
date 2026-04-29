import { useState } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'
import AddItemModal from '../modal/AddItemModal'

function CountryItemTab({ entry, onRefresh }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddItem, setShowAddItem] = useState(false)

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

  return (
    <div className="flex flex-col gap-3">

      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl overflow-hidden`}>

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
        <div className={`grid grid-cols-[20px_1fr_100px_100px_80px] gap-3 px-4 py-2 border-b ${theme.tw.borderDivider} ${theme.tw.surfaceSunk}`}>
          <div></div>
          <div className={`text-xs ${theme.tw.textMain}`}>Item</div>
          <div className={`text-xs ${theme.tw.textMain}`}>Category</div>
          <div className={`text-xs ${theme.tw.textMain}`}>Region</div>
          <div className={`text-xs ${theme.tw.textMain} text-right`}>Status</div>
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className={`text-sm ${theme.tw.textMain} px-4 py-8 text-center`}>No items found.</div>
        ) : (
          filtered.map(i => {
            const checkboxClass = i.is_done ? theme.tw.checkboxChecked : theme.tw.checkboxEmpty
            return (
              <div key={i.id} className={`grid grid-cols-[20px_1fr_100px_100px_80px] gap-3 px-4 py-3 border-b ${theme.tw.borderDivider} last:border-0 items-center`}>
                <div
                  onClick={() => toggleItem(i.id, i.is_done)}
                  className={`w-4 h-4 rounded cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0 ${checkboxClass}`}
                ></div>
                <span className={`text-sm ${i.is_done ? `${theme.tw.textMain} line-through` : theme.tw.textMain}`}>{i.name}</span>
                <span className={`text-xs ${theme.tw.textMain}`}>{i.category_display}</span>
                <span className={`text-xs ${theme.tw.textMain}`}>{i.region_name || 'No region'}</span>
                <span className={`text-xs text-right ${i.is_done ? theme.tw.statVisited : theme.tw.statWant}`}>
                {i.is_done ? 'Done' : 'Pending'}
                </span>
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

    </div>
  )
}

export default CountryItemTab