import { Link } from 'react-router-dom'

const FELLOW_APPLY_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u'

const highlights = [
  { icon: '📅', label: '450 Hours', desc: 'Serve 450 hours over the academic year at your host site' },
  { icon: '🎓', label: '$9,000 Award', desc: 'Earn a Segal AmeriCorps Education Award upon completion' },
  { icon: '🤝', label: '4 Cohorts', desc: 'Join a cohort focused on Food, Climate, Health, or K–12 Education' },
  { icon: '🌱', label: 'Leadership', desc: 'Build real-world skills through meaningful community service' },
]

const faqs = [
  { q: 'Who can apply to be a Fellow?', a: 'Cal Poly students of any major and year are eligible to apply. Fellows must be enrolled at least half-time during their service year.' },
  { q: 'How many hours per week does this require?', a: 'Fellows serve approximately 10–15 hours per week at their host site, completing 450 total hours over the academic year.' },
  { q: 'What is the education award?', a: 'Upon successful completion, Fellows receive a $9,000 Segal AmeriCorps Education Award that can be used to pay tuition or student loans.' },
  { q: 'Can I choose my cohort?', a: 'Yes — when you apply you indicate your preferred cohort area. Placements are made based on interest, availability, and fit.' },
]

export default function AboutFellows() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cc-blue-dark text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">College Corps</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Fellow</h1>
          <p className="text-cc-blue-light text-lg md:text-xl leading-relaxed">
            College Corps Fellows are Cal Poly students who commit to a year of meaningful community service — gaining leadership experience, building skills, and earning an education award.
          </p>
        </div>
      </section>

      {/* Full-width photo */}
      <div className="w-full overflow-hidden" style={{ height: '420px' }}>
        <img
          src="/media/hero/fellows-hero.jpg"
          alt="College Corps Fellows"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center bottom' }}
        />
      </div>

      {/* Highlights */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map(h => (
            <div key={h.label} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-3">{h.icon}</div>
              <p className="font-bold text-cc-blue text-lg mb-2">{h.label}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is a Fellow */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cc-blue mb-6 text-center">What Does a Fellow Do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                As a College Corps Fellow, you'll be placed with a nonprofit or government partner in San Luis Obispo County that aligns with your chosen cohort area. You'll show up, serve, and make a real difference — all while earning academic credit and a financial award.
              </p>
              <p>
                Fellows meet regularly as a cohort, participate in professional development workshops, and are supported by program coordinators throughout the year.
              </p>
              <p>
                Past fellows have worked at food banks, environmental nonprofits, local schools, and public health organizations — doing everything from direct service to community outreach.
              </p>
            </div>
            {/* Photo placeholder */}
            <div className="bg-cc-blue-light/20 rounded-2xl h-64 flex items-center justify-center">
              <p className="text-cc-blue-medium text-sm font-medium">[ Photo — upload via Media tab in admin ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cc-blue mb-10 text-center">Hear from Fellows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { quote: '"Being a College Corps Fellow changed the way I think about community impact. I grew more in one year than in any classroom."', name: 'Fellow Name', cohort: 'Food Insecurity Cohort' },
              { quote: '"The education award helped me pay off a semester of tuition. And the work I did at my site was genuinely meaningful."', name: 'Fellow Name', cohort: 'K–12 Education Cohort' },
            ].map((q, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-cc-orange">
                <p className="text-gray-600 italic leading-relaxed mb-4">{q.quote}</p>
                <p className="font-semibold text-cc-blue text-sm">{q.name}</p>
                <p className="text-gray-400 text-xs">{q.cohort}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">[ Replace placeholder quotes with real fellow testimonials ]</p>
        </div>
      </section>

      {/* Cohorts */}
      <section className="bg-cc-blue-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Choose Your Cohort</h2>
          <p className="text-cc-blue-light mb-10">Fellows are placed in one of four focus areas based on their interests and passions.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Food Insecurity', to: '/cohorts/food' },
              { label: 'Climate Action',  to: '/cohorts/climate' },
              { label: 'Healthy Futures', to: '/cohorts/health' },
              { label: 'K–12 Education', to: '/cohorts/k12' },
            ].map(c => (
              <Link key={c.to} to={c.to}
                className="bg-cc-blue-navy rounded-xl px-4 py-5 font-semibold hover:bg-cc-blue transition-colors text-sm">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-cc-blue mb-8 text-center">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <p className="font-semibold text-cc-blue mb-2">{f.q}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply CTA */}
      <section className="bg-cc-orange py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Serve?</h2>
        <p className="text-orange-100 mb-8 text-lg">Applications open every spring for the following academic year.</p>
        <a
          href={FELLOW_APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 bg-white text-cc-orange font-bold text-lg rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
        >
          Apply to be a Fellow
        </a>
      </section>
    </div>
  )
}
