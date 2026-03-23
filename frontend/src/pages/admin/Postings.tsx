import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Posting {
  id: string
  type: 'service_opportunity' | 'event' | 'newsletter' | 'announcement'
  title: string
  description: string | null
  image_url: string | null
  event_date: string | null
  apply_link: string | null
  published_at: string | null
  created_at: string
}

const typeLabel: Record<string, string> = {
  service_opportunity: 'Service Opportunity',
  event: 'Event',
  newsletter: 'Newsletter',
  announcement: 'Announcement',
}
const typeColor: Record<string, string> = {
  service_opportunity: 'bg-green-100 text-green-700',
  event: 'bg-purple-100 text-purple-700',
  newsletter: 'bg-blue-100 text-blue-700',
  announcement: 'bg-yellow-100 text-yellow-700',
}

const emptyForm = {
  type: 'service_opportunity' as 'service_opportunity' | 'event' | 'newsletter' | 'announcement',
  title: '',
  description: '',
  image_url: '',
  event_date: '',
  apply_link: '',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Postings() {
  const [postings, setPostings] = useState<Posting[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const timeout = setTimeout(() => setLoading(false), 10000)
    try {
      const { data } = await supabase.from('postings').select('*').order('created_at', { ascending: false })
      setPostings((data as Posting[]) ?? [])
    } catch {
      // leave postings empty
    }
    clearTimeout(timeout)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(publish: boolean) {
    if (!form.title) return
    setSaving(true)

    let image_url = form.image_url || null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `postings/${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('media').upload(path, imageFile, { upsert: true })
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        image_url = publicUrl
      }
    }

    const noExtras = form.type === 'newsletter' || form.type === 'announcement'
    const payload = {
      type: form.type,
      title: form.title,
      description: form.type === 'newsletter' ? null : (form.description || null),
      image_url: form.type === 'announcement' ? null : image_url,
      event_date: noExtras ? null : (form.event_date || null),
      apply_link: noExtras ? null : (form.apply_link || null),
      published_at: publish ? new Date().toISOString() : null,
    }

    if (editing) {
      await supabase.from('postings').update(payload).eq('id', editing)
    } else {
      await supabase.from('postings').insert(payload)
    }

    setForm(emptyForm)
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setEditing(null)
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this posting?')) return
    await supabase.from('postings').delete().eq('id', id)
    load()
  }

  async function togglePublish(p: Posting) {
    await supabase.from('postings').update({
      published_at: p.published_at ? null : new Date().toISOString(),
    }).eq('id', p.id)
    load()
  }

  function startEdit(p: Posting) {
    setEditing(p.id)
    setForm({
      type: p.type,
      title: p.title,
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      event_date: p.event_date ? p.event_date.slice(0, 16) : '',
      apply_link: p.apply_link ?? '',
    })
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const isNewsletter = form.type === 'newsletter'
  const isAnnouncement = form.type === 'announcement'
  const filtered = postings.filter(p => filter === 'all' || p.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Postings</h1>
          <p className="text-gray-500 text-sm mt-1">{postings.length} total postings</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true) }}
            className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors"
          >
            + New Posting
          </button>
        )}
      </div>

      {/* Filter tabs */}
      {!showForm && (
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All' },
            { value: 'service_opportunity', label: 'Service Opportunities' },
            { value: 'event', label: 'Events' },
            { value: 'newsletter', label: 'Newsletters' },
            { value: 'announcement', label: 'Announcements' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-cc-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-cc-blue">{editing ? 'Edit Posting' : 'New Posting'}</h2>

          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-3 flex-wrap">
              {(['service_opportunity', 'event', 'newsletter', 'announcement'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.type === t
                      ? 'bg-cc-blue text-white border-cc-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-cc-blue'
                  }`}
                >
                  {typeLabel[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                placeholder={isNewsletter ? 'e.g. Spring 2025 Newsletter' : 'e.g. SLO Food Bank Volunteer Shift'}
              />
            </div>

            {/* Description — not for newsletter */}
            {!isNewsletter && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-none"
                  placeholder="Describe the opportunity or event…"
                />
              </div>
            )}

            {/* Image upload — not for announcements */}
            {!isAnnouncement && <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isNewsletter ? 'Newsletter Image (PNG/JPG)' : 'Image (optional)'}
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cc-blue file:text-white hover:file:bg-cc-blue-navy cursor-pointer"
              />
              {form.image_url && !imageFile && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <p className="text-xs text-gray-400">Current image. Upload a new one to replace.</p>
                </div>
              )}
              {imageFile && <p className="text-xs text-green-600 mt-1">Ready to upload: {imageFile.name}</p>}
            </div>}

            {/* Date & Time — not for newsletter or announcement */}
            {!isNewsletter && !isAnnouncement && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.event_date}
                  onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                />
              </div>
            )}

            {/* Apply/RSVP link — not for newsletter or announcement */}
            {!isNewsletter && !isAnnouncement && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply / RSVP Link</label>
                <input
                  type="url"
                  value={form.apply_link}
                  onChange={e => setForm(f => ({ ...f, apply_link: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                  placeholder="https://…"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1 flex-wrap">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Posting…' : 'Post Now'}
            </button>
            <button
              onClick={cancelForm}
              className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Postings list */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No postings yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-start gap-4">
                  {p.image_url && (
                    <img src={p.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[p.type]}`}>
                        {typeLabel[p.type]}
                      </span>
                      {p.published_at ? (
                        <span className="text-xs text-green-600 font-medium">Published {fmt(p.published_at)}</span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Draft</span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800">{p.title}</p>
                    {p.event_date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(p.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    )}
                    {p.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        p.published_at
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {p.published_at ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-cc-blue text-white hover:bg-cc-blue-navy transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
