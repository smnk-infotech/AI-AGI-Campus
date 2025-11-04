import React from 'react'

const projects = [
  {
    id: 1,
    name: 'Adaptive Robotics Curriculum',
    phase: 'Prototype Testing',
    collaborators: 'Engineering Dept.',
    milestone: 'Student pilot starts Nov 14'
  },
  {
    id: 2,
    name: 'Ethical AI Lab',
    phase: 'Grant Preparation',
    collaborators: 'AI Research Collective',
    milestone: 'Budget review Nov 9'
  }
]

const publications = [
  {
    id: 1,
    title: 'Evaluating Hybrid Learning Outcomes',
    venue: 'Journal of STEM Education',
    status: 'Accepted · In Press'
  },
  {
    id: 2,
    title: 'Robotics for Inclusive Learning',
    venue: 'ISTE 2026 Proposal',
    status: 'Drafting Abstract · Due Nov 18'
  }
]

const developmentGoals = [
  { id: 1, goal: 'Complete Inclusive Pedagogy micro-credential', progress: '60%' },
  { id: 2, goal: 'Host winter robotics bootcamp planning session', progress: 'Scheduled 11/20' }
]

export default function Research() {
  return (
    <div className="page">
      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Active Projects</h3>
          </header>
          <ul className="list">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="list-title">{project.name}</div>
                <div className="list-sub">{project.collaborators}</div>
                <div className="badge neutral">{project.phase}</div>
                <div className="muted small">Next: {project.milestone}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Publications & Proposals</h3>
          </header>
          <ul className="list">
            {publications.map((item) => (
              <li key={item.id}>
                <div className="list-title">{item.title}</div>
                <div className="list-sub">{item.venue}</div>
                <div className="badge muted">{item.status}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Professional Development</h3>
          </header>
          <ul className="list">
            {developmentGoals.map((goal) => (
              <li key={goal.id}>
                <div className="list-title">{goal.goal}</div>
                <div className="badge neutral">{goal.progress}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
