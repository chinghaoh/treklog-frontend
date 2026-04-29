import { theme } from '../../theme'
import { useNavigate } from 'react-router-dom'
import AddRegionModal from '../modal/AddRegionModal'
import AddItemModal from '../modal/AddItemModal'
import { useState } from 'react'


function OverviewTab({ entry,onRefresh }) {
  const navigate = useNavigate()
  const itemsDone = entry.items.filter(i => i.is_done).length
  const progress = entry.item_count ? Math.round((itemsDone / entry.item_count) * 100) : 0

  const [showAddRegion, setShowAddRegion] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  return (
    <div className="flex flex-col gap-3">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`${theme.tw.surface} ${theme.tw.cardBorder} rounded-lg p-3`}>
          <p className={`text-xs ${theme.tw.textMain} mb-1`}>Regions</p>
          <p className={`text-lg font-medium ${theme.tw.textMain}`}>{entry.regions.length}</p>
          <p className={`text-xs mt-1 ${theme.tw.textMuted}`}>Cities / areas</p>
        </div>
        <div className={`${theme.tw.surface} ${theme.tw.cardBorder} rounded-lg p-3`}>
          <p className={`text-xs ${theme.tw.textMain} mb-1`}>Items logged</p>
          <p className={`text-lg font-medium ${theme.tw.textMain}`}>{entry.item_count}</p>
          <p className={`text-xs mt-1 ${theme.tw.textMuted}`}>Landmarks & food</p>
          </div>
        <div className={`${theme.tw.surface} ${theme.tw.cardBorder} rounded-lg p-3`}>
          <p className={`text-xs ${theme.tw.textMain} mb-1`}>Items done</p>
          <p className={`text-lg font-medium ${theme.tw.textMain}`}>{itemsDone}</p>
          <p className={`text-xs mt-1 ${progress > 0 ? theme.tw.statVisited : theme.tw.statDone}`}>
            {`${progress}% complete`}
          </p>
        </div>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-2 gap-3">

        {/* Regions panel */}
        <div className={`${theme.tw.surface} ${theme.tw.cardBorder} rounded-xl p-3`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-sm font-medium ${theme.tw.textMain}`}>Regions</p>
            <button 
              onClick={() => setShowAddRegion(true)}
              className={`text-xs ${theme.tw.primaryText}`}>+ Add region</button>
          </div>
          <div className="flex flex-col gap-2">
            {entry.regions.length === 0 ? (
              <p className={`text-xs ${theme.tw.textMuted}`}>No regions yet.</p>
            ) : (
              entry.regions.map(r => (
                <div key={r.id} className={`${theme.tw.cardBorder} rounded-lg p-2`}>
                  <p className={`text-xs font-medium ${theme.tw.textMain}`}>{r.name}</p>
                  <p className={`text-xs ${theme.tw.textMuted} mt-0.5`}>{r.type_display}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {entry.items
                      .filter(i => i.region === r.id)
                      .slice(0, 2)
                      .map(i => (
                        <span key={i.id} className={`text-xs px-1.5 py-0.5 rounded ${theme.tw.textMain}`}>
                          {i.name}
                        </span>
                      ))}
                    {entry.items.filter(i => i.region === r.id).length > 2 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${theme.tw.surfaceSunk} ${theme.tw.textMuted}`}>
                        +{entry.items.filter(i => i.region === r.id).length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent items panel */}
        <div className={`${theme.tw.surface} ${theme.tw.cardBorder} rounded-xl p-3`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-sm font-medium ${theme.tw.textMain}`}>Recent items</p>
            <button 
            onClick={() => setShowAddItem(true)}
            className={`text-xs ${theme.tw.primaryText}`}>+ Add item</button>
          </div>
          <div className="flex flex-col">
            {entry.items.length === 0 ? (
              <p className={`text-xs ${theme.tw.textMuted}`}>No items yet.</p>
            ) : (
              entry.items.slice(0, 5).map(i => (
                <div key={i.id} className={`flex items-center gap-2 py-1.5 border-b ${theme.tw.borderDivider} last:border-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i.is_done ? theme.tw.dotDone : theme.tw.dotPending}`}></span>
                  <span className={`text-xs flex-1 ${theme.tw.textMain}`}>{i.name}</span>
                  <span className={`text-xs ${theme.tw.textMuted}`}>{i.category}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Notes panel */}
      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-3 cursor-pointer`} onClick={() => navigate(`/my-countries/${entry.id}/notes`)}>
        <p className={`text-sm font-semibold ${theme.tw.textMain} mb-2`}>Notes</p>
        <div className={`${theme.tw.surfaceSunk} rounded-lg p-3 text-sm ${theme.tw.textMuted} leading-relaxed min-h-16`}>
          {entry.notes || 'No notes yet.'}
        </div>
      </div>

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
        />
      )}

    </div>
  )
}

export default OverviewTab