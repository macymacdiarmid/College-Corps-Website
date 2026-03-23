import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface AccessUser {
  email: string
  name?: string
  org_name?: string
  created_at?: string
}

type Role = 'admin' | 'fellow' | 'chp'

const roleConfig: Record<Role, { label: string; color: string; badge: string }> = {
  admin:  { label: 'Admin',           color: 'bg-cc-blue text-white',          badge: 'bg-cc-blue/10 text-cc-blue' },
  fellow: { label: 'Fellow',          color: 'bg-cc-orange text-white',         badge: 'bg-orange-100 text-orange-700' },
  chp:    { label: 'Community Host Partner', color: 'bg-purple-600 text-white', badge: 'bg-purple-100 text-purple-700' },
}

const fmt = (iso?: string) => iso
  ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  : '—'

export default function AccessManager() {
  const [admins, setAdmins]   = useState<AccessUser[]>([])
  const [fellows, setFellows] = useState<AccessUser[]>([])
  const [chps, setCHPs]       = useState<AccessUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Role>('admin')

  // Add form state
  const [addEmail, setAddEmail]     = useState('')
  const [addName, setAddName]       = useState('')
  const [addOrg, setAddOrg]         = useState('')
  const [adding, setAdding]         = useState(false)
  const [addError, setAddError]     = useState('')

  async function load() {
    const timeout = setTimeout(() => setLoading(false), 10000)
    try {
      const [adminRes, fellowRes, chpRes] = await Promise.all([
        supabase.from('admin_users').select('email, created_at').order('created_at'),
        supabase.from('fellow_users').select('email, name, created_at').order('name'),
        supabase.from('chp_users').select('email, org_name, created_at').order('org_name'),
      ])
      setAdmins(adminRes.data ?? [])
      setFellows(fellowRes.data ?? [])
      setCHPs(chpRes.data ?? [])
    } catch { }
    clearTimeout(timeout)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    if (!addEmail.trim()) return
    setAdding(true)
    setAddError('')
    try {
      if (activeTab === 'admin') {
        const { error } = await supabase.from('admin_users').insert({ email: addEmail.trim().toLowerCase() })
        if (error) throw error
      } else if (activeTab === 'chp') {
        if (!addOrg.trim()) { setAddError('Organization name is required.'); setAdding(false); return }
        const { error } = await supabase.from('chp_users').insert({ email: addEmail.trim().toLowerCase(), org_name: addOrg.trim() })
        if (error) throw error
      } else {
        if (!addName.trim()) { setAddError('Name is required for fellows.'); setAdding(false); return }
        const { error } = await supabase.from('fellow_users').insert({
          email: addEmail.trim().toLowerCase(),
          name: addName.trim(),
          site_name: '', site_supervisor: '', cohort: 'food',
          hours_required_total: 450, hours_required_monthly: 45, monthly_deadline_day: 1,
        })
        if (error) throw error
      }
      setAddEmail(''); setAddName(''); setAddOrg('')
      load()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setAddError(msg.includes('duplicate') ? 'That email already has access.' : 'Failed to add. Try again.')
    }
    setAdding(false)
  }

  async function handleRemove(role: Role, email: string) {
    if (!confirm(`Remove ${email} from ${roleConfig[role].label} access?`)) return
    const table = role === 'admin' ? 'admin_users' : role === 'fellow' ? 'fellow_users' : 'chp_users'
    await supabase.from(table).delete().eq('email', email)
    load()
  }

  const currentList = activeTab === 'admin' ? admins : activeTab === 'fellow' ? fellows : chps
  const counts = { admin: admins.length, fellow: fellows.length, chp: chps.length }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">Access Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage who has access to each portal</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(roleConfig) as Role[]).map(role => (
          <div key={role} className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">{roleConfig[role].label}</p>
            <p className="text-4xl font-bold text-cc-blue">{counts[role]}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.keys(roleConfig) as Role[]).map(role => (
          <button
            key={role}
            onClick={() => { setActiveTab(role); setAddEmail(''); setAddName(''); setAddOrg(''); setAddError('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === role ? roleConfig[role].color : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {roleConfig[role].label} ({counts[role]})
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-cc-blue mb-4">Add {roleConfig[activeTab].label} Access</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
            <input
              type="email"
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="user@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
            />
          </div>
          {activeTab === 'fellow' && (
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
              <input
                type="text"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
              />
            </div>
          )}
          {activeTab === 'chp' && (
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-medium text-gray-600 mb-1">Organization name</label>
              <input
                type="text"
                value={addOrg}
                onChange={e => setAddOrg(e.target.value)}
                placeholder="SLO Food Bank"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
              />
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={adding || !addEmail}
            className="px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding…' : '+ Add Access'}
          </button>
        </div>
        {addError && <p className="text-red-500 text-sm mt-2">{addError}</p>}
        {activeTab === 'fellow' && (
          <p className="text-xs text-gray-400 mt-3">
            This grants portal access. To set the fellow's site, cohort, and hours, visit the{' '}
            <Link to="/admin/fellows" className="text-cc-blue underline">Fellows page</Link>.
          </p>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-cc-blue">{roleConfig[activeTab].label} Access ({currentList.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : currentList.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No {roleConfig[activeTab].label.toLowerCase()} accounts yet.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                {activeTab === 'fellow' && <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>}
                {activeTab === 'chp'    && <th className="text-left px-6 py-3 font-semibold text-gray-600">Organization</th>}
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Role</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Added</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentList.map(u => (
                <tr key={u.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.email}</td>
                  {activeTab === 'fellow' && <td className="px-6 py-4 text-gray-600">{u.name || '—'}</td>}
                  {activeTab === 'chp'    && <td className="px-6 py-4 text-gray-600">{u.org_name || '—'}</td>}
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleConfig[activeTab].badge}`}>
                      {roleConfig[activeTab].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{fmt(u.created_at)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemove(activeTab, u.email)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                    >
                      Revoke Access
                    </button>
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
