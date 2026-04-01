import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

const navItems = [
  { label: 'Dashboard',      to: '/admin' },
  { label: 'Access',         to: '/admin/access' },
  { label: 'Fellows',        to: '/admin/fellows' },
  { label: 'Applicants',     to: '/admin/applicants' },
  { label: 'Fellow Postings', to: '/admin/postings' },
  { label: 'CHP Postings',   to: '/admin/chp-postings' },
  { label: 'Fellow Photos',  to: '/admin/fellow-photos' },
  { label: 'ChatBot',        to: '/admin/chatbot' },
  { label: 'Content',        to: '/admin/content' },
  { label: 'Media',          to: '/admin/media' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadChat, setUnreadChat] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      const { count } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .is('answer', null)
      setUnreadChat(count ?? 0)
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  const closeSidebar = () => setSidebarOpen(false)

  const sidebar = (
    <div className="w-56 bg-cc-blue-dark text-white flex flex-col h-full">
      <div className="px-6 py-5 border-b border-cc-blue-navy">
        <p className="text-cc-orange font-bold text-xs uppercase tracking-widest mb-1">Admin</p>
        <p className="font-bold text-sm">College Corps</p>
        <Link
          to="/"
          onClick={closeSidebar}
          className="inline-block mt-3 text-xs text-cc-blue-light hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cc-blue text-white'
                  : 'text-cc-blue-light hover:bg-cc-blue-navy hover:text-white'
              }`
            }
          >
            {item.label}
            {item.to === '/admin/chatbot' && unreadChat > 0 && (
              <span className="ml-2 min-w-[1.25rem] h-5 px-1 bg-cc-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadChat}
              </span>
            )}
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
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
          {/* Drawer */}
          <aside className="relative z-50 flex flex-col w-56 min-h-full">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 bg-cc-blue-dark text-white px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-cc-blue-navy transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="font-bold text-sm">College Corps Admin</p>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

    </div>
  )
}
