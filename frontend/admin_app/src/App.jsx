import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Staff from './pages/Staff'
import Operations from './pages/Operations'
import Reports from './pages/Reports'
import AGIController from './pages/AGIController'
import Login from './pages/Login'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/staff', label: 'Staff' },
  { to: '/operations', label: 'Operations' },
  { to: '/reports', label: 'Reports' },
  { to: '/agi', label: 'AGI Controller' },
]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [admin, setAdmin] = useState(null)
  const linkClass = ({ isActive }) => `tab-link ${isActive ? 'active' : ''}`

  useEffect(() => {
    // 1. Check URL for token handover (from Universal Portal)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('admin_token', urlToken)
      setToken(urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    // 2. Persist
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
        const res = await fetch('http://localhost:8001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAdmin(data)
        } else {
          setToken(null)
        }
      } catch (e) {
        console.error(e)
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
    <div className="app-shell admin-theme">
      <header className="topbar">
        <div>
          <h1>Admin Console</h1>
          <p>Monitor operations, manage people, and keep the campus running smoothly.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {admin ? `${admin.first_name} ${admin.last_name}` : 'Admin'}
          </span>
          <button onClick={logout} className="btn-secondary btn-sm">Logout</button>
          <button className="btn-primary">Create Announcement</button>
        </div>
      </header>

      <nav className="tabs">
        {links.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass}>{item.label}</NavLink>
        ))}
      </nav>

      <main className="main-content">
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
  )
}
