import { useState } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'

const TYPES = [
  { key: 'city', label: 'City' },
  { key: 'province', label: 'Province' },
  { key: 'region', label: 'Region' },
  { key: 'island', label: 'Island' },
  { key: 'other', label: 'Other' },
]

function EditRegionModal({ region, onClose, onRefresh }) {
  const [name, setName] = useState(region.name)
  const [type, setType] = useState(region.type)
  const [saving, setSaving] = useState(false)

  const handleSubmit = () => {
    setSaving(true)
    client.patch(`/regions/${region.id}/`, { name, type })
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
          <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Edit region</p>
          <button onClick={onClose} className={`text-lg ${theme.tw.textMuted}`}>×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>

          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Type</p>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    type === t.key ? theme.tw.pillActive : `${theme.tw.surface} ${theme.tw.navInactive} ${theme.tw.textMain}`
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default EditRegionModal