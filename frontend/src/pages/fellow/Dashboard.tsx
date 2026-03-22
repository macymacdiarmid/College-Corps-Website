import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface FellowProfile {
  email: string
  name: string
  site_name: string
  site_supervisor: string
  cohort: string
  start_date: string
  hours_required_total: number
  hours_required_monthly: number
  monthly_deadline_day: number
}

interface HourLog {
  id: string
  log_date: string
  hours: number
  description: string | null
}

interface Newsletter {
  id: string
  title: string
  content: string
  pdf_url: string | null
  published_at: string
}

interface Announcement {
  id: string
  title: string
  body: string
  type: string
  published_at: string
}

const cohortLabel: Record<string, string> = {
  food: 'Food Insecurity', climate: 'Climate Action',
  health: 'Healthy Futures', k12: 'K-12 Education',
}
const cohortColor: Record<string, string> = {
  food: 'bg-orange-100 text-orange-700', climate: 'bg-green-100 text-green-700',
  health: 'bg-red-100 text-red-700',     k12: 'bg-blue-100 text-blue-700',
}
const typeLabel: Record<string, string> = {
  general: 'Update', service_opportunity: 'Service Opportunity', deadline: 'Deadline',
}
const typeColor: Record<string, string> = {
  general: 'bg-cc-blue/10 text-cc-blue',
  service_opportunity: 'bg-green-100 text-green-700',
  deadline: 'bg-red-100 text-red-700',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function nextDeadline(day: number): string {
  const now = new Date()
  const deadline = new Date(now.getFullYear(), now.getMonth(), day)
  if (deadline <= now) deadline.setMonth(deadline.getMonth() + 1)
  return deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function FellowDashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<FellowProfile | null>(null)
  const [logs, setLogs] = useState<HourLog[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/auth/callback', { replace: true }); return }

    async function load() {
      const [profileRes, logsRes, announcementsRes, newslettersRes] = await Promise.all([
        supabase.from('fellow_users').select('*').eq('email', user!.email).single(),
        supabase.from('hour_logs').select('*').eq('fellow_email', user!.email).order('log_date', { ascending: false }),
        supabase.from('announcements').select('*').lte('published_at', new Date().toISOString()).order('published_at', { ascending: false }).limit(10),
        supabase.from('newsletters').select('*').not('published_at', 'is', null).order('published_at', { ascending: false }),
      ])
      setProfile(profileRes.data)
      setLogs(logsRes.data ?? [])
      setAnnouncements(announcementsRes.data ?? [])
      setNewsletters(newslettersRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cc-blue-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cc-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md">
          <p className="text-gray-500">Your fellow profile isn't set up yet. Contact your program coordinator.</p>
          <button onClick={handleSignOut} className="mt-4 text-sm text-red-500 hover:underline">Sign out</button>
        </div>
      </div>
    )
  }

  // Compute hours
  const totalLogged = logs.reduce((sum, l) => sum + Number(l.hours), 0)
  const totalRemaining = Math.max(0, profile.hours_required_total - totalLogged)
  const totalPct = Math.min(100, (totalLogged / profile.hours_required_total) * 100)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthlyLogged = logs
    .filter(l => new Date(l.log_date) >= monthStart)
    .reduce((sum, l) => sum + Number(l.hours), 0)
  const monthlyRemaining = Math.max(0, profile.hours_required_monthly - monthlyLogged)
  const monthlyPct = Math.min(100, (monthlyLogged / profile.hours_required_monthly) * 100)

  const serviceOpps = announcements.filter(a => a.type === 'service_opportunity')
  const otherAnnouncements = announcements.filter(a => a.type !== 'service_opportunity')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-cc-blue-dark text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-cc-orange font-bold text-xs uppercase tracking-widest">Fellow Portal</p>
            <p className="font-bold text-lg">Welcome, {profile.name.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs px-3 py-2 bg-cc-blue text-white rounded-lg hover:bg-cc-blue-medium transition-colors"
            >
              ← Main Site
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs px-3 py-2 bg-cc-blue-navy text-cc-blue-light rounded-lg hover:bg-cc-blue hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Site info card */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap gap-6 items-start">
          <div className="flex-1 min-w-48">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Service Site</p>
            <p className="text-xl font-bold text-cc-blue">{profile.site_name}</p>
            <p className="text-sm text-gray-500 mt-1">Supervisor: {profile.site_supervisor}</p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${cohortColor[profile.cohort]}`}>
              {cohortLabel[profile.cohort]}
            </span>
            {profile.start_date && (
              <p className="text-xs text-gray-400 mt-2">Started {fmt(profile.start_date)}</p>
            )}
          </div>
        </div>

        {/* Hours cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Total hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Total Hours Progress</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-cc-blue">{totalLogged.toFixed(1)}</span>
              <span className="text-gray-400 text-sm mb-1">/ {profile.hours_required_total} hrs</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cc-orange rounded-full transition-all"
                style={{ width: `${totalPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{totalRemaining.toFixed(1)} hours remaining to complete the program</p>
          </div>

          {/* Monthly hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">This Month's Hours</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-cc-blue">{monthlyLogged.toFixed(1)}</span>
              <span className="text-gray-400 text-sm mb-1">/ {profile.hours_required_monthly} hrs</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${monthlyPct >= 100 ? 'bg-green-500' : monthlyPct >= 70 ? 'bg-cc-orange' : 'bg-red-400'}`}
                style={{ width: `${monthlyPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {monthlyRemaining > 0
                ? <><span className="font-semibold text-red-500">{monthlyRemaining.toFixed(1)} hrs needed</span> by {nextDeadline(profile.monthly_deadline_day)}</>
                : <span className="font-semibold text-green-600">Monthly goal met!</span>
              }
            </p>
          </div>
        </div>

        {/* Recent hour logs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Recent Hours Logged</h2>
          </div>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No hours logged yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.slice(0, 8).map(l => (
                <div key={l.id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{l.description || 'Service hours'}</p>
                    <p className="text-xs text-gray-400">{fmt(l.log_date)}</p>
                  </div>
                  <span className="text-cc-blue font-bold flex-shrink-0">+{Number(l.hours).toFixed(1)} hrs</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements & Service Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General announcements */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-cc-blue">Announcements</h2>
            </div>
            {otherAnnouncements.length === 0 ? (
              <p className="text-gray-400 text-sm p-6">No announcements yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {otherAnnouncements.map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[a.type]}`}>
                        {typeLabel[a.type]}
                      </span>
                      <span className="text-xs text-gray-400">{fmt(a.published_at)}</span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{a.title}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service opportunities */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-cc-blue">Service Opportunities</h2>
            </div>
            {serviceOpps.length === 0 ? (
              <p className="text-gray-400 text-sm p-6">No service opportunities posted yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {serviceOpps.map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Service Opp</span>
                      <span className="text-xs text-gray-400">{fmt(a.published_at)}</span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{a.title}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Newsletters */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Newsletters</h2>
          </div>
          {newsletters.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No newsletters published yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {newsletters.map(n => (
                <div key={n.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">{n.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(n.published_at)}</p>
                  </div>
                  {n.pdf_url && (
                    <a
                      href={n.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs px-3 py-1.5 bg-cc-orange text-white rounded-lg hover:bg-cc-orange-dark transition-colors font-medium"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
