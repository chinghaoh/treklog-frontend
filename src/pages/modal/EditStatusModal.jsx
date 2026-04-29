import { useState } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'

const STATUSES = [
  { key: 'want_to_visit', label: 'Want to visit', description: 'Added to your bucket list' },
  { key: 'visited', label: 'Visited', description: 'Mark as visited — you can add a visited date' },
]

function EditStatusModal({ entry, onClose, onRefresh }) {
  const [status, setStatus] = useState(entry.status)
  const [visitedAt, setVisitedAt] = useState(entry.visited_at || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = () => {
    setSaving(true)
    client.patch(`/my-countries/${entry.id}/`, {
      status,
      visited_at: status === 'visited' ? (visitedAt || null) : null,
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
            <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Edit status</p>
            <p className={`text-xs ${theme.tw.textMuted} mt-0.5`}>{entry.country.name}</p>
          </div>
          <button onClick={onClose} className={`text-lg ${theme.tw.textMuted}`}>×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Status options */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-2`}>Status</p>
            <div className="flex flex-col gap-2">
              {STATUSES.map(s => (
                <div
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    status === s.key
                      ? 'border-2 border-teal-500 bg-teal-500/10'
                      : `border ${theme.tw.borderDivider}`
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
                    status === s.key ? 'bg-teal-500' : `border ${theme.tw.borderDivider}`
                  }`}></div>
                  <div>
                    <p className={`text-sm font-medium ${status === s.key ? 'text-teal-500' : theme.tw.textMain}`}>{s.label}</p>
                    <p className={`text-xs ${theme.tw.textMuted} mt-0.5`}>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visited date */}
          {status === 'visited' && (
            <div>
              <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>
                Visited date <span className={`text-xs font-normal ${theme.tw.textMuted}`}>— optional</span>
              </p>
              <input
                type="date"
                value={visitedAt}
                onChange={e => setVisitedAt(e.target.value)}
                className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 px-5 py-4 border-t ${theme.tw.borderDivider}`}>
          <button onClick={onClose} className={`text-sm px-4 py-2 rounded-lg border ${theme.tw.borderDivider} ${theme.tw.textMuted}`}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`text-sm px-4 py-2 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors ${saving ? theme.tw.btnDisabled : ''}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default EditStatusModal