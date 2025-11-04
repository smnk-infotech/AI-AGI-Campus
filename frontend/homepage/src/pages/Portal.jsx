import React, { useMemo, useState } from 'react'

const DESTINATIONS = {
  admin: '/admin',
  faculty: '/faculty',
  teacher: '/faculty',
  staff: '/faculty',
  student: '/student'
}

const EMAIL_ROLE_MAP = {
  'admin@gmail.com': 'admin',
  'teacher@gmail.com': 'faculty',
  'student@gmail.com': 'student'
}

const experiences = [
  {
    id: 'admin',
    title: 'Administrator Console',
    description:
      'Coordinate campus operations, monitor analytics, and launch AI copilots for finance, facilities, and academics.',
    path: DESTINATIONS.admin
  },
  {
    id: 'faculty',
    title: 'Faculty & Staff Workspace',
    description:
      'Manage courses, schedules, advisees, and research projects with automation that keeps classrooms running smoothly.',
    path: DESTINATIONS.faculty
  },
  {
    id: 'student',
    title: 'Student Experience Hub',
    description:
      'Track assignments, schedules, wellbeing goals, and personalized insights that accelerate learning.',
    path: DESTINATIONS.student
  }
]

const demoCredentials = [
  { role: 'Administrator', email: 'admin@gmail.com', destination: DESTINATIONS.admin },
  { role: 'Faculty / Teacher', email: 'teacher@gmail.com', destination: DESTINATIONS.faculty },
  { role: 'Student', email: 'student@gmail.com', destination: DESTINATIONS.student }
]

const resolveRole = (email) => {
  if (!email) return null
  const normalized = email.toLowerCase()
  if (EMAIL_ROLE_MAP[normalized]) return EMAIL_ROLE_MAP[normalized]
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('staff') || normalized.includes('faculty') || normalized.includes('teacher')) return 'faculty'
  if (normalized.includes('student')) return 'student'
  if (normalized.includes('parent') || normalized.includes('guardian')) return 'parent'
  return null
}

export default function Portal() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  const portalCards = useMemo(
    () => experiences.filter((item) => Boolean(item.path)),
    []
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')

    const trimmed = email.trim()
    if (!trimmed) {
      setStatus('error')
      setMessage('Enter your school email address to continue.')
      return
    }

    const role = resolveRole(trimmed)
    if (!role) {
      setStatus('error')
      setMessage('We could not determine your access level from that address. Contact support for manual provisioning.')
      return
    }

    const target = DESTINATIONS[role]
    if (!target) {
      setStatus('error')
      setMessage('No destination has been configured for that role yet. Please reach out to the IT team.')
      return
    }

    setStatus('redirect')
    setMessage('Redirecting you to the appropriate workspace…')
    window.location.href = target
  }

  return (
    <div className="page portal-page">
      <section className="section container">
        <h1 className="page-title">Access your AI-AGI Campus console</h1>
        <p className="muted large">
          Use your verified school email address to jump directly into the workspace that matches your role. The system
          will route administrators, faculty/staff, students, and parents to the right experience automatically.
        </p>
      </section>

      <section className="section container portal-layout">
        <article className="card portal-form">
          <h2>Quick login</h2>
          <p className="muted small">
            We look for role keywords inside the email address (for example <code>admin@</code>, <code>student@</code>,
            or <code>faculty@</code>). Adjust the destinations below to match your deployment URLs.
          </p>
          <div className="portal-credentials card">
            <h3 className="small">Demo credentials</h3>
            <ul className="credential-list">
              {demoCredentials.map((item) => (
                <li key={item.email}>
                  <span className="credential-role">{item.role}:</span> <code>{item.email}</code>
                </li>
              ))}
            </ul>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary">
              {status === 'redirect' ? 'Redirecting…' : 'Continue'}
            </button>
          </form>
          {message ? <div className={`portal-message ${status}`}>{message}</div> : null}
        </article>

        <article className="card portal-help">
          <h2>Need to customise the routing?</h2>
          <p className="muted small">
            Update the <code>DESTINATIONS</code> map in <code>Portal.jsx</code> to point to the production URLs for each
            workspace. Example:
          </p>
          <pre className="portal-snippet">{`const DESTINATIONS = {
  admin: 'https://campus.example.com/admin',
  staff: 'https://campus.example.com/faculty',
  student: 'https://campus.example.com/student'
}`}</pre>
          <p className="muted small">
            Authentication should be managed by your identity provider—this entry point simply forwards users after
            verifying their email pattern.
          </p>
        </article>
      </section>

      <section className="section container">
        <h2>Available workspaces</h2>
        <div className="portal-grid">
          {portalCards.map((card) => (
            <article key={card.id} className="card role-card">
              <div className="badge neutral role-tag">{card.title.split(' ')[0]}</div>
              <h3>{card.title}</h3>
              <p className="muted small">{card.description}</p>
              {card.path ? (
                <a className="btn btn-ghost" href={card.path}>
                  Open {card.title}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
