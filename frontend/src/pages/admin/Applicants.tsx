import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Application {
  id: string
  name: string
  email: string
  cohort: string
  message: string | null
  created_at: string
}

const cohortLabel: Record<string, string> = {
  food: 'Food Insecurity',
  climate: 'Climate Action',
  health: 'Healthy Futures',
  k12: 'K-12 Education',
}

const cohortColor: Record<string, string> = {
  food:    'bg-orange-100 text-orange-700',
  climate: 'bg-green-100 text-green-700',
  health:  'bg-red-100 text-red-700',
  k12:     'bg-blue-100 text-blue-700',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Applicants() {
  const [apps, setApps] = useState<Application[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setApps(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.cohort === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {apps.length} total</p>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'food', 'climate', 'health', 'k12'].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === c
                  ? 'bg-cc-blue text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-cc-blue'
              }`}
            >
              {c === 'all' ? 'All' : cohortLabel[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Cohort</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Message</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{a.name}</td>
                  <td className="px-6 py-4 text-gray-600">{a.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cohortColor[a.cohort]}`}>
                      {cohortLabel[a.cohort]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{a.message ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{fmt(a.created_at)}</td>
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
