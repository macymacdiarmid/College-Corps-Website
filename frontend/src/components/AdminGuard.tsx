import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cc-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
