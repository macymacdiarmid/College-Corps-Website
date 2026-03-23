import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard',      to: '/admin' },
  { label: 'Fellows',        to: '/admin/fellows' },
  { label: 'Applicants',     to: '/admin/applicants' },
  { label: 'Contacts',       to: '/admin/contacts' },
  { label: 'Postings',       to: '/admin/postings' },
  { label: 'Content',        to: '/admin/content' },
  { label: 'Media',          to: '/admin/media' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-cc-blue-dark text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-cc-blue-navy">
          <p className="text-cc-orange font-bold text-xs uppercase tracking-widest mb-1">Admin</p>
          <p className="font-bold text-sm">College Corps</p>
          <Link
            to="/"
            className="inline-block mt-3 text-xs text-cc-blue-light hover:text-white transition-colors"
          >
            ← Back to Main Site
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cc-blue text-white'
                    : 'text-cc-blue-light hover:bg-cc-blue-navy hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-cc-blue-navy">
          <p className="text-xs text-cc-blue-light truncate mb-2">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full text-xs px-3 py-2 bg-cc-blue-navy text-cc-blue-light rounded-lg hover:bg-cc-blue hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
