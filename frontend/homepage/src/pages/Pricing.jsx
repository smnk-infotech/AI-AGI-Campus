import React from 'react'

export default function Pricing(){
  const plans = [
    {
      name: 'Community',
      price: 'Free',
      period: 'forever',
      features: [
        'Up to 100 students',
        'Basic dashboards',
        'Email support',
        'Community forum access',
        'Limited integrations',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Standard',
      price: '$2',
      period: 'per student/year',
      features: [
        'Unlimited students',
        'Full admin & faculty portals',
        'AI insights & analytics',
        'Parent & student portals',
        'Email & chat support',
        'All integrations',
        'Custom branding',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Everything in Standard',
        'Multi-campus management',
        'SSO (SAML, OAuth)',
        'Dedicated account manager',
        '99.9% SLA',
        'Priority support',
        'On-premises deployment option',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="page-content container">
      <h1>Pricing</h1>
      <p className="lead">Choose the plan that fits your school's needs.</p>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <div key={i} className={`card pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
            {plan.highlighted && <div className="badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <ul className="feature-list">
              {plan.features.map((f, j) => <li key={j}>✓ {f}</li>)}
            </ul>
            <a className="btn btn-primary" href="/contact">{plan.cta}</a>
          </div>
        ))}
      </div>

      <section className="card">
        <h2>Add-ons</h2>
        <ul>
          <li><strong>SMS Credits:</strong> $0.05 per SMS for notifications</li>
          <li><strong>Advanced Analytics Package:</strong> $500/year — predictive models and custom reports</li>
          <li><strong>Training & Onboarding:</strong> Custom pricing based on school size</li>
        </ul>
      </section>

      <div className="cta-section">
        <p>Not sure which plan is right for you?</p>
        <a className="btn btn-primary" href="/contact">Talk to sales</a>
      </div>
    </div>
  )
}
