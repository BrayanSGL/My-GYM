import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AuthProvider } from '@/context/AuthProvider'
import Exercises from '@/routes/Exercises'
import ExerciseDetail from '@/routes/ExerciseDetail'
import Home from '@/routes/Home'
import Login from '@/routes/Login'
import Notes from '@/routes/Notes'

const Progress = lazy(() => import('@/routes/Progress'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="ejercicios" element={<Exercises />} />
              <Route path="ejercicios/:id" element={<ExerciseDetail />} />
              <Route path="notas" element={<Notes />} />
              <Route
                path="progreso"
                element={
                  <Suspense fallback={<p className="px-4 pt-6 text-text-muted">Cargando…</p>}>
                    <Progress />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
