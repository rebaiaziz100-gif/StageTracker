import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Offres from './pages/Offres'
import Candidatures from './pages/Candidatures'
import Stages from './pages/Stages'
import Taches from './pages/Taches'
import './App.css'

function LoginRoute() {
  const { utilisateur } = useAuth()

  if (utilisateur) {
    return <Navigate to="/" replace />
  }

  return <Login />
}

function AppRoutes() {
  const location = useLocation()
  const afficherNavigation = location.pathname !== '/login'

  return (
    <>
      {afficherNavigation && <Sidebar />}
      {afficherNavigation && <Topbar />}

      <main className={afficherNavigation ? 'conteneur-page' : undefined}>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offres"
            element={
              <ProtectedRoute>
                <Offres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidatures"
            element={
              <ProtectedRoute>
                <Candidatures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stages"
            element={
              <ProtectedRoute>
                <Stages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taches"
            element={
              <ProtectedRoute>
                <Taches />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
