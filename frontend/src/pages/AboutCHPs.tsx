const CHP_APPLY_URL = 'https://forms.office.com/pages/responsepage.aspx?id=2wING578lUSVNx03nMoq53U0ZmIQ8r9JvquZJjmAnzBUMVdZSks2S0tEUlE2OFQyM1EwWVJVUktTWSQlQCN0PWcu&route=shorturl'

const highlights = [
  { icon: '🏢', label: 'Host a Fellow', desc: 'Welcome a Cal Poly student into your organization for a year of dedicated service' },
  { icon: '💪', label: 'Real Capacity', desc: 'Fellows contribute 450 hours of meaningful work to help you achieve your mission' },
  { icon: '🔗', label: 'Cal Poly Partnership', desc: 'Strengthen your connection to Cal Poly and its students and resources' },
  { icon: '🌍', label: 'Community Impact', desc: 'Amplify your organization\'s impact across San Luis Obispo County' },
]

const faqs = [
  { q: 'What is a Community Host Partner?', a: 'Community Host Partners (CHPs) are nonprofits or government agencies in SLO County that host College Corps Fellows at their organization for the academic year.' },
  { q: 'What does hosting a Fellow involve?', a: 'CHPs provide a supervisor, meaningful service work, and a welcoming environment. Fellows serve 10–15 hours per week and need clear tasks aligned with your mission.' },
  { q: 'Is there a cost to become a CHP?', a: 'There is no cost to host a Fellow. The program is funded through AmeriCorps and Cal Poly, and the education award is paid directly to fellows.' },
  { q: 'How do we apply to become a CHP?', a: 'Organizations apply each spring through our online application. We review applications based on mission alignment, capacity to supervise, and community need.' },
]

export default function AboutCHPs() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cc-blue-dark text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">College Corps</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Community Host Partner</h1>
          <p className="text-cc-blue-light text-lg md:text-xl leading-relaxed">
            Community Host Partners are the nonprofits and government agencies that make College Corps possible — providing Fellows with meaningful work and receiving dedicated, passionate student service in return.
          </p>
        </div>
      </section>

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

      {/* What is a CHP */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cc-blue mb-6 text-center">What Do Community Host Partners Do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                As a Community Host Partner, your organization becomes a placement site for one or more College Corps Fellows. You provide supervision, meaningful service tasks, and a supportive environment where students can grow while contributing to your mission.
              </p>
              <p>
                CHPs work within one of four focus areas: Food Insecurity, Climate Action, Healthy Futures, or K–12 Education. Partners are selected based on mission alignment and capacity to support a Fellow.
              </p>
              <p>
                Past CHPs include local food banks, environmental advocacy organizations, school districts, and public health departments across San Luis Obispo County.
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-cc-blue mb-10 text-center">Hear from Our Partners</h2>
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-cc-orange">
            <span className="text-5xl text-cc-orange leading-none">"</span>
            <p className="text-gray-600 italic leading-relaxed text-lg mb-6 -mt-2">
              City Farm SLO is proud to be partnered with the Cal Poly College Corps program as a community host partner! Whether they're leading harvests, assisting with our Therapeutic Horticulture programs, or providing support to our tenant farmers, our fellows are building technical skills that will positively impact, not only their futures, but the future of our community. Our Fellows have provided critical support to help us carry out our mission of empowering the next generation through sustainable agriculture farm-based education.
            </p>
            <p className="font-semibold text-cc-blue">City Farm SLO</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cc-blue-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Apply', desc: 'Submit your organization\'s application each spring. Our team reviews all submissions.' },
              { step: '2', title: 'Match', desc: 'We match your organization with a Fellow whose interests align with your work.' },
              { step: '3', title: 'Serve', desc: 'Your Fellow begins service in the fall and contributes 450 hours throughout the year.' },
            ].map(s => (
              <div key={s.step} className="bg-cc-blue-navy rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-cc-orange text-white font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <p className="font-bold text-lg mb-2">{s.title}</p>
                <p className="text-cc-blue-light text-sm leading-relaxed">{s.desc}</p>
              </div>
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
      <section className="bg-cc-blue py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
        <p className="text-cc-blue-light mb-8 text-lg">Applications for Community Host Partners open each spring.</p>
        <a
          href={CHP_APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 bg-cc-orange text-white font-bold text-lg rounded-lg hover:bg-cc-orange-dark transition-colors shadow-lg"
        >
          Apply to be a CHP
        </a>
      </section>
    </div>
  )
}
