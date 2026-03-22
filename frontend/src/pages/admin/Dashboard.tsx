import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

interface Stats {
  totalApplicants: number
  byFood: number
  byClimate: number
  byHealth: number
  byK12: number
  totalContacts: number
  totalNewsletters: number
}

interface RecentApplication {
  id: string
  name: string
  email: string
  cohort: string
  created_at: string
}

interface RecentContact {
  id: string
  name: string
  email: string
  created_at: string
}

const cohortLabel: Record<string, string> = {
  food: 'Food Insecurity',
  climate: 'Climate Action',
  health: 'Healthy Futures',
  k12: 'K-12 Education',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([])
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [appsRes, contactsRes, newslettersRes] = await Promise.all([
        supabase.from('applications').select('cohort, created_at, id, name, email').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('id, name, email, created_at').order('created_at', { ascending: false }),
        supabase.from('newsletters').select('id', { count: 'exact', head: true }),
      ])

      const apps = appsRes.data ?? []
      const contacts = contactsRes.data ?? []

      setStats({
        totalApplicants: apps.length,
        byFood:    apps.filter(a => a.cohort === 'food').length,
        byClimate: apps.filter(a => a.cohort === 'climate').length,
        byHealth:  apps.filter(a => a.cohort === 'health').length,
        byK12:     apps.filter(a => a.cohort === 'k12').length,
        totalContacts: contacts.length,
        totalNewsletters: newslettersRes.count ?? 0,
      })
      setRecentApps(apps.slice(0, 5))
      setRecentContacts(contacts.slice(0, 5))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-gray-400">Loading…</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of College Corps activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Applicants', value: stats!.totalApplicants, color: 'bg-cc-blue' },
          { label: 'Contact Submissions', value: stats!.totalContacts, color: 'bg-cc-orange' },
          { label: 'Newsletters', value: stats!.totalNewsletters, color: 'bg-cc-blue-medium' },
          { label: 'Cohorts', value: 4, color: 'bg-cc-blue-navy' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className={`text-4xl font-bold text-cc-blue`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Applicants by cohort */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-cc-blue mb-5">Applicants by Cohort</h2>
        <div className="space-y-3">
          {[
            { label: 'Food Insecurity', count: stats!.byFood, total: stats!.totalApplicants },
            { label: 'Climate Action',  count: stats!.byClimate, total: stats!.totalApplicants },
            { label: 'Healthy Futures', count: stats!.byHealth, total: stats!.totalApplicants },
            { label: 'K-12 Education',  count: stats!.byK12, total: stats!.totalApplicants },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{c.label}</span>
                <span className="font-semibold text-cc-blue">{c.count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cc-orange rounded-full transition-all"
                  style={{ width: c.total ? `${(c.count / c.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-cc-blue">Recent Applications</h2>
            <Link to="/admin/applicants" className="text-xs text-cc-orange hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentApps.length === 0 && <p className="text-gray-400 text-sm">No applications yet.</p>}
            {recentApps.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400">{cohortLabel[a.cohort]} · {fmt(a.created_at)}</p>
                </div>
                <span className="text-xs bg-cc-blue-dark text-white px-2 py-0.5 rounded-full flex-shrink-0">{a.cohort}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-cc-blue">Recent Contact Submissions</h2>
            <Link to="/admin/contacts" className="text-xs text-cc-orange hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentContacts.length === 0 && <p className="text-gray-400 text-sm">No submissions yet.</p>}
            {recentContacts.map((c) => (
              <div key={c.id} className="min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.email} · {fmt(c.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
