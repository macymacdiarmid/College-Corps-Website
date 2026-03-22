import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const { user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/', { replace: true })
      return
    }
    if (isAdmin) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/portal', { replace: true })
    }
  }, [user, isAdmin, loading, navigate])

  return (
    <div className="min-h-screen bg-cc-blue-dark flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cc-orange border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
