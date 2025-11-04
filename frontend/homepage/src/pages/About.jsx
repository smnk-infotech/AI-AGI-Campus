import React from 'react'

const milestones = [
	{ year: '2022', event: 'Product incubation with three innovation-focused schools.' },
	{ year: '2023', event: 'Launched AI copilots for administrators and faculty planning.' },
	{ year: '2024', event: 'Expanded to 6 campuses across two countries with 20K daily active users.' },
	{ year: '2025', event: 'Introduced predictive retention and wellness interventions.' }
]

const values = [
	{
		title: 'Education First',
		description: 'We co-create with teachers, principals and support staff to solve real classroom and operational challenges.'
	},
	{
		title: 'Responsible AI',
		description: 'Transparent, bias-aware models with audit trails and regional data residency options.'
	},
	{
		title: 'Partner Mentality',
		description: 'Dedicated success architects, implementation specialists and 24/7 support for each campus.'
	}
]

export default function About() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">We help schools focus on what matters most</h1>
				<p className="muted large">
					AI-AGI Campus is built by educators, engineers and operations leaders who have lived the complexity of
					running modern schools. Our mission is to connect people, data and action so every learner thrives.
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
					<h2>Join our educator advisory council</h2>
					<p className="muted">
						We collaborate with a global council of superintendents, technology directors and researchers to guide
						our roadmap. Help shape the future of intelligent learning ecosystems.
					</p>
					<a className="btn btn-primary" href="/contact">
						Become an advisor
					</a>
				</div>
			</section>
		</div>
	)
}
