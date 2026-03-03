import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Calendar, File, Users, FlaskConical, LogOut } from 'lucide-react'
import api from './services/api'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Schedule from './pages/Schedule'
import Advising from './pages/Advising'
import Research from './pages/Research'
import Assignments from './pages/Assignments'
import Login from './pages/Login'

const links = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/assignments', label: 'Assignments', icon: File },
  { path: '/advising', label: 'Advising', icon: Users },
  { path: '/research', label: 'Research', icon: FlaskConical }
]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('faculty_token'))
  const [faculty, setFaculty] = useState(null)
  const location = useLocation()

  // Page Title logic
  const currentLink = links.find(l => l.path === location.pathname)
  const pageTitle = currentLink ? currentLink.label : 'Faculty Portal'

  // Persist token & Check URL for token handover
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('faculty_token', urlToken)
      setToken(urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    else if (token) {
      localStorage.setItem('faculty_token', token)
    } else {
      localStorage.removeItem('faculty_token')
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchFaculty = async () => {
      try {
        const data = await api.getCurrentUser()
        setFaculty(data)
      } catch (e) {
        console.error('Failed to fetch faculty:', e)
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
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          AI-AGI Campus
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="page-title">{pageTitle}</div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{faculty ? `${faculty.first_name} ${faculty.last_name}` : 'Loading...'}</div>
              <div className="text-sm text-slate-500">{faculty ? faculty.department : ''}</div>
            </div>
            <button onClick={logout} className="btn btn-secondary" title="Logout">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard faculty={faculty} />} />
            <Route path="/courses" element={<Courses faculty={faculty} />} />
            <Route path="/schedule" element={<Schedule faculty={faculty} />} />
            <Route path="/assignments" element={<Assignments faculty={faculty} />} />
            <Route path="/advising" element={<Advising faculty={faculty} />} />
            <Route path="/research" element={<Research faculty={faculty} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
