import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, FileText, Calendar, Heart, Bot, Users, LogOut, Menu, X } from 'lucide-react'
import api from './services/api'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Schedule from './pages/Schedule'
import Wellbeing from './pages/Wellbeing'
import AIAssistant from './pages/AIAssistant'
import Login from './pages/Login'
import Attendance from './pages/Attendance'
import './styles.css'

const links = [
  { path: '/', label: 'Overview', icon: Home },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/assignments', label: 'Assignments', icon: FileText },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/attendance', label: 'Attendance', icon: Users },
  { path: '/wellbeing', label: 'Wellbeing', icon: Heart },
  { path: '/assistant', label: 'AI Assistant', icon: Bot },
]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('student_token'))
  const [student, setStudent] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Page Title logic
  const currentLink = links.find(l => l.path === location.pathname)
  const pageTitle = currentLink ? currentLink.label : 'Overview'

  // Persist token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('student_token', urlToken)
      setToken(urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
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
        const data = await api.getCurrentUser()
        setStudent(data)
      } catch (err) {
        console.error("Failed to fetch student", err)
        if (err.message.includes('401')) {
          setToken(null)
        }
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
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="text-lg font-bold text-teal-600">Campus</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-title">Navigation</div>
            {links.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Account</div>
            <button
              onClick={logout}
              className="sidebar-link w-full text-left hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="app-main">
        {/* Top Header */}
        <div className="flex-between mb-2xl">
          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden btn btn-secondary mb-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="heading-1">{pageTitle}</h1>
          </div>
          <div className="flex gap-lg items-center">
            <div className="text-right hidden sm:block">
              <p className="text-base font-semibold">{student ? `${student.first_name} ${student.last_name}` : 'Loading...'}</p>
              <p className="text-sm text-secondary">{student ? student.major : ''}</p>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard student={student} />} />
            <Route path="/courses" element={<Courses student={student} />} />
            <Route path="/assignments" element={<Assignments student={student} />} />
            <Route path="/schedule" element={<Schedule student={student} />} />
            <Route path="/wellbeing" element={<Wellbeing student={student} />} />
            <Route path="/assistant" element={<AIAssistant student={student} />} />
            <Route path="/attendance" element={<Attendance student={student} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
