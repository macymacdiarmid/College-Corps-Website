import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Fellow {
  email: string
  name: string
  site_name: string
  site_supervisor: string
  cohort: string
  hours_required_total: number
  hours_required_monthly: number
  monthly_deadline_day: number
  total_hours?: number
}

const cohortLabel: Record<string, string> = {
  food: 'Food Insecurity', climate: 'Climate Action',
  health: 'Healthy Futures', k12: 'K-12 Education',
}
const cohortColor: Record<string, string> = {
  food: 'bg-orange-100 text-orange-700', climate: 'bg-green-100 text-green-700',
  health: 'bg-red-100 text-red-700',     k12: 'bg-blue-100 text-blue-700',
}

const emptyForm = {
  email: '', name: '', site_name: '', site_supervisor: '',
  cohort: 'food', hours_required_total: 450, hours_required_monthly: 45, monthly_deadline_day: 1,
}

export default function Fellows() {
  const [fellows, setFellows] = useState<Fellow[]>([])
  const [cohortFilter, setCohortFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [logForm, setLogForm] = useState<{ email: string; hours: string; date: string; description: string } | null>(null)
  const [loggingHours, setLoggingHours] = useState(false)

  async function load() {
    const timeout = setTimeout(() => setLoading(false), 10000)
    try {
      const { data: fellowData } = await supabase.from('fellow_users').select('*').order('name')
      const { data: logData } = await supabase.from('hour_logs').select('fellow_email, hours')
      const hoursByFellow: Record<string, number> = {}
      logData?.forEach(l => {
        hoursByFellow[l.fellow_email] = (hoursByFellow[l.fellow_email] ?? 0) + Number(l.hours)
      })
      setFellows((fellowData ?? []).map(f => ({ ...f, total_hours: hoursByFellow[f.email] ?? 0 })))
    } catch { /* leave state empty */ }
    clearTimeout(timeout)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!form.email || !form.name) return
    setSaving(true)
    if (editing) {
      await supabase.from('fellow_users').update({
        name: form.name, site_name: form.site_name, site_supervisor: form.site_supervisor,
        cohort: form.cohort, hours_required_total: form.hours_required_total,
        hours_required_monthly: form.hours_required_monthly, monthly_deadline_day: form.monthly_deadline_day,
      }).eq('email', editing)
    } else {
      await supabase.from('fellow_users').insert({ ...form })
    }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false); load()
  }

  async function handleDelete(email: string) {
    if (!confirm(`Remove ${email} as a fellow?`)) return
    await supabase.from('fellow_users').delete().eq('email', email)
    load()
  }

  function startEdit(f: Fellow) {
    setEditing(f.email)
    setForm({ email: f.email, name: f.name, site_name: f.site_name, site_supervisor: f.site_supervisor,
      cohort: f.cohort, hours_required_total: f.hours_required_total,
      hours_required_monthly: f.hours_required_monthly, monthly_deadline_day: f.monthly_deadline_day })
    setShowForm(true)
  }

  async function handleLogHours() {
    if (!logForm || !logForm.hours || !logForm.date) return
    setLoggingHours(true)
    await supabase.from('hour_logs').insert({
      fellow_email: logForm.email, hours: parseFloat(logForm.hours),
      log_date: logForm.date, description: logForm.description || null,
    })
    setLogForm(null); setLoggingHours(false); load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Fellows</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all active fellows</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={cohortFilter}
            onChange={e => setCohortFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
          >
            <option value="all">All Cohorts</option>
            <option value="none">No Cohort</option>
            {Object.entries(cohortLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          {!showForm && (
            <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true) }}
              className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors">
              + Add Fellow
            </button>
          )}
        </div>
      </div>

      {/* Total count card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500 mb-1">Total Fellows</p>
          <p className="text-4xl font-bold text-cc-blue">{fellows.length}</p>
        </div>
        {Object.entries(cohortLabel).map(([key, label]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-4xl font-bold text-cc-blue">{fellows.filter(f => f.cohort === key).length}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-cc-blue">{editing ? 'Edit Fellow' : 'Add Fellow'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" placeholder="fellow@gmail.com" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site / Organization</label>
              <input type="text" value={form.site_name} onChange={e => setForm(f => ({ ...f, site_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Supervisor</label>
              <input type="text" value={form.site_supervisor} onChange={e => setForm(f => ({ ...f, site_supervisor: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cohort</label>
              <select value={form.cohort} onChange={e => setForm(f => ({ ...f, cohort: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue">
                {Object.entries(cohortLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours Required</label>
              <input type="number" value={form.hours_required_total} onChange={e => setForm(f => ({ ...f, hours_required_total: +e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Hours Required</label>
              <input type="number" value={form.hours_required_monthly} onChange={e => setForm(f => ({ ...f, hours_required_monthly: +e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Deadline (day of month)</label>
              <input type="number" min={1} max={28} value={form.monthly_deadline_day} onChange={e => setForm(f => ({ ...f, monthly_deadline_day: +e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Fellow'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}
              className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Log hours modal */}
      {logForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border-2 border-cc-orange">
          <h2 className="font-bold text-cc-blue">Log Hours for {logForm.email}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input type="number" step="0.5" min="0.5" value={logForm.hours}
                onChange={e => setLogForm(f => f ? { ...f, hours: e.target.value } : f)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={logForm.date}
                onChange={e => setLogForm(f => f ? { ...f, date: e.target.value } : f)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={logForm.description}
                onChange={e => setLogForm(f => f ? { ...f, description: e.target.value } : f)}
                placeholder="e.g. Food pantry shift"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogHours} disabled={loggingHours}
              className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors disabled:opacity-50">
              {loggingHours ? 'Logging…' : 'Log Hours'}
            </button>
            <button onClick={() => setLogForm(null)}
              className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : fellows.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No fellows added yet.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Fellow</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Site</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Cohort</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Hours</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fellows.filter(f =>
                cohortFilter === 'all' ? true :
                cohortFilter === 'none' ? !f.cohort :
                f.cohort === cohortFilter
              ).map(f => (
                <tr key={f.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{f.site_name || '—'}</p>
                    <p className="text-xs text-gray-400">{f.site_supervisor || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cohortColor[f.cohort]}`}>
                      {cohortLabel[f.cohort]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cc-orange rounded-full"
                          style={{ width: `${Math.min(100, ((f.total_hours ?? 0) / f.hours_required_total) * 100)}%` }} />
                      </div>
                      <span className="text-gray-700 font-medium">{(f.total_hours ?? 0).toFixed(1)}</span>
                      <span className="text-gray-400">/ {f.hours_required_total}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setLogForm({ email: f.email, hours: '', date: new Date().toISOString().split('T')[0], description: '' })}
                        className="text-xs px-3 py-1.5 rounded-lg bg-cc-orange text-white hover:bg-cc-orange-dark transition-colors">
                        Log Hours
                      </button>
                      <button onClick={() => startEdit(f)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-cc-blue text-white hover:bg-cc-blue-navy transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(f.email)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
