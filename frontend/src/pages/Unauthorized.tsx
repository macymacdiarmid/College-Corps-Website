import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-cc-blue-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-cc-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <p className="text-cc-orange font-semibold uppercase tracking-widest text-xs mb-3">Access Restricted</p>
        <h1 className="text-2xl font-bold text-cc-blue mb-4">Email Not Recognized</h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          <span className="font-medium text-gray-700">{user?.email}</span> is not registered in the College Corps system.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          This portal is for College Corps Fellows, Community Host Partners, and program administrators. If you believe you should have access, please reach out to us.
        </p>

        {/* Contact card */}
        <div className="bg-gray-50 rounded-xl px-6 py-4 mb-8 inline-block w-full">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Contact us</p>
          <a
            href="mailto:collegecorps@calpoly.edu"
            className="text-cc-blue font-semibold text-sm hover:underline"
          >
            collegecorps@calpoly.edu
          </a>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors"
          >
            Return to College Corps Site
          </Link>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}
