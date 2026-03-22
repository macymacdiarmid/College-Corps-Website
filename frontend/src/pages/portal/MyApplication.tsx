import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface Application {
  id: string
  name: string
  email: string
  cohort: string
  message: string | null
  created_at: string
}

const cohortLabel: Record<string, string> = {
  food:    'Food Insecurity',
  climate: 'Climate Action',
  health:  'Healthy Futures',
  k12:     'K-12 Education',
}

const cohortColor: Record<string, string> = {
  food:    'bg-orange-100 text-orange-700',
  climate: 'bg-green-100 text-green-700',
  health:  'bg-red-100 text-red-700',
  k12:     'bg-blue-100 text-blue-700',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function MyApplication() {
  const { user, isFellow, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [app, setApp] = useState<Application | null | 'none'>('none')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/portal/login', { replace: true }); return }
    if (isFellow) { navigate('/fellow', { replace: true }); return }
    supabase
      .from('applications')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setApp(data && data.length > 0 ? data[0] : null)
        setLoading(false)
      })
  }, [user, isFellow, authLoading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/portal/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-cc-blue-dark text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-cc-orange font-bold text-xs uppercase tracking-widest">Applicant Portal</p>
          <p className="font-bold">College Corps</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-cc-blue-light text-sm hidden sm:block">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-2 bg-cc-blue-navy text-cc-blue-light rounded-lg hover:bg-cc-blue hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {(authLoading || loading) ? (
          <div className="text-center text-gray-400">Loading…</div>
        ) : app === null ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No application found</h2>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find an application for <strong>{user?.email}</strong>.<br />
              Make sure you signed in with the same email you applied with.
            </p>
            <a
              href="/#apply"
              className="inline-block bg-cc-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-cc-orange-dark transition-colors"
            >
              Apply Now
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-cc-blue">My Application</h1>
              <p className="text-gray-500 text-sm mt-1">Submitted {fmt((app as Application).created_at)}</p>
            </div>

            {/* Status banner */}
            <div className="bg-cc-blue rounded-xl p-5 text-white flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Application Received</p>
                <p className="text-cc-blue-light text-sm">Your application is under review. We'll reach out to you by email.</p>
              </div>
            </div>

            {/* Details card */}
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Name</span>
                <span className="font-medium text-gray-800">{(app as Application).name}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Email</span>
                <span className="font-medium text-gray-800">{(app as Application).email}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Cohort</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${cohortColor[(app as Application).cohort]}`}>
                  {cohortLabel[(app as Application).cohort]}
                </span>
              </div>
              {(app as Application).message && (
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{(app as Application).message}</p>
                </div>
              )}
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Date submitted</span>
                <span className="text-gray-800 text-sm">{fmt((app as Application).created_at)}</span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400">
              Questions? <a href="/contact" className="text-cc-orange hover:underline">Contact us</a>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
