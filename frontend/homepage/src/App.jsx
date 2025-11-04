import React from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Portal from './pages/Portal'

const navLinks = [
	{ path: '/', label: 'Home' },
	{ path: '/features', label: 'Features' },
	{ path: '/pricing', label: 'Pricing' },
	{ path: '/about', label: 'About' },
	{ path: '/contact', label: 'Contact' },
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
				<div>© {new Date().getFullYear()} AI-AGI Campus. All rights reserved.</div>
				<div className="muted">Built for schools · Privacy · Terms</div>
			</div>
		</footer>
	)
}

export default function App() {
	return (
		<div className="site-root">
			<Nav />
			<main className="main">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/features" element={<Features />} />
					<Route path="/pricing" element={<Pricing />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/portal" element={<Portal />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<Footer />
		</div>
	)
}
