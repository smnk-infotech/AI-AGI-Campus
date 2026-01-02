import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Schedule from './pages/Schedule'
import Advising from './pages/Advising'
import Research from './pages/Research'
import Assignments from './pages/Assignments'
import Login from './pages/Login'

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/courses', label: 'Courses' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/assignments', label: 'Assignments' },
  { path: '/advising', label: 'Advising' },
  { path: '/research', label: 'Research & Development' }
]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('faculty_token'))
  const [faculty, setFaculty] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('faculty_token', token)
    else localStorage.removeItem('faculty_token')
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchFaculty = async () => {
      try {
        // Note: Reuse auth/me if we unify, but backend/api/routers/auth.py uses StudentDB for /me? 
        // Wait, we updated /me to return "role". If /me assumes student, it might fail or return student data.
        // The auth.py router logic: "user = db.query(StudentDB)..."
        // So /me ONLY works for students right now.
        // I need to update auth.py to handle faculty login too, OR duplicate login endpoint?
        // The `login_for_access_token` checks StudentDB. 
        // I need to update backend auth to support Faculty login!
        // I missed that in the plan details. The plan said "Authenticate student (or extend toFaculty/Admin)".
        // I will update App.jsx to try fetching, but if backend fails, login won't work.
        // I will fix backend auth in parallel or next step.
        // For now, let's assume /me will be updated to handle faculty or I use a different endpoint?
        // Let's stick to /me but I MUST fix the backend.
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setFaculty(data)
        } else {
          // For now, if /me fails (e.g. wrong role), maybe we logout?
          setToken(null)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchFaculty()
  }, [token])

  if (!token) {
    return <Login setToken={setToken} />
  }

  function logout() {
    setToken(null)
    setFaculty(null)
  }

  return (
    <div className="app faculty-console">
      <header className="topbar">
        <div className="brand">
          <h1>Faculty Experience</h1>
          <p>Plan instruction, monitor learners and advance your research.</p>
        </div>
        <div className="profile">
          <div className="profile-name">{faculty ? `${faculty.first_name} ${faculty.last_name}` : 'Dr. Riley Thompson'}</div>
          <div className="profile-role">{faculty ? faculty.department : 'Physics & Emerging Robotics'}</div>
          <button onClick={logout} className="btn-sm" style={{ marginLeft: 10 }}>Logout</button>
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
          <Route path="/" element={<Dashboard faculty={faculty} />} />
          <Route path="/courses" element={<Courses faculty={faculty} />} />
          <Route path="/schedule" element={<Schedule faculty={faculty} />} />
          <Route path="/assignments" element={<Assignments faculty={faculty} />} />
          <Route path="/advising" element={<Advising faculty={faculty} />} />
          <Route path="/research" element={<Research faculty={faculty} />} />
          <Route path="*" element={<Dashboard faculty={faculty} />} />
        </Routes>
      </main>
    </div>
  )
}
