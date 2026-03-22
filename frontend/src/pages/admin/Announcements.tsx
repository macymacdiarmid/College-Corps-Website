import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Announcement {
  id: string
  title: string
  body: string
  type: string
  published_at: string | null
  created_at: string
}

const typeOptions = [
  { value: 'general',             label: 'General Update' },
  { value: 'service_opportunity', label: 'Service Opportunity' },
  { value: 'deadline',            label: 'Deadline' },
]
const typeColor: Record<string, string> = {
  general: 'bg-cc-blue/10 text-cc-blue',
  service_opportunity: 'bg-green-100 text-green-700',
  deadline: 'bg-red-100 text-red-700',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const emptyForm = { title: '', body: '', type: 'general' }

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function load() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!form.title || !form.body) return
    setSaving(true)
    if (editing) {
      await supabase.from('announcements').update({ title: form.title, body: form.body, type: form.type }).eq('id', editing)
    } else {
      await supabase.from('announcements').insert({ title: form.title, body: form.body, type: form.type })
    }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    load()
  }

  async function handlePublish(id: string, isPublished: boolean) {
    await supabase.from('announcements')
      .update({ published_at: isPublished ? null : new Date().toISOString() }).eq('id', id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  function startEdit(a: Announcement) {
    setEditing(a.id); setForm({ title: a.title, body: a.body, type: a.type }); setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Post updates and service opportunities to fellows</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          {!showForm && (
            <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true) }}
              className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors">
              + New Announcement
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-cc-blue">{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" placeholder="Announcement title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue">
                {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-y" placeholder="Announcement details..." />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}
              className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No announcements yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(a => (
              <div key={a.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[a.type]}`}>
                      {typeOptions.find(o => o.value === a.type)?.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.published_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.published_at ? `Live · ${fmt(a.published_at)}` : 'Draft'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handlePublish(a.id, !!a.published_at)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${a.published_at ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                    {a.published_at ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => startEdit(a)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-cc-blue text-white hover:bg-cc-blue-navy transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
