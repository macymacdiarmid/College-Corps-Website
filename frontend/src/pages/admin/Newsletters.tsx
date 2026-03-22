import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Newsletter {
  id: string
  title: string
  content: string
  pdf_url: string | null
  published_at: string | null
  created_at: string
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const emptyForm = { title: '', content: '', pdf_url: '' }

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false })
    setNewsletters(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('newsletters').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('newsletters').getPublicUrl(path)
      setForm(f => ({ ...f, pdf_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)
    const payload = { title: form.title, content: form.content, pdf_url: form.pdf_url || null }
    if (editing) {
      await supabase.from('newsletters').update(payload).eq('id', editing)
    } else {
      await supabase.from('newsletters').insert(payload)
    }
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handlePublish(id: string, currentlyPublished: boolean) {
    await supabase
      .from('newsletters')
      .update({ published_at: currentlyPublished ? null : new Date().toISOString() })
      .eq('id', id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this newsletter?')) return
    await supabase.from('newsletters').delete().eq('id', id)
    load()
  }

  function startEdit(n: Newsletter) {
    setEditing(n.id)
    setForm({ title: n.title, content: n.content, pdf_url: n.pdf_url ?? '' })
    setShowForm(true)
  }

  function cancelForm() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Newsletters</h1>
          <p className="text-gray-500 text-sm mt-1">{newsletters.length} total</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors"
          >
            + New Newsletter
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-cc-blue">{editing ? 'Edit Newsletter' : 'New Newsletter'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
              placeholder="Newsletter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={6}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-y"
              placeholder="Newsletter content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PDF Attachment (optional)</label>
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                uploading ? 'bg-gray-200 text-gray-400' : 'bg-cc-blue-light/20 text-cc-blue hover:bg-cc-blue-light/30'
              }`}>
                {uploading ? 'Uploading…' : 'Upload PDF'}
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading} />
              </label>
              {form.pdf_url && (
                <div className="flex items-center gap-2">
                  <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cc-orange hover:underline truncate max-w-xs">
                    View uploaded PDF
                  </a>
                  <button onClick={() => setForm(f => ({ ...f, pdf_url: '' }))} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button
              onClick={cancelForm}
              className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : newsletters.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No newsletters yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {newsletters.map((n) => (
              <div key={n.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-medium text-gray-800">{n.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.published_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {n.published_at ? `Published ${fmt(n.published_at)}` : 'Draft'}
                    </span>
                    {n.pdf_url && (
                      <a href={n.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cc-orange hover:underline">
                        PDF attached
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{n.content}</p>
                  <p className="text-xs text-gray-300 mt-1">Created {fmt(n.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handlePublish(n.id, !!n.published_at)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      n.published_at
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {n.published_at ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => startEdit(n)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-cc-blue text-white hover:bg-cc-blue-navy transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
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
