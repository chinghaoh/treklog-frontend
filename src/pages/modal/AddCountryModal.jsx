import { useState, useEffect } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'

function AddCountryModal({ onClose, onRefresh }) {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('want_to_visit')
  const [visitedAt, setVisitedAt] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    client.get('/countries/')
      .then(res => setCountries(Array.isArray(res.data) ? res.data : res.data.results ?? []))
  }, [])

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  const handleSelect = (country) => {
    setSelected(country)
    setSearch(country.name)
    setShowDropdown(false)
  }

  const handleSubmit = () => {
    if (!selected) return
    setSaving(true)
    client.post('/my-countries/', {
      country_id: selected.id,
      status,
      visited_at: visitedAt || null,
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
            <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Add country</p>
          </div>
          <button onClick={onClose} className={`text-lg ${theme.tw.textMuted} hover:${theme.tw.textMain}`}>×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Country search */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Country</p>
            <div className="relative">
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true); setSelected(null) }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search countries..."
                className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
              />
              {showDropdown && search && filtered.length > 0 && (
                <div className={`absolute top-10 left-0 right-0 ${theme.tw.surface} border ${theme.tw.borderDivider} rounded-lg overflow-hidden z-10 shadow-lg`}>
                  {filtered.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm ${theme.tw.textMain} ${theme.tw.cardHover} cursor-pointer border-b ${theme.tw.borderDivider} last:border-0`}
                    >
                      <img src={`https://flagcdn.com/24x18/${c.iso_code.toLowerCase()}.png`} className="rounded-sm" />
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>Status</p>
            <div className="flex gap-2">
              {[
                { key: 'visited', label: 'Visited' },
                { key: 'want_to_visit', label: 'Want to visit' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    status === s.key
                      ? `border-2 border-teal-500 bg-teal-500/10 text-teal-500 font-medium`
                      : `border ${theme.tw.borderDivider} ${theme.tw.textMuted}`
                  }`}
                >
                  {s.label}
                </button>
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

          {/* Notes */}
          <div>
            <p className={`text-xs font-semibold ${theme.tw.textMain} mb-1.5`}>
              Notes <span className={`text-xs font-normal ${theme.tw.textMuted}`}>— optional</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this country..."
              rows={3}
              className={`w-full text-sm px-3 py-2 rounded-lg ${theme.tw.surfaceSunk} ${theme.tw.textMain} border ${theme.tw.borderDivider} focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 resize-none`}
            />
          </div>

        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 px-5 py-4 border-t ${theme.tw.borderDivider}`}>
          <button
            onClick={onClose}
            className={`text-sm px-4 py-2 rounded-lg border ${theme.tw.borderDivider} ${theme.tw.textMuted}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selected || saving}
            className={`text-sm px-4 py-2 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors ${!selected || saving ? theme.tw.btnDisabled : ''}`}
          >
            {saving ? 'Adding...' : 'Add country'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddCountryModal