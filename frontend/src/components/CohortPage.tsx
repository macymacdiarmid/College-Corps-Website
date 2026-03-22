import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/assets'
import type { CohortContent } from '../content/cohorts'

export default function CohortPage({ cohort }: { cohort: CohortContent }) {
  const { icon, title, tagline, description, media, goals, partners } = cohort

  return (
    <div>
      {/* Hero — shows video if provided, otherwise image, otherwise solid green */}
      <section className="relative bg-cp-green text-white py-20 px-4 text-center overflow-hidden">
        {media.heroVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            src={assetUrl(media.heroVideo)}
            autoPlay
            muted
            loop
            playsInline
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

      {/* Gallery — only shown if galleryImages are set */}
      {media.galleryImages && media.galleryImages.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.galleryImages.map((img, i) => (
              <img
                key={i}
                src={assetUrl(img)}
                alt=""
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        </section>
      )}

      {/* Goals */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-cp-green mb-6">Our Goals</h2>
          <ul className="space-y-3">
            {goals.map((g, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 bg-cp-gold rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-lg">{g}</span>
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
