import React from 'react'

const heroStats = [
	{ label: 'Modules', value: '4' },
	{ label: 'Open-Source Tools', value: '12+' },
	{ label: 'Timeline', value: '12 months' }
]

const featureHighlights = [
	{
		title: 'Student Module',
		description:
			'AI Tutor (chat/voice/video), attendance with face recognition, progress tracking, and course workspaces.'
	},
	{
		title: 'Faculty Module',
		description:
			'Lesson planning assistant, assignment workflows, analytics, and schedule management.'
	},
	{
		title: 'Admin Module',
		description:
			'Operations, finance, timetable automation, and central announcements for campus administration.'
	},
	{
		title: 'AGI Controller (Simulation)',
		description:
			'Multi-agent reasoning with LangChain/AutoGPT/CrewAI for planning and predictive analytics.'
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
	return (
		<>
			<section className="hero">
				<div className="container hero-inner">
					<div className="hero-content">
						<h1>AI + AGI powered campus system (college capstone)</h1>
						<p className="lead">
							An academic project demonstrating role-based portals (admin, faculty, student, parent), an AI tutor, and
								a FastAPI backend using only free and open-source tools.
						</p>
						<div className="hero-ctas">
							<a className="btn btn-primary" href="/portal">Open Portal</a>
							<a className="btn btn-ghost" href="/features">View modules</a>
						</div>
					</div>
					<div className="hero-visual" aria-hidden>
						<div className="mock-window">
							<div className="mock-header"></div>
							<div className="mock-body">
								<div className="mock-stats">
									{heroStats.map((stat) => (
										<div key={stat.label} className="mstat">
											<strong>{stat.value}</strong>
											<div>{stat.label}</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="section container">
				<h2>Features built for every campus role</h2>
				<p className="muted">
					Purpose-built workflows accelerate administrators, lighten faculty load, delight parents and keep students
					on track.
				</p>
				<div className="features-grid">
					{featureHighlights.map((feature) => (
						<div key={feature.title} className="card feature-card">
							<h3>{feature.title}</h3>
							<p className="muted">{feature.description}</p>
						</div>
					))}
				</div>
			</section>

			<section className="section stats container">
				{stats.map((stat) => (
					<div key={stat.label} className="stat">
						<div className="stat-value">{stat.value}</div>
						<div className="stat-label muted">{stat.label}</div>
					</div>
				))}
			</section>

			<section className="section container">
				<h2>About this project</h2>
				<div className="card">
					<ul className="list">
						{projectNotes.map((note) => (
							<li key={note}>{note}</li>
						))}
					</ul>
				</div>
			</section>
		</>
	)
}
