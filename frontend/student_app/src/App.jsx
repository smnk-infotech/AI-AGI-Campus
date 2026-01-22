import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Schedule from './pages/Schedule'
import Wellbeing from './pages/Wellbeing'
import AIAssistant from './pages/AIAssistant'

const links = [
  { path: '/', label: 'Overview' },
  { path: '/courses', label: 'Courses' },
  { path: '/assignments', label: 'Assignments' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/wellbeing', label: 'Wellbeing' },
  { path: '/assistant', label: 'AI Assistant' },
  { path: '/attendance', label: 'Attendance' }
]

import Login from './pages/Login'
import Attendance from './pages/Attendance'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('student_token'))
  const [student, setStudent] = useState(null)

  // Persist token & Check URL for token handover
  useEffect(() => {
    // 1. Check URL for token handover (from Universal Portal)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('student_token', urlToken)
      setToken(urlToken)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    // 2. Persist existing token changes
    else if (token) {
      localStorage.setItem('student_token', token)
    } else {
      localStorage.removeItem('student_token')
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchStudent = async () => {
      try {
        // With real auth, use /api/auth/me. For now, we list students or decode token if needed.
        // Assuming single user per demo or extracting ID from token payload (not implemented in frontend decode yet).
        // Fallback to fetching first student for demo continuity until /me endpoint exists.
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setStudent(data)
        } else {
          console.error("Failed to fetch student profile")
          if (res.status === 401) {
            setToken(null)
          }
        }
      } catch (err) {
        console.error("Failed to fetch student", err)
      }
    }
    fetchStudent()
  }, [token])

  if (!token) {
    return <Login setToken={setToken} />
  }

  function logout() {
    setToken(null)
    setStudent(null)
  }

  return (
    <div className="app student-console">
      <header className="topbar">
        <div className="brand">
          <h1>Student Experience</h1>
          <p>Track learning progress, manage assignments and stay ready for the week ahead.</p>
        </div>
        <div className="profile">
          <div className="profile-name">{student ? `${student.first_name} ${student.last_name}` : 'Loading...'}</div>
          <div className="profile-role">{student ? `Grade ${student.year} · ${student.major}` : 'Guest'}</div>
          <button onClick={logout} className="btn-sm" style={{ marginLeft: 10 }}>Logout</button>
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
          <Route path="/" element={<Dashboard student={student} />} />
          <Route path="/courses" element={<Courses student={student} />} />
          <Route path="/assignments" element={<Assignments student={student} />} />
          <Route path="/schedule" element={<Schedule student={student} />} />
          <Route path="/wellbeing" element={<Wellbeing student={student} />} />
          <Route path="/assistant" element={<AIAssistant student={student} />} />
          <Route path="/attendance" element={<Attendance student={student} />} />
          <Route path="*" element={<Dashboard student={student} />} />
        </Routes>
      </main>
    </div>
  )
}
