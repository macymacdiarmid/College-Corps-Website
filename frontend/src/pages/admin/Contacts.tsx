import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Contact {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setContacts(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">Contact Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">{contacts.length} total submissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No submissions yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contacts.map((c) => (
              <div key={c.id}>
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-cc-blue-dark text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-sm text-gray-400">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs text-gray-400">{fmt(c.created_at)}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded === c.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expanded === c.id && (
                  <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">{c.message}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-block mt-3 text-sm text-cc-orange hover:underline"
                    >
                      Reply to {c.email}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
