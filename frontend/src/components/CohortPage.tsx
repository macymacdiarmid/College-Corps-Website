import { Link } from 'react-router-dom'

interface Goal {
  text: string
}

interface Partner {
  name: string
  description: string
}

interface CohortPageProps {
  icon: string
  title: string
  tagline: string
  description: string
  goals: Goal[]
  partners: Partner[]
  color?: string
}

export default function CohortPage({
  icon,
  title,
  tagline,
  description,
  goals,
  partners,
}: CohortPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cp-green text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-4">{icon}</div>
          <p className="text-cp-gold font-semibold uppercase tracking-widest text-sm mb-3">Cohort</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-200">{tagline}</p>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-cp-green mb-4">About This Cohort</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </section>

      {/* Goals */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-cp-green mb-6">Our Goals</h2>
          <ul className="space-y-3">
            {goals.map((g, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 bg-cp-gold rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-lg">{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-cp-green mb-6">Community Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {partners.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-cp-green mb-1">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cp-green text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the {title} Cohort</h2>
        <p className="text-gray-200 mb-8">Ready to serve? Apply today and we'll be in touch.</p>
        <Link
          to="/contact"
          className="inline-block px-8 py-4 bg-cp-gold text-cp-green font-bold text-lg rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Apply Now
        </Link>
      </section>
    </div>
  )
}
