import React from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Features from './pages/Features'
import About from './pages/About'
import Portal from './pages/Portal'

const navLinks = [
	{ path: '/', label: 'Home' },
	{ path: '/features', label: 'Features' },
	{ path: '/about', label: 'About' },
	{ path: '/portal', label: 'Portal' }
]

function Nav() {
	return (
		<nav className="nav">
			<div className="container nav-inner">
				<div className="brand">
					<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
						<rect width="24" height="24" rx="6" fill="#111827" />
						<path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
						<path d="M6 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
					</svg>
					<span className="brand-name">AI-AGI Campus</span>
				</div>
				<div className="nav-actions">
					<div className="nav-links">
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								end={link.path === '/'}
								className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
							>
								{link.label}
							</NavLink>
						))}
					</div>
					<NavLink to="/portal" className="btn btn-primary">Get Started</NavLink>
				</div>
			</div>
		</nav>
	)
}

function Footer() {
	return (
		<footer className="footer">
			<div className="container footer-inner">
				<div>© 2026 AI-AGI Campus — Academic Capstone Project</div>
				<div className="muted">Non-commercial, for educational demonstration only</div>
			</div>
		</footer>
	)
}

import Login from './components/Login'

export default function App() {
	return (
		<div className="site-root">
			<Nav />
			<main className="main">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/features" element={<Features />} />
					<Route path="/about" element={<About />} />
					<Route path="/portal" element={<Login />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<Footer />
		</div>
	)
}
