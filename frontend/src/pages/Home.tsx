import { Link } from 'react-router-dom'
import { homeContent } from '../content/home'
import { assetUrl } from '../lib/assets'
import { FoodIcon, ClimateIcon, HealthIcon, EducationIcon } from '../components/CohortIcon'

const cohorts = [
  {
    title: 'Food Insecurity',
    to: '/cohorts/food',
    Icon: FoodIcon,
    description: 'Partner with local food banks and pantries to fight hunger in San Luis Obispo County.',
  },
  {
    title: 'Climate Action',
    to: '/cohorts/climate',
    Icon: ClimateIcon,
    description: 'Work on sustainability initiatives, conservation projects, and climate education.',
  },
  {
    title: 'Healthy Futures',
    to: '/cohorts/health',
    Icon: HealthIcon,
    description: 'Improve community health outcomes through outreach, education, and support services.',
  },
  {
    title: 'K-12 Education',
    to: '/cohorts/k12',
    Icon: EducationIcon,
    description: 'Tutor and mentor K-12 students to close the opportunity gap in local schools.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-cc-blue-dark text-white py-24 px-4 text-center overflow-hidden">
        {homeContent.hero.backgroundImage && (
          <img
            src={assetUrl(homeContent.hero.backgroundImage)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-cc-orange font-semibold tracking-widest uppercase text-sm mb-4">Cal Poly College Corps</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Learn by Doing.<br />Serve Your Community.
          </h1>
          <p className="text-lg md:text-xl text-cc-blue-light mb-10 leading-relaxed">
            College Corps is Cal Poly's AmeriCorps program, connecting students with meaningful service
            opportunities while earning an education award. Join a cohort, make an impact, and grow as a leader.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-cc-orange text-white font-bold text-lg rounded-lg hover:bg-cc-orange-medium transition-colors shadow-lg"
            >
              Apply to be a Fellow
            </a>
            <a
              href="https://forms.office.com/pages/responsepage.aspx?id=2wING578lUSVNx03nMoq53U0ZmIQ8r9JvquZJjmAnzBUMVdZSks2S0tEUlE2OFQyM1EwWVJVUktTWSQlQCN0PWcu&route=shorturl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-cc-blue text-white font-bold text-lg rounded-lg hover:bg-cc-blue-navy transition-colors shadow-lg"
            >
              Apply to be a CHP
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-cc-blue mb-6">About the Program</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Cal Poly College Corps is part of California's statewide AmeriCorps initiative. Students commit to
          450 hours of community service over the academic year and receive a $10,000 education award upon completion.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Members are placed in one of four cohorts aligned with pressing community needs — food insecurity,
          climate action, healthy futures, and K-12 education. Each cohort is partnered with local nonprofits
          and community organizations to ensure your service has a real and lasting impact.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link
            to="/about/fellows"
            className="px-6 py-3 border-2 border-cc-blue text-cc-blue font-semibold rounded-lg hover:bg-cc-blue hover:text-white transition-colors text-sm"
          >
            Learn more about our Fellowship Program
          </Link>
          <Link
            to="/about/chps"
            className="px-6 py-3 border-2 border-cc-blue text-cc-blue font-semibold rounded-lg hover:bg-cc-blue hover:text-white transition-colors text-sm"
          >
            Learn more about our Community Host Partners
          </Link>
        </div>
      </section>

      {/* Promo Video */}
      <section className="relative py-16 px-4 overflow-hidden">
        <img
          src="/media/college-corps-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cc-blue-dark opacity-70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">See College Corps in Action</h2>
          <p className="text-cc-blue-light mb-10">Watch how our members are making a difference across the Central Coast.</p>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
              src="https://www.youtube.com/embed/h94uPxki_cE"
              title="Cal Poly College Corps Promotional Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Cohort Cards */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-cc-blue text-center mb-12">Our Cohorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cohorts.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all group border-b-4 border-transparent hover:border-cc-orange"
              >
                <div className="mb-4 text-cc-blue group-hover:text-cc-orange transition-colors">
                  <c.Icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-cc-blue group-hover:text-cc-orange transition-colors mb-2">
                  {c.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cc-blue-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold text-cc-orange">450</p>
            <p className="mt-2 text-cc-blue-light">Service Hours per Year</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-cc-orange">$10K</p>
            <p className="mt-2 text-cc-blue-light">Education Award</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-cc-orange">4</p>
            <p className="mt-2 text-cc-blue-light">Community Cohorts</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-cc-blue mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 mb-8 text-lg">Applications open every spring for the following academic year.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-cc-orange text-white font-bold text-lg rounded-lg hover:bg-cc-orange-dark transition-colors"
          >
            Apply to be a Fellow
          </a>
          <a
            href="https://forms.office.com/pages/responsepage.aspx?id=2wING578lUSVNx03nMoq53U0ZmIQ8r9JvquZJjmAnzBUMVdZSks2S0tEUlE2OFQyM1EwWVJVUktTWSQlQCN0PWcu&route=shorturl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-cc-blue text-white font-bold text-lg rounded-lg hover:bg-cc-blue-navy transition-colors"
          >
            Apply to be a CHP
          </a>
        </div>
      </section>
    </div>
  )
}
