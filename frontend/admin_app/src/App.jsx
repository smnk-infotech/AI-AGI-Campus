import React from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Staff from './pages/Staff'
import Operations from './pages/Operations'
import Reports from './pages/Reports'

const links = [
  {to: '/dashboard', label: 'Dashboard'},
  {to: '/students', label: 'Students'},
  {to: '/staff', label: 'Staff'},
  {to: '/operations', label: 'Operations'},
  {to: '/reports', label: 'Reports'},
]

export default function App(){
  const linkClass = ({isActive}) => `tab-link${isActive ? ' active' : ''}`

  return (
    <div className="app-shell admin-theme">
      <header className="topbar">
        <div>
          <h1>Admin Console</h1>
          <p>Monitor operations, manage people, and keep the campus running smoothly.</p>
        </div>
        <button className="btn-primary">Create Announcement</button>
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
        </Routes>
      </main>
    </div>
  )
}
