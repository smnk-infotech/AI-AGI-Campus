import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Schedule from './pages/Schedule'
import Wellbeing from './pages/Wellbeing'

const links = [
  { path: '/', label: 'Overview' },
  { path: '/courses', label: 'Courses' },
  { path: '/assignments', label: 'Assignments' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/wellbeing', label: 'Wellbeing' }
]

export default function App() {
  return (
    <div className="app student-console">
      <header className="topbar">
        <div className="brand">
          <h1>Student Experience</h1>
          <p>Track learning progress, manage assignments and stay ready for the week ahead.</p>
        </div>
        <div className="profile">
          <div className="profile-name">Aarav Kumar</div>
          <div className="profile-role">Grade 8 · Robotics Cohort</div>
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
          <Route path="/courses" element={<Courses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/wellbeing" element={<Wellbeing />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
