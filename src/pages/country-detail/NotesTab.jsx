import { useState } from 'react'
import { theme } from '../../theme'
import client from '../../api/client'

function NotesTab({ entry, onRefresh }) {
  const [notes, setNotes] = useState(entry.notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    client.patch(`/my-countries/${entry.id}/`, { notes })
      .then(() => {
        setSaving(false)
        setSaved(true)
        onRefresh()
        setTimeout(() => setSaved(false), 2000)
      })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`${theme.tw.surface} ${theme.tw.border} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-semibold ${theme.tw.textMain}`}>Country notes</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`text-sm px-3 py-1.5 rounded-lg ${theme.tw.primaryBg} ${theme.tw.primaryHover} text-white transition-colors ${saving ? theme.tw.btnDisabled : ''}`}
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add notes about this country — best time to visit, tips, reminders..."
          rows={8}
          className={`w-full text-sm ${theme.tw.surfaceSunk} ${theme.tw.textMain} rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
        />
      </div>
    </div>
  )
}

export default NotesTab