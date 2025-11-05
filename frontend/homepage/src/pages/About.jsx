import React from 'react'

const milestones = [
	{ year: 'Months 1–2', event: 'Research, requirements, and UI/UX design.' },
	{ year: 'Months 3–5', event: 'Student module: AI tutor, study recs, attendance.' },
	{ year: 'Months 6–8', event: 'Faculty/Admin: planning, timetable, fees scaffolding.' },
	{ year: 'Months 9–11', event: 'AGI controller simulation and analytics.' },
	{ year: 'Month 12', event: 'Integration, testing, deployment, documentation.' }
]

const values = [
	{
		title: 'Academic Objective',
		description: 'Demonstrate a working campus system using FOSS components with AI/AGI concepts.'
	},
	{
		title: 'Constraints',
		description: 'Use only free/open-source tools and services; keep scope appropriate for a 12-month capstone.'
	},
	{
		title: 'Outcomes',
		description: 'Functional portals, reproducible backend, and documentation suitable for assessment.'
	}
]

export default function About() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">Project overview</h1>
				<p className="muted large">
					This is a college capstone project that integrates role-based portals with an AI/AGI reasoning layer and a
					Python FastAPI backend. It is non-commercial and intended for academic evaluation.
				</p>
			</section>

			<section className="section container grid-two">
				{values.map((value) => (
					<article key={value.title} className="card">
						<h2>{value.title}</h2>
						<p className="muted">{value.description}</p>
					</article>
				))}
			</section>

			<section className="section container">
				<h2>Milestones</h2>
				<ul className="timeline">
					{milestones.map((milestone) => (
						<li key={milestone.year} className="timeline-item">
							<span className="timeline-year">{milestone.year}</span>
							<div>{milestone.event}</div>
						</li>
					))}
				</ul>
			</section>

			<section className="section container">
				<div className="card partner-card">
					<h2>Documentation</h2>
					<p className="muted">
						See the repository docs for module descriptions, tech stack, and project status.
					</p>
					<a className="btn btn-primary" href="https://github.com/smnk-infotech/AI-AGI-Campus" target="_blank" rel="noreferrer">
						Open GitHub Repo
					</a>
				</div>
			</section>
		</div>
	)
}
