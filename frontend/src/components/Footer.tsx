import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-cc-blue-dark text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-cc-orange mb-3">Cal Poly College Corps</h3>
          <p className="text-sm text-cc-blue-light leading-relaxed">
            Connecting Cal Poly students with community service opportunities that make a real difference.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Cohorts</h3>
          <ul className="space-y-1 text-sm text-cc-blue-light">
            <li><Link to="/cohorts/food"    className="hover:text-cc-orange transition-colors">Food Insecurity</Link></li>
            <li><Link to="/cohorts/climate" className="hover:text-cc-orange transition-colors">Climate Action</Link></li>
            <li><Link to="/cohorts/health"  className="hover:text-cc-orange transition-colors">Healthy Futures</Link></li>
            <li><Link to="/cohorts/k12"     className="hover:text-cc-orange transition-colors">K-12 Education</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-1 text-sm text-cc-blue-light">
            <li><Link to="/updates" className="hover:text-cc-orange transition-colors">Updates &amp; Newsletters</Link></li>
            <li><Link to="/contact" className="hover:text-cc-orange transition-colors">Contact Us</Link></li>
            <li>
              <a href="https://www.calpoly.edu" target="_blank" rel="noopener noreferrer" className="hover:text-cc-orange transition-colors">
                Cal Poly San Luis Obispo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cc-blue-navy text-center py-4 text-xs text-cc-blue-light">
        © {new Date().getFullYear()} Cal Poly College Corps. All rights reserved.
      </div>
    </footer>
  )
}
