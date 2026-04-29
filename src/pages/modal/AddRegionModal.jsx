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

function AddRegionModal({ entry, onClose, onRefresh }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('city')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [validation, setValidation] = useState(null) 

  const validateRegion = async (value) => {
    if (!value.trim()) { setValidation(null); return }
    setValidation('checking')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)},${encodeURIComponent(entry.country.name)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'Treklog/1.0' } }
      )
      const data = await res.json()
      setValidation(data.length > 0 ? 'found' : 'not_found')
    } catch {
      setValidation(null)
    }
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    clearTimeout(window._regionValidateTimer)
    window._regionValidateTimer = setTimeout(() => validateRegion(e.target.value), 800)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    setSaving(true)
    client.post(`/my-countries/${entry.id}/regions/`, { name, type, notes })
      .then(res => {
        client.post(`/my-countries/${entry.id}/regions/${res.data.id}/fetch-boundary/`)
          .catch(() => {})
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
            <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Add region</p>
            <p className={`text-xs ${theme.tw.textMuted} mt-0.5`}>Adding to {entry.country.name}</p>
          </div>
          <button onClick={onClose} className={`text-lg ${theme.tw.textMuted}`}>×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Name */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Region name</p>
            <input
              value={name}
              onChange={handleNameChange}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${
                validation === 'found' ? 'border-teal-500' :
                validation === 'not_found' ? 'border-red-500' :
                theme.tw.borderDivider
              } focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
            />
            {validation === 'checking' && <p className={`text-xs ${theme.tw.textMuted} mt-1`}>Checking...</p>}
            {validation === 'found' && <p className="text-xs text-teal-500 mt-1">✓ Found in {entry.country.name}</p>}
            {validation === 'not_found' && <p className="text-xs text-red-500 mt-1">✗ "{name}" was not found in {entry.country.name}. Check the spelling.</p>}
          </div>

          {/* Type */}
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

          {/* Notes */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>
              Notes <span className={`text-xs font-normal ${theme.tw.textMuted}`}>— optional</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this region..."
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
            {saving ? 'Adding...' : 'Add region'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddRegionModal