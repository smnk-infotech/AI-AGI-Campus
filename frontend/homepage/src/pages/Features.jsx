import React from 'react'

const solutionAreas = [
	{
		title: 'Student Module',
		points: [
			'AI Tutor (chat/voice/video) and study recommendations',
			'Assignments, schedule and wellbeing tracking',
			'Attendance via face recognition (prototype)'
		]
	},
	{
		title: 'Faculty Module',
		points: [
			'Lesson planning assistant and course management',
			'Assignment creation and grading flows',
			'Student analytics and advising tools'
		]
	},
	{
		title: 'Admin Module',
		points: [
			'Timetable automation and announcements',
			'Operations: fees/hostel/transport (scaffolded)',
			'Campus-wide dashboards'
		]
	},
	{
		title: 'AGI Controller (Simulation)',
		points: [
			'LangChain + AutoGPT + CrewAI agents',
			'Predictive risk flags and resource planning (prototype)',
			'Extensible multi-agent reasoning experiments'
		]
	}
]

const integrations = [
	'React 18 + Vite',
	'FastAPI (Python)',
	'PostgreSQL',
	'Firebase (Auth/Notifications)',
	'LangChain / AutoGPT / CrewAI',
	'Hugging Face Models',
	'OpenCV / MediaPipe',
	'Whisper.cpp',
	'Coqui TTS'
]

export default function Features() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">Project modules and architecture</h1>
				<p className="muted large">
					This college capstone demonstrates role-based portals, an AI/AGI layer, and a Python FastAPI backend using
					only free/open-source tools.
				</p>
			</section>

			<section className="section container grid-two">
				{solutionAreas.map((area) => (
					<article key={area.title} className="card">
						<h2>{area.title}</h2>
						<ul className="list">
							{area.points.map((point) => (
								<li key={point}>{point}</li>
							))}
						</ul>
					</article>
				))}
			</section>

			<section className="section container">
				<h2>Tech stack (free & open-source)</h2>
				<p className="muted">
					The solution is assembled from popular, free/open-source libraries well-suited for academic work and rapid
					prototyping.
				</p>
				<div className="tags">
					{integrations.map((integration) => (
						<span key={integration} className="tag">
							{integration}
						</span>
					))}
				</div>
			</section>

			<section className="section container">
				<div className="cta-panel card">
					<h2>Explore the live prototype</h2>
					<p className="muted">Open the role portal and try the demo credentials described on the Portal page.</p>
					<a className="btn btn-primary" href="/portal">Open Portal</a>
				</div>
			</section>
		</div>
	)
}
