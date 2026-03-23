import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface CHPProfile {
  email: string
  org_name: string
}

interface Fellow {
  email: string
  name: string
  site_name: string
  cohort: string
  hours_required_total: number
  total_hours: number
}

interface Posting {
  id: string
  type: string
  title: string
  description: string | null
  image_url: string | null
  published_at: string
  audience: string
}

const cohortLabel: Record<string, string> = {
  food: 'Food Insecurity', climate: 'Climate Action',
  health: 'Healthy Futures', k12: 'K-12 Education',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function CHPPortal() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CHPProfile | null>(null)
  const [fellows, setFellows] = useState<Fellow[]>([])
  const [postings, setPostings] = useState<Posting[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/auth/callback', { replace: true }); return }

    async function load() {
      const [profileRes, fellowsRes, logsRes, postingsRes] = await Promise.all([
        supabase.from('chp_users').select('*').eq('email', user!.email).single(),
        supabase.from('fellow_users').select('*').eq('chp_email', user!.email),
        supabase.from('hour_logs').select('fellow_email, hours'),
        supabase.from('postings').select('*')
          .not('published_at', 'is', null)
          .lte('published_at', new Date().toISOString())
          .in('audience', ['chp', 'all'])
          .order('published_at', { ascending: false }),
      ])

      setProfile(profileRes.data)

      const hoursByFellow: Record<string, number> = {}
      logsRes.data?.forEach(l => {
        hoursByFellow[l.fellow_email] = (hoursByFellow[l.fellow_email] ?? 0) + Number(l.hours)
      })
      setFellows((fellowsRes.data ?? []).map(f => ({
        ...f,
        total_hours: hoursByFellow[f.email] ?? 0,
      })))
      setPostings((postingsRes.data as Posting[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, navigate])

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
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
          <p className="text-gray-500">Your CHP profile isn't set up yet. Contact your program coordinator.</p>
          <button onClick={handleSignOut} className="mt-4 text-sm text-red-500 hover:underline">Sign out</button>
        </div>
      </div>
    )
  }

  const announcements = postings.filter(p => p.type === 'announcement')
  const newsletters = postings.filter(p => p.type === 'newsletter')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-cc-blue-dark text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-cc-orange font-bold text-xs uppercase tracking-widest">CHP Portal</p>
            <p className="font-bold text-lg">{profile.org_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs px-3 py-2 bg-cc-blue text-white rounded-lg hover:bg-cc-blue-medium transition-colors">
              ← Main Site
            </Link>
            <button onClick={handleSignOut} className="text-xs px-3 py-2 bg-cc-blue-navy text-cc-blue-light rounded-lg hover:bg-cc-blue hover:text-white transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Fellows */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-cc-blue">Your Assigned Fellows</h2>
            <span className="text-sm text-gray-400">{fellows.length} fellow{fellows.length !== 1 ? 's' : ''}</span>
          </div>
          {fellows.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No fellows have been assigned to your organization yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {fellows.map(f => {
                const pct = Math.min(100, (f.total_hours / f.hours_required_total) * 100)
                return (
                  <div key={f.email} className="px-6 py-5 flex flex-wrap gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-cc-blue-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {f.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-48">
                      <p className="font-semibold text-gray-800">{f.name}</p>
                      <p className="text-xs text-gray-400">{cohortLabel[f.cohort] ?? f.cohort}</p>
                    </div>
                    <div className="flex-1 min-w-48">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Hours Progress</span>
                        <span className="font-semibold text-cc-blue">{f.total_hours.toFixed(1)} / {f.hours_required_total}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cc-orange rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}% complete</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Announcements</h2>
          </div>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No announcements yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {announcements.map(a => (
                <div key={a.id} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🔔</span>
                    <span className="text-xs text-gray-400">{fmtDateTime(a.published_at)}</span>
                  </div>
                  <p className="font-medium text-gray-800">{a.title}</p>
                  {a.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletters */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Newsletters</h2>
          </div>
          {newsletters.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No newsletters published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
              {newsletters.map(n => (
                <div key={n.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  {n.image_url && (
                    <img src={n.image_url} alt={n.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(n.published_at)}</p>
                    {n.image_url && (
                      <button
                        onClick={() => setLightbox(n.image_url)}
                        className="inline-block mt-3 text-xs px-3 py-1.5 bg-cc-blue text-white rounded-lg hover:bg-cc-blue-navy transition-colors font-medium"
                      >
                        View Newsletter
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Newsletter lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto" onClick={() => setLightbox(null)}>
          <div className="min-h-full flex flex-col items-center py-8 px-4">
            <button onClick={() => setLightbox(null)}
              className="self-end mb-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold flex-shrink-0">
              ✕
            </button>
            <img src={lightbox} alt="Newsletter" className="w-full max-w-3xl rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  )
}
