import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home',        to: '/' },
  {
    label: 'Cohorts',
    children: [
      { label: 'Food Insecurity',  to: '/cohorts/food' },
      { label: 'Climate Action',   to: '/cohorts/climate' },
      { label: 'Healthy Futures',  to: '/cohorts/health' },
      { label: 'K-12 Education',   to: '/cohorts/k12' },
    ],
  },
  { label: 'Updates',     to: '/updates' },
  { label: 'FAQ',         to: '/faq' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cohortOpen, setCohortOpen] = useState(false)

  return (
    <nav className="bg-cc-blue-dark text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <span className="text-cc-orange">Cal Poly</span>
          <span>College Corps</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setCohortOpen((o) => !o)}
                  className="hover:text-cc-orange transition-colors flex items-center gap-1"
                >
                  {link.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {cohortOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded shadow-lg min-w-48 z-50">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={() => setCohortOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to!}
                className={({ isActive }) =>
                  isActive ? 'text-cc-orange' : 'hover:text-cc-orange transition-colors'
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <a
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-4 py-2 bg-cc-orange text-white font-semibold rounded hover:bg-cc-orange-medium transition-colors"
          >
            Apply Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cc-blue-navy px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Home</NavLink>
          <NavLink to="/cohorts/food" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Food Insecurity</NavLink>
          <NavLink to="/cohorts/climate" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Climate Action</NavLink>
          <NavLink to="/cohorts/health" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Healthy Futures</NavLink>
          <NavLink to="/cohorts/k12" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">K-12 Education</NavLink>
          <NavLink to="/updates" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Updates</NavLink>
          <NavLink to="/faq" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">FAQ</NavLink>
          <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="py-1 hover:text-cc-orange">Contact</NavLink>
          <a
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-2 bg-cc-orange text-white font-semibold rounded text-center"
          >
            Apply Now
          </a>
        </div>
      )}
    </nav>
  )
}
