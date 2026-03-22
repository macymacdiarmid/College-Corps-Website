import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/assets'
import type { CohortContent } from '../content/cohorts'
import { FoodIcon, ClimateIcon, HealthIcon, EducationIcon } from './CohortIcon'

const iconMap = {
  food:    FoodIcon,
  climate: ClimateIcon,
  health:  HealthIcon,
  k12:     EducationIcon,
}

export default function CohortPage({ cohort }: { cohort: CohortContent }) {
  const { id, title, tagline, description, media, goals, partners } = cohort
  const Icon = iconMap[id]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-cc-blue-dark text-white py-20 px-4 text-center overflow-hidden">
        {media.heroVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src={assetUrl(media.heroVideo)}
            autoPlay muted loop playsInline
          />
        ) : media.heroImage ? (
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src={assetUrl(media.heroImage)}
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : null}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-5">
            <Icon className="w-16 h-16 text-cc-orange" />
          </div>
          <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">Cohort</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-cc-blue-light">{tagline}</p>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-cc-blue mb-4">About This Cohort</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </section>

      {/* Gallery */}
      {media.galleryImages && media.galleryImages.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.galleryImages.map((img, i) => (
              <img key={i} src={assetUrl(img)} alt="" className="rounded-lg object-cover w-full h-48" />
            ))}
          </div>
        </section>
      )}

      {/* Goals */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-cc-blue mb-6">Our Goals</h2>
          <ul className="space-y-3">
            {goals.map((g, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 bg-cc-orange rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-lg">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-cc-blue mb-6">Community Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {partners.map((p, i) => (
            <div key={i} className="border-l-4 border-cc-orange bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-cc-blue mb-1">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cc-blue text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the {title} Cohort</h2>
        <p className="text-cc-blue-light mb-8">Ready to serve? Apply today and we'll be in touch.</p>
        <Link
          to="/contact"
          className="inline-block px-8 py-4 bg-cc-orange text-white font-bold text-lg rounded-lg hover:bg-cc-orange-medium transition-colors"
        >
          Apply Now
        </Link>
      </section>
    </div>
  )
}
