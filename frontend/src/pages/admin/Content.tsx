import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Section {
  section: string
  label: string
  fields: { key: string; label: string; type: 'text' | 'textarea' }[]
}

const SECTIONS: Section[] = [
  {
    section: 'home_hero',
    label: 'Home Page — Hero',
    fields: [
      { key: 'title',    label: 'Headline',    type: 'textarea' },
      { key: 'subtitle', label: 'Subheading',  type: 'textarea' },
      { key: 'cta',      label: 'Button Text', type: 'text' },
    ],
  },
  {
    section: 'home_about',
    label: 'Home Page — About Section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body',    label: 'Body Text', type: 'textarea' },
    ],
  },
]

export default function Content() {
  const [data, setData] = useState<Record<string, Record<string, string>>>({})
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('section, content')
      .then(({ data: rows }) => {
        const parsed: Record<string, Record<string, string>> = {}
        rows?.forEach(r => { parsed[r.section] = r.content })
        setData(parsed)
        setEdits(parsed)
        setLoading(false)
      })
  }, [])

  function handleChange(section: string, key: string, value: string) {
    setEdits(e => ({
      ...e,
      [section]: { ...e[section], [key]: value },
    }))
  }

  function isDirty(section: string) {
    const orig = data[section] ?? {}
    const edit = edits[section] ?? {}
    return JSON.stringify(orig) !== JSON.stringify(edit)
  }

  async function handleSave(section: string) {
    setSaving(section)
    await supabase
      .from('site_content')
      .upsert({ section, content: edits[section], updated_at: new Date().toISOString() })
    setData(d => ({ ...d, [section]: edits[section] }))
    setSaving(null)
    setSaved(section)
    setTimeout(() => setSaved(null), 2500)
  }

  if (loading) return <div className="text-gray-400">Loading…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">Site Content</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the text content displayed on the public website</p>
      </div>

      {SECTIONS.map(s => (
        <div key={s.section} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-cc-blue">{s.label}</h2>
            {saved === s.section && (
              <span className="text-xs text-green-600 font-medium">Saved!</span>
            )}
          </div>

          {s.fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={edits[s.section]?.[f.key] ?? ''}
                  onChange={e => handleChange(s.section, f.key, e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={edits[s.section]?.[f.key] ?? ''}
                  onChange={e => handleChange(s.section, f.key, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                />
              )}
            </div>
          ))}

          <button
            onClick={() => handleSave(s.section)}
            disabled={!isDirty(s.section) || saving === s.section}
            className="px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-40"
          >
            {saving === s.section ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      ))}

      <div className="bg-cc-blue-dark/5 border border-cc-blue/20 rounded-xl p-5">
        <p className="text-sm text-cc-blue font-medium mb-1">Adding images to pages</p>
        <p className="text-sm text-gray-500">
          Upload photos in the <strong>Media Library</strong> tab, then copy the URL and paste it into your page code. More page sections will be added here over time.
        </p>
      </div>
    </div>
  )
}
