import React, { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Activity, FileBarChart, Cpu, LogOut } from 'lucide-react'
import api from './services/api'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Staff from './pages/Staff'
import Operations from './pages/Operations'
import Reports from './pages/Reports'
import AGIController from './pages/AGIController'
import Login from './pages/Login'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/staff', label: 'Staff', icon: Briefcase },
  { to: '/operations', label: 'Operations', icon: Activity },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/agi', label: 'AGI Controller', icon: Cpu },
]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [admin, setAdmin] = useState(null)

  // Persist token & Check URL for token handover
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('admin_token', urlToken)
      setToken(urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    else if (token) {
      localStorage.setItem('admin_token', token)
    } else {
      localStorage.removeItem('admin_token')
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchAdmin = async () => {
      try {
        const data = await api.getCurrentUser()
        setAdmin(data)
      } catch (e) {
        console.error('Failed to fetch admin:', e)
      }
    }
    fetchAdmin()
  }, [token])

  if (!token) {
    return <Login setToken={setToken} />
  }

  function logout() {
    setToken(null)
    setAdmin(null)
  }

  return (
    <div className="app-container">
      <div className="central-container">
        {/* Header Card */}
        <header className="header-card">
          <div>
            <h1 className="app-title">Admin Console</h1>
            <p className="app-subtitle">Monitor operations, manage people, and keep the campus running smoothly.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{admin ? `${admin.first_name} ${admin.last_name}` : 'Administrator'}</div>
            <button onClick={logout} className="btn-sm" style={{ marginTop: 8 }}>Logout</button>
          </div>
        </header>

        {/* Navigation Pills */}
        <nav className="nav-pills">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/agi" element={<AGIController />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
