import React from 'react'

const solutionAreas = [
	{
		title: 'Administrative Acceleration',
		points: [
			'Role-based dashboards consolidate finance, HR, admissions and compliance KPIs.',
			'Automated attendance reconciliation, payroll calculations and vendor payouts.',
			'AI-driven anomaly detection flags budget variances and facilities issues early.'
		]
	},
	{
		title: 'Teaching & Learning',
		points: [
			'Curriculum planners with prerequisite checks and drag-and-drop timetable authoring.',
			'Assignment workflows connect LMS rubrics, auto-grading and student feedback loops.',
			'Adaptive study plans recommend enrichment activities based on performance trends.'
		]
	},
	{
		title: 'Family Engagement',
		points: [
			'Real-time student progress, attendance alerts and secure messaging in one mobile-ready portal.',
			'Automated reminders for invoices, meetings and sign-offs, localized in 12 languages.',
			'AI concierge surfaces FAQs, school policies and next best actions 24/7.'
		]
	},
	{
		title: 'Insights & Compliance',
		points: [
			'Predict graduation readiness, intervention impact and resource utilization with ML models.',
			'Export-ready compliance packages for district and ministry reporting standards.',
			'Data lake connectors stream metrics into Power BI, Tableau and Looker studios.'
		]
	}
]

const integrations = [
	'Google Workspace',
	'Microsoft 365',
	'Canvas',
	'Moodle',
	'PowerSchool',
	'Slack',
	'Zoom'
]

export default function Features() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">Features tailored to every department</h1>
				<p className="muted large">
					AI-AGI Campus blends modern design, deep education expertise and automation so your teams can focus on
					learning outcomes instead of repetitive tasks.
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
				<h2>Enterprise-grade integrations</h2>
				<p className="muted">
					Plug into the systems your teams already rely on. Our open APIs and data lake exporters ensure your
					records stay in sync.
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
					<h2>Give your school an intelligent command center</h2>
					<p className="muted">
						Schedule a guided tour with our education technologists to map AI-AGI Campus to your operating model.
					</p>
					<a className="btn btn-primary" href="/contact">
						Talk to our team
					</a>
				</div>
			</section>
		</div>
	)
}
