import React from 'react'

export default function Features(){
  const categories = [
    {
      title: 'Administration',
      features: [
        'Dashboard with real-time KPIs and alerts',
        'Staff and student management',
        'Attendance reconciliation and bulk imports',
        'Fee collection and payment tracking',
        'Automated report generation (CSV/PDF)',
        'Role-based access control',
      ]
    },
    {
      title: 'Academic Management',
      features: [
        'Course and class timetabling',
        'Assignment creation and submission tracking',
        'Grading workflows with rubrics',
        'Exam scheduling and result publishing',
        'Student progress analytics',
        'Parent-teacher communication portal',
      ]
    },
    {
      title: 'AI & Analytics',
      features: [
        'Predict at-risk students with early warning system',
        'Personalized learning recommendations',
        'Workload balancing for teachers',
        'Automated grade prediction and insights',
        'Trend analysis across cohorts',
        'Natural language query interface for reports',
      ]
    },
    {
      title: 'Portals & Mobile',
      features: [
        'Admin dashboard (web + mobile responsive)',
        'Faculty portal with grading and analytics',
        'Student portal with assignments and grades',
        'Parent portal with child progress tracking',
        'Push notifications for announcements',
        'Offline mode for attendance marking',
      ]
    },
    {
      title: 'Integrations',
      features: [
        'SSO via OAuth2/OpenID (Google, Azure AD)',
        'REST API for third-party integrations',
        'Webhook support for events',
        'CSV/Excel bulk import and export',
        'Payment gateway integration',
        'LMS sync (Canvas, Moodle, Blackboard)',
      ]
    },
  ]

  return (
    <div className="page-content container">
      <h1>Features</h1>
      <p className="lead">A comprehensive suite of tools designed for modern schools.</p>

      {categories.map((cat, i) => (
        <section key={i} className="card feature-section">
          <h2>{cat.title}</h2>
          <ul className="feature-list">
            {cat.features.map((f, j) => <li key={j}>{f}</li>)}
          </ul>
        </section>
      ))}

      <div className="cta-section">
        <p>Want to see these features in action?</p>
        <a className="btn btn-primary" href="/contact">Schedule a demo</a>
      </div>
    </div>
  )
}
