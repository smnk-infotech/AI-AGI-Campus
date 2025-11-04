import React from 'react'

const heroStats = [
	{ label: 'Students Supported', value: '1,248' },
	{ label: 'Avg. Attendance', value: '92%' },
	{ label: 'Teachers Empowered', value: '78' }
]

const featureHighlights = [
	{
		title: 'Unified Control Center',
		description:
			'Attendance, grading, payroll, facility requests and AI-backed insights in one dashboard for every role.'
	},
	{
		title: 'Automation Everywhere',
		description:
			'Automate approval workflows, timetable adjustments and progress nudges with intelligent rules backed by data.'
	},
	{
		title: 'Always-On Communication',
		description:
			'Announcements, messages and meeting scheduling flow seamlessly between parents, students and faculty.'
	},
	{
		title: 'Meaningful Analytics',
		description:
			'Forecast performance, spot at-risk students early and track interventions with executive-ready reports.'
	}
]

const stats = [
	{ label: 'Campuses', value: '6' },
	{ label: 'AI Playbooks', value: '14' },
	{ label: 'Parent Satisfaction', value: '96%' },
	{ label: 'Task Automation', value: '62%' }
]

const testimonials = [
	{
		quote:
			'“AI-AGI Campus eliminated duplicate data entry across departments and shaved hours off weekly reporting.”',
		author: 'Principal R. Sharma, Horizon STEM Academy'
	},
	{
		quote:
			'“The predictive analytics flagged students who needed attention and gave us ready-to-use response plans.”',
		author: 'Dean L. Adeyemi, Global Scholars College'
	}
]

export default function Home() {
	return (
		<>
			<section className="hero">
				<div className="container hero-inner">
					<div className="hero-content">
						<h1>Modern school management with intelligent automation</h1>
						<p className="lead">
							A single, AI-assisted platform for administrators, faculty, parents and students. Streamline
								attendance, learning workflows, communication and compliance in minutes.
						</p>
						<div className="hero-ctas">
							<a className="btn btn-primary" href="/contact">
								Request a demo
							</a>
							<a className="btn btn-ghost" href="/features">
								Explore features
							</a>
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
				<h2>Trusted by schools worldwide</h2>
				<div className="testimonials">
					{testimonials.map((item) => (
						<blockquote key={item.author} className="card testimonial">
							<p>{item.quote}</p>
							<footer className="muted">{item.author}</footer>
						</blockquote>
					))}
				</div>
			</section>
		</>
	)
}
