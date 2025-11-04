import React from 'react'

const offices = [
	{
		location: 'Global HQ',
		address: 'Innovation District, Suite 320\nSan Francisco, CA 94105',
		phone: '+1 (415) 555-8123'
	},
	{
		location: 'India Delivery Center',
		address: 'AI Knowledge Park, Tower B\nBengaluru, KA 560001',
		phone: '+91 80471 20011'
	}
]

export default function Contact() {
	return (
		<div className="page">
			<section className="section container">
				<h1 className="page-title">Let’s design your intelligent campus</h1>
				<p className="muted large">
					Share your objectives and we’ll assemble a tailored walkthrough with benchmarks, implementation plans and
					ROI projections.
				</p>
			</section>

			<section className="section container grid-two">
				<div className="card contact-card">
					<h2>Talk to sales</h2>
					<p className="muted">
						Book a discovery session to map your current systems, automation opportunities and success metrics.
					</p>
					<a className="btn btn-primary" href="mailto:hello@aiagicampus.com?subject=AI-AGI%20Campus%20Demo">
						Email hello@aiagicampus.com
					</a>
				</div>

				<div className="card contact-card">
					<h2>Support center</h2>
					<p className="muted">
						Existing customer? Submit a ticket or access our knowledge base for how-to guides and training kits.
					</p>
					<a className="btn btn-ghost" href="mailto:support@aiagicampus.com">
						support@aiagicampus.com
					</a>
				</div>
			</section>

			<section className="section container">
				<h2>Global offices</h2>
				<div className="grid-two">
					{offices.map((office) => (
						<article key={office.location} className="card">
							<h3>{office.location}</h3>
							<address className="muted">
								{office.address.split('\n').map((line, index) => (
									<React.Fragment key={`${office.location}-${index}`}>
										{line}
										<br />
									</React.Fragment>
								))}
							</address>
							<div className="muted small">Phone: {office.phone}</div>
						</article>
					))}
				</div>
			</section>

			<section className="section container">
				<div className="card contact-card">
					<h2>Stay in the loop</h2>
					<p className="muted">
						Sign up for monthly updates on AI strategies for education, case studies and invite-only webinars.
					</p>
					<form
						className="form"
						onSubmit={(event) => event.preventDefault()}
					>
						<label>
							<span>Email address</span>
							<input type="email" placeholder="you@school.edu" />
						</label>
						<button type="submit" className="btn btn-primary">
							Subscribe
						</button>
					</form>
				</div>
			</section>
		</div>
	)
}
