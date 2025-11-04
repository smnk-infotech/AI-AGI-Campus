import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Academics from './pages/Academics'
import Communication from './pages/Communication'
import Finance from './pages/Finance'

const links = [
  { path: '/', label: 'Overview' },
  { path: '/attendance', label: 'Attendance' },
  { path: '/academics', label: 'Academics' },
  { path: '/communication', label: 'Communication' },
  { path: '/finance', label: 'Finance' }
]

export default function App() {
  return (
    <div className="app parent-console">
      <header className="topbar">
        <div className="brand">
          <h1>Parent Portal</h1>
          <p>Stay connected to your child’s learning, wellbeing and campus experience.</p>
        </div>
        <div className="profile">
          <div className="profile-name">Radhika Kumar</div>
          <div className="profile-role">Guardian of Aarav (Grade 8)</div>
        </div>
      </header>

      <nav className="tabs">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) => (isActive ? 'tab tab-active' : 'tab')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
