import React, { useEffect, useRef } from 'react'

const heroStats = [
	{ label: 'Active Students', value: '2,500+' },
	{ label: 'Faculty Members', value: '150+' },
	{ label: 'Departments', value: '12' }
]

const roleCards = [
	{
		title: 'For Students',
		icon: '🎓',
		description: 'Access AI-powered tutoring, track attendance with facial recognition, manage assignments, and collaborate in course workspaces.',
		features: ['AI Tutor (Chat/Voice/Video)', 'Smart Attendance Tracking', 'Progress Analytics', 'Course Collaboration'],
		cta: 'Student Portal',
		link: '/portal'
	},
	{
		title: 'For Faculty',
		icon: '👨‍🏫',
		description: 'Streamline lesson planning, manage assignments efficiently, access student analytics, and optimize your teaching schedule.',
		features: ['AI Lesson Planning', 'Assignment Workflows', 'Student Analytics', 'Schedule Management'],
		cta: 'Faculty Portal',
		link: '/portal'
	},
	{
		title: 'For Administration',
		icon: '🏛️',
		description: 'Oversee campus operations, manage finances, automate timetables, and communicate important announcements effectively.',
		features: ['Operations Dashboard', 'Financial Management', 'Timetable Automation', 'Central Announcements'],
		cta: 'Admin Portal',
		link: '/portal'
	}
]

const stats = [
	{ label: 'Frontend Apps', value: '5' },
	{ label: 'Backend', value: 'FastAPI' },
	{ label: 'Databases', value: 'Firebase + PostgreSQL' },
	{ label: 'AI/AGI', value: 'Hugging Face + LangChain' }
]

const projectNotes = [
	'Non-commercial academic capstone built with free/open-source tools.',
	'Focus: functional prototypes and architecture—not production services.',
	'Role-based portals: Admin, Faculty, Student, Parent with shared backend.',
	'Extensible: replace in-memory data with PostgreSQL using the provided models.'
]

export default function Home() {
	const observerRef = useRef(null)

	useEffect(() => {
		// Intersection Observer for scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('fade-in')
					}
				})
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		)

		// Observe all sections and cards
		const elements = document.querySelectorAll('.role-card, .stat-card, .project-card')
		elements.forEach((el) => observer.observe(el))

		observerRef.current = observer

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [])

	return (
		<>
			{/* Hero Section - Enhanced with better messaging and visual hierarchy */}
			<section className="hero">
				<div className="container hero-inner">
					<div className="hero-content">
						<div className="hero-badge">Academic Capstone Project</div>
						<h1>Transforming Education with AI & AGI</h1>
						<p className="lead">
							Experience the future of campus management with our intelligent ERP system.
							Built for students, faculty, and administrators with cutting-edge AI technology.
						</p>
						<div className="hero-stats">
							{heroStats.map((stat) => (
								<div key={stat.label} className="hero-stat">
									<div className="stat-number">{stat.value}</div>
									<div className="stat-label">{stat.label}</div>
								</div>
							))}
						</div>
						<div className="hero-ctas">
							<a className="btn btn-primary" href="/portal">Access Portal</a>
							<a className="btn btn-secondary" href="#features">Explore Features</a>
						</div>
					</div>
					<div className="hero-visual" aria-hidden>
						<div className="hero-illustration">
							<div className="illustration-circle circle-1"></div>
							<div className="illustration-circle circle-2"></div>
							<div className="illustration-circle circle-3"></div>
							<div className="hero-dashboard">
								<div className="dashboard-header"></div>
								<div className="dashboard-content">
									<div className="dashboard-metric">
										<span className="metric-value">98%</span>
										<span className="metric-label">Attendance</span>
									</div>
									<div className="dashboard-metric">
										<span className="metric-value">24/7</span>
										<span className="metric-label">AI Support</span>
									</div>
									<div className="dashboard-metric">
										<span className="metric-value">15min</span>
										<span className="metric-label">Avg Response</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Role-Based Features Section */}
			<section id="features" className="section features-section">
				<div className="container">
					<div className="section-header">
						<h2>Comprehensive Solutions for Every Role</h2>
						<p className="section-subtitle">
							Purpose-built workflows that accelerate administrators, lighten faculty workload,
							and empower students to excel in their academic journey.
						</p>
					</div>
					<div className="role-cards-grid">
						{roleCards.map((card, index) => (
							<div key={card.title} className={`role-card delay-${index + 1}`}>
								<div className="role-card-header">
									<div className="role-icon">{card.icon}</div>
									<h3>{card.title}</h3>
								</div>
								<p className="role-description">{card.description}</p>
								<ul className="role-features">
									{card.features.map((feature) => (
										<li key={feature}>
											<span className="feature-check">✓</span>
											{feature}
										</li>
									))}
								</ul>
								<a href={card.link} className="btn btn-outline">{card.cta}</a>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Technology Stack Section */}
			<section className="section tech-section">
				<div className="container">
					<div className="section-header">
						<h2>Built with Modern Technology</h2>
						<p className="section-subtitle">
							Leveraging the latest in AI, cloud computing, and open-source frameworks
						</p>
					</div>
					<div className="stats-grid">
						{stats.map((stat) => (
							<div key={stat.label} className="stat-card">
								<div className="stat-value">{stat.value}</div>
								<div className="stat-label">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Project Information Section */}
			<section className="section project-section">
				<div className="container">
					<div className="section-header">
						<h2>About This Academic Project</h2>
					</div>
					<div className="project-card">
						<div className="project-content">
							<ul className="project-notes">
								{projectNotes.map((note) => (
									<li key={note}>
										<span className="note-icon">ℹ️</span>
										{note}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
