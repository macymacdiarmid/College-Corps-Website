import { useEffect, useState } from 'react'

interface Newsletter {
  id: string
  title: string
  published_at: string
  content: string
  pdf_url?: string
}

const PLACEHOLDER_NEWSLETTERS: Newsletter[] = [
  {
    id: '1',
    title: 'Spring 2025 Newsletter',
    published_at: '2025-04-01',
    content: 'College Corps members completed over 4,000 service hours this spring across all four cohorts. Highlights include a record food drive with the SLO Food Bank and a new habitat restoration partnership.',
    pdf_url: '',
  },
  {
    id: '2',
    title: 'Winter 2025 Newsletter',
    published_at: '2025-01-15',
    content: 'Welcome to a new year! Our K-12 cohort launched a new tutoring initiative in partnership with San Luis Coastal USD, and our Climate Action cohort completed 500 hours of invasive species removal.',
    pdf_url: '',
  },
  {
    id: '3',
    title: 'Fall 2024 Newsletter',
    published_at: '2024-10-01',
    content: 'We welcomed 60 new College Corps members this fall! Orientation week featured community partner introductions, service training, and a kick-off celebration at the PAC.',
    pdf_url: '',
  },
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function Updates() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(PLACEHOLDER_NEWSLETTERS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/newsletters')
      .then((r) => r.json())
      .then((data: Newsletter[]) => {
        if (Array.isArray(data) && data.length > 0) setNewsletters(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-cc-blue mb-2 text-center">Updates &amp; Newsletters</h1>
      <p className="text-gray-500 text-center mb-12">
        Stay up to date with everything happening in College Corps.
      </p>

      {loading && <p className="text-center text-gray-400">Loading…</p>}

      <div className="space-y-8">
        {newsletters.map((n) => (
          <article key={n.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-cc-orange">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-cc-blue">{n.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{formatDate(n.published_at)}</p>
              </div>
              {n.pdf_url && (
                <a
                  href={n.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 border border-cc-blue text-cc-blue text-sm font-medium rounded-lg hover:bg-cc-blue hover:text-white transition-colors"
                >
                  Download PDF
                </a>
              )}
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{n.content}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 bg-cc-blue text-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Get Updates in Your Inbox</h2>
        <p className="text-cc-blue-light mb-6">Subscribe to receive newsletters directly to your email.</p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cc-orange"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-cc-orange text-white font-semibold rounded-lg hover:bg-cc-orange-medium transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
