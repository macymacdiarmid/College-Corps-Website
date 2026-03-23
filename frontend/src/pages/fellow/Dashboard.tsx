import { useEffect, useState, useRef } from 'react'
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

interface Posting {
  id: string
  type: string
  title: string
  description: string | null
  image_url: string | null
  event_date: string | null
  apply_link: string | null
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
  const [postings, setPostings] = useState<Posting[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [photoUploadDone, setPhotoUploadDone] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/auth/callback', { replace: true }); return }

    async function load() {
      const [profileRes, logsRes, announcementsRes, postingsRes] = await Promise.all([
        supabase.from('fellow_users').select('*').eq('email', user!.email).single(),
        supabase.from('hour_logs').select('*').eq('fellow_email', user!.email).order('log_date', { ascending: false }),
        supabase.from('announcements').select('*').lte('published_at', new Date().toISOString()).order('published_at', { ascending: false }).limit(10),
        supabase.from('postings').select('*').not('published_at', 'is', null).lte('published_at', new Date().toISOString()).order('published_at', { ascending: false }),
      ])
      setProfile(profileRes.data)
      setLogs(logsRes.data ?? [])
      setAnnouncements(announcementsRes.data ?? [])
      setPostings(postingsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [user, authLoading, navigate])

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  async function handlePhotoUpload() {
    if (!photoFiles.length || !user) return
    setUploadingPhotos(true)
    for (const file of photoFiles) {
      const ext = file.name.split('.').pop()
      const path = `fellow-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData } = await supabase.storage.from('media').upload(path, file, { upsert: true })
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        await supabase.from('fellow_photos').insert({
          fellow_email: user.email,
          fellow_name: profile?.name ?? '',
          image_url: publicUrl,
          file_name: file.name,
        })
      }
    }
    setPhotoFiles([])
    if (photoInputRef.current) photoInputRef.current.value = ''
    setUploadingPhotos(false)
    setPhotoUploadDone(true)
    setTimeout(() => setPhotoUploadDone(false), 4000)
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

  const otherAnnouncements = announcements.filter(a => a.type !== 'service_opportunity')
  const postingAnnouncements = postings.filter(p => p.type === 'announcement')
  const serviceOpps = postings.filter(p => p.type === 'service_opportunity')
  const events = postings.filter(p => p.type === 'event')
  const newsletters = postings.filter(p => p.type === 'newsletter')

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
            {otherAnnouncements.length === 0 && postingAnnouncements.length === 0 ? (
              <p className="text-gray-400 text-sm p-6">No announcements yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {postingAnnouncements.map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🔔</span>
                      <span className="text-xs text-gray-400">
                        {new Date(a.published_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{a.title}</p>
                    {a.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.description}</p>}
                  </div>
                ))}
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
                {serviceOpps.map(p => (
                  <div key={p.id} className="px-6 py-4 flex gap-4">
                    {p.image_url && (
                      <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                      {p.event_date && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(p.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      )}
                      {p.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">{p.description}</p>}
                      {p.apply_link && (
                        <a href={p.apply_link} target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                          Apply / RSVP
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Events</h2>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No upcoming events posted yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {events.map(p => (
                <div key={p.id} className="px-6 py-4 flex gap-4">
                  {p.image_url && (
                    <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">{p.title}</p>
                    {p.event_date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(p.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    )}
                    {p.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">{p.description}</p>}
                    {p.apply_link && (
                      <a href={p.apply_link} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium">
                        RSVP
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-cc-blue">Share Your Site Photos</h2>
          </div>
          <div className="px-6 py-6 flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                📸 Upload any images you may have from your sites to be featured on our social media or webpages!
              </p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={e => setPhotoFiles(Array.from(e.target.files ?? []))}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cc-blue file:text-white hover:file:bg-cc-blue-navy cursor-pointer mb-3"
              />
              {photoFiles.length > 0 && (
                <p className="text-xs text-gray-400 mb-3">{photoFiles.length} photo{photoFiles.length > 1 ? 's' : ''} selected</p>
              )}
              {photoUploadDone && (
                <p className="text-sm text-green-600 font-medium mb-3">Photos uploaded successfully! Thank you 🎉</p>
              )}
              <button
                onClick={handlePhotoUpload}
                disabled={!photoFiles.length || uploadingPhotos}
                className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium hover:bg-cc-orange-dark transition-colors disabled:opacity-50"
              >
                {uploadingPhotos ? 'Uploading…' : 'Submit Photos'}
              </button>
            </div>
            <div className="w-full sm:w-48 bg-cc-blue-dark rounded-xl p-4 text-center flex-shrink-0">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-white text-xs font-semibold leading-relaxed">Your photos help showcase the amazing work you do in the community!</p>
            </div>
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
                        className="inline-block mt-3 text-xs px-3 py-1.5 bg-cc-blue text-white rounded-lg hover:bg-cc-blue-navy transition-colors font-medium">
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
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
          onClick={() => setLightbox(null)}
        >
          <div className="min-h-full flex flex-col items-center py-8 px-4">
            <button
              onClick={() => setLightbox(null)}
              className="self-end mb-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold flex-shrink-0"
            >
              ✕
            </button>
            <img
              src={lightbox}
              alt="Newsletter"
              className="w-full max-w-3xl rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
