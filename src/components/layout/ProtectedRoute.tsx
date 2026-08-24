import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthProvider'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-[480px] items-center justify-center bg-background text-text-muted">
        Cargando…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
