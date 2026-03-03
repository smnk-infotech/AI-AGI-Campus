import React, { useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Features from './pages/Features'
import About from './pages/About'
import Login from './components/Login'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/features', label: 'Features' },
  { path: '/about', label: 'About' },
  { path: '/portal', label: 'Login' }
]

export default function App() {
  const location = useLocation()

  return (
    <div className="app-container">
      <div className="central-container">
        {/* Header Card */}
        <header className="header-card">
          <div>
            <h1 className="app-title">AI-AGI Campus</h1>
            <p className="app-subtitle">Welcome to the future of autonomous education.</p>
          </div>
          <div>
            <span className="btn-sm">Guest Access</span>
          </div>
        </header>

        {/* Navigation Pills */}
        <nav className="nav-pills">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/portal" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
