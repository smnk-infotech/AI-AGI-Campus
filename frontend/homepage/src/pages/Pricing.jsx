import React from 'react'

const plans = [
	{
		title: 'Launch',
		price: '$499/mo',
		description: 'Ideal for schools digitizing operations for the first time.',
		features: [
			'Core admin dashboard and attendance automation',
			'Faculty, student and parent portals',
			'Email & in-app communications'
		]
	},
	{
		title: 'Scale',
		price: '$899/mo',
		description: 'Designed for multi-campus networks with advanced reporting needs.',
		features: [
			'All Launch features',
			'Predictive analytics & intervention playbooks',
			'Integrations with SIS, LMS and HRIS tools',
			'Slack, Teams and SMS notifications'
		],
		badge: 'Most Popular'
	},
	{
		title: 'Enterprise',
		price: 'Talk to us',
		description: 'Tailored for districts and higher education systems.',
		features: [
			'Custom SLAs & dedicated success architect',
			'Private cloud or on-prem deployment options',
			'Data lake connectors & compliance automation'
		]
	}
]

export default function Pricing() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">Simple pricing that grows with you</h1>
				<p className="muted large">
					Plans include unlimited user seats. Switch or cancel anytime. Nonprofit and public school discounts are
					available.
				</p>
			</section>

			<section className="section container pricing-grid">
				{plans.map((plan) => (
					<article key={plan.title} className={`pricing-card card${plan.badge ? ' pricing-card-featured' : ''}`}>
						<header className="pricing-header">
							<div>
								<h2>{plan.title}</h2>
								<p className="muted">{plan.description}</p>
							</div>
							<div className="price">{plan.price}</div>
						</header>
						<ul className="list">
							{plan.features.map((feature) => (
								<li key={feature}>{feature}</li>
							))}
						</ul>
						<a className="btn btn-primary full" href="/contact">
							Book a walkthrough
						</a>
						{plan.badge ? <span className="badge highlight">{plan.badge}</span> : null}
					</article>
				))}
			</section>

			<section className="section container">
				<div className="faq card">
					<h2>Frequently asked questions</h2>
					<ul className="list">
						<li>
							<strong>Do you support multi-language communications?</strong>
							<div className="muted">Yes, announcements and reminders can be localized into 12 languages.</div>
						</li>
						<li>
							<strong>How fast can we launch?</strong>
							<div className="muted">Most schools go live in under 30 days with our launch playbook.</div>
						</li>
						<li>
							<strong>Is training included?</strong>
							<div className="muted">Yes. Faculty and admin enablement sessions are bundled with every plan.</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
	)
}
