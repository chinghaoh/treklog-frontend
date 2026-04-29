import { useState } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'

const CATEGORIES = [
  { key: 'landmark', label: 'Landmark' },
  { key: 'food', label: 'Food' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'activity', label: 'Activity' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'other', label: 'Other' },
]

function AddItemModal({ entry, onClose, onRefresh, defaultRegionId = null }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('landmark')
  const [regionId, setRegionId] = useState(defaultRegionId)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) return
    setSaving(true)
    client.post(`/my-countries/${entry.id}/items/`, {
      name,
      category,
      region: regionId || null,
      notes,
    })
      .then(() => {
        onRefresh()
        onClose()
      })
      .finally(() => setSaving(false))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.tw.surface} border ${theme.tw.borderDivider} rounded-xl w-full max-w-md overflow-hidden`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${theme.tw.borderDivider}`}>
          <div>
            <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Add item</p>
            <p className={`text-xs ${theme.tw.textMuted} mt-0.5`}>Adding item to {entry.country.name}</p>
          </div>
          <button onClick={onClose} className={`text-lg ${theme.tw.textMuted}`}>×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Name */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
            />
          </div>

          {/* Category */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Category</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    category === c.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>
              Region <span className={`text-xs font-normal ${theme.tw.textMuted}`}>— optional</span>
            </p>
            <select
              value={regionId || ''}
              onChange={e => setRegionId(e.target.value || null)}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500`}
            >
              <option value="">No region</option>
              {entry.regions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>
              Notes <span className={`text-xs font-normal ${theme.tw.textMuted}`}>— optional</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this item..."
              rows={3}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 resize-none`}
            />
          </div>

        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 px-5 py-4 border-t ${theme.tw.borderDivider}`}>
          <button onClick={onClose} className={`text-sm px-4 py-2 rounded-lg border ${theme.tw.borderDivider} ${theme.tw.textMuted}`}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            className={`text-sm px-4 py-2 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors ${!name.trim() || saving ? theme.tw.btnDisabled : ''}`}
          >
            {saving ? 'Adding...' : 'Add item'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddItemModal