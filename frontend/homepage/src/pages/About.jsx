import React from 'react'

export default function About(){
  return (
    <div className="page-content container">
      <h1>About AI‑AGI Campus</h1>
      <p className="lead">We're building the future of school management — intelligent, automated, and accessible.</p>
      
      <section className="card">
        <h2>Our Mission</h2>
        <p>To empower educational institutions with modern technology that reduces administrative burden, enhances learning outcomes, and strengthens the connection between schools, students, and families.</p>
      </section>

      <section className="card">
        <h2>Why We Built This</h2>
        <p>Traditional school management systems are fragmented, hard to use, and lack modern analytics. We saw an opportunity to create a unified platform that:</p>
        <ul>
          <li>Consolidates attendance, grading, scheduling, and communication</li>
          <li>Uses AI to surface actionable insights for educators</li>
          <li>Provides role-specific portals that are intuitive and mobile-friendly</li>
          <li>Integrates seamlessly with existing systems</li>
        </ul>
      </section>

      <section className="card">
        <h2>Our Team</h2>
        <p>We're a team of educators, engineers, and product designers who believe technology should serve learning — not complicate it. Our combined experience spans education technology, AI/ML, and enterprise software.</p>
      </section>

      <section className="card">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Privacy First:</strong> Student data is protected with enterprise-grade security.</li>
          <li><strong>Accessibility:</strong> Designed to work for everyone, everywhere.</li>
          <li><strong>Continuous Improvement:</strong> We ship features based on real feedback from educators.</li>
        </ul>
      </section>

      <div className="cta-section">
        <p>Ready to see AI‑AGI Campus in action?</p>
        <a className="btn btn-primary" href="/contact">Request a demo</a>
      </div>
    </div>
  )
}
