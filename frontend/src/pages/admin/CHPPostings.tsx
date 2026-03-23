import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Posting {
  id: string
  type: 'announcement' | 'newsletter'
  title: string
  description: string | null
  image_url: string | null
  audience: string
  published_at: string | null
  created_at: string
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const emptyForm = {
  type: 'announcement' as 'announcement' | 'newsletter',
  title: '',
  description: '',
  audience: 'chp' as 'chp' | 'all',
}

export default function CHPPostings() {
  const [postings, setPostings] = useState<Posting[]>([])
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
      const { data } = await supabase
        .from('postings')
        .select('*')
        .in('audience', ['chp', 'all'])
        .in('type', ['announcement', 'newsletter'])
        .order('created_at', { ascending: false })
      setPostings((data as Posting[]) ?? [])
    } catch { }
    clearTimeout(timeout)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(publish: boolean) {
    if (!form.title) return
    setSaving(true)

    let image_url: string | null = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `postings/${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('media').upload(path, imageFile, { upsert: true })
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        image_url = publicUrl
      }
    }

    const payload = {
      type: form.type,
      title: form.title,
      description: form.type === 'newsletter' ? null : (form.description || null),
      image_url,
      audience: form.audience,
      event_date: null,
      apply_link: null,
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

  async function togglePublish(p: Posting) {
    await supabase.from('postings').update({
      published_at: p.published_at ? null : new Date().toISOString(),
    }).eq('id', p.id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this posting?')) return
    await supabase.from('postings').delete().eq('id', id)
    load()
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">CHP Postings</h1>
          <p className="text-gray-500 text-sm mt-1">Announcements and newsletters for Community Host Partners</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true) }}
            className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors"
          >
            + New CHP Posting
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-cc-blue">{editing ? 'Edit Posting' : 'New CHP Posting'}</h2>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-3">
              {(['announcement', 'newsletter'] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.type === t ? 'bg-cc-blue text-white border-cc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-cc-blue'
                  }`}>
                  {t === 'announcement' ? 'Announcement' : 'Newsletter'}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
            <div className="flex gap-3">
              {([['chp', 'CHPs only'], ['all', 'Everyone (Fellows + CHPs)']] as const).map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setForm(f => ({ ...f, audience: val }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.audience === val ? 'bg-cc-blue text-white border-cc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-cc-blue'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                placeholder={form.type === 'newsletter' ? 'e.g. Spring 2025 CHP Newsletter' : 'e.g. Site Visit Schedule Update'} />
            </div>

            {form.type === 'announcement' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-none"
                  placeholder="Write your announcement here…" />
              </div>
            )}

            {form.type === 'newsletter' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Image (PNG/JPG)</label>
                <input ref={fileRef} type="file" accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cc-blue file:text-white hover:file:bg-cc-blue-navy cursor-pointer" />
                {imageFile && <p className="text-xs text-green-600 mt-1">Ready to upload: {imageFile.name}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1 flex-wrap">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors disabled:opacity-50">
              {saving ? 'Posting…' : 'Post Now'}
            </button>
            <button onClick={cancelForm}
              className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : postings.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No CHP postings yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {postings.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-start gap-4">
                  {p.image_url && (
                    <img src={p.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === 'announcement' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.type === 'announcement' ? 'Announcement' : 'Newsletter'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                        {p.audience === 'all' ? 'Everyone' : 'CHPs only'}
                      </span>
                      {p.published_at ? (
                        <span className="text-xs text-green-600 font-medium">Published {fmt(p.published_at)}</span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Draft</span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800">{p.title}</p>
                    {p.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => togglePublish(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${p.published_at ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                      {p.published_at ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
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
