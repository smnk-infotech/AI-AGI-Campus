import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Schedule from './pages/Schedule'
import Advising from './pages/Advising'
import Research from './pages/Research'
import Assignments from './pages/Assignments'

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/courses', label: 'Courses' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/assignments', label: 'Assignments' },
  { path: '/advising', label: 'Advising' },
  { path: '/research', label: 'Research & Development' }
]

export default function App() {
  return (
    <div className="app faculty-console">
      <header className="topbar">
        <div className="brand">
          <h1>Faculty Experience</h1>
          <p>Plan instruction, monitor learners and advance your research.</p>
        </div>
        <div className="profile">
          <div className="profile-name">Dr. Riley Thompson</div>
          <div className="profile-role">Physics & Emerging Robotics</div>
        </div>
      </header>

      <nav className="tabs">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              isActive ? 'tab tab-active' : 'tab'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/advising" element={<Advising />} />
          <Route path="/research" element={<Research />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
