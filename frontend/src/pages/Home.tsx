import { Link } from 'react-router-dom'

const cohorts = [
  {
    title: 'Food Insecurity',
    to: '/cohorts/food',
    icon: '🌾',
    description: 'Partner with local food banks and pantries to fight hunger in San Luis Obispo County.',
  },
  {
    title: 'Climate Action',
    to: '/cohorts/climate',
    icon: '🌱',
    description: 'Work on sustainability initiatives, conservation projects, and climate education.',
  },
  {
    title: 'Healthy Futures',
    to: '/cohorts/health',
    icon: '💊',
    description: 'Improve community health outcomes through outreach, education, and support services.',
  },
  {
    title: 'K-12 Education',
    to: '/cohorts/k12',
    icon: '📚',
    description: 'Tutor and mentor K-12 students to close the opportunity gap in local schools.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cp-green text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cp-gold font-semibold tracking-widest uppercase text-sm mb-4">Cal Poly College Corps</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Learn by Doing.<br />Serve Your Community.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            College Corps is Cal Poly's AmeriCorps program, connecting students with meaningful service
            opportunities while earning an education award. Join a cohort, make an impact, and grow as a leader.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-cp-gold text-cp-green font-bold text-lg rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-cp-green mb-6">About the Program</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Cal Poly College Corps is part of California's statewide AmeriCorps initiative. Students commit to
          300 hours of community service over the academic year and receive a $10,000 education award upon completion.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Members are placed in one of four cohorts aligned with pressing community needs — food insecurity,
          climate action, healthy futures, and K-12 education. Each cohort is partnered with local nonprofits
          and community organizations to ensure your service has a real and lasting impact.
        </p>
      </section>

      {/* Cohort Cards */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-cp-green text-center mb-12">Our Cohorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cohorts.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="text-lg font-bold text-cp-green group-hover:text-cp-gold transition-colors mb-2">
                  {c.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cp-green text-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold text-cp-gold">300</p>
            <p className="mt-2 text-gray-200">Service Hours per Year</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-cp-gold">$10K</p>
            <p className="mt-2 text-gray-200">Education Award</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-cp-gold">4</p>
            <p className="mt-2 text-gray-200">Community Cohorts</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-cp-green mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 mb-8 text-lg">Applications open every spring for the following academic year.</p>
        <Link
          to="/contact"
          className="inline-block px-8 py-4 bg-cp-green text-white font-bold text-lg rounded-lg hover:bg-cp-green-light transition-colors"
        >
          Apply Now
        </Link>
      </section>
    </div>
  )
}
