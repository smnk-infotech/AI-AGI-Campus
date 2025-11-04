import React from 'react'

const teachingStats = [
  { id: 1, label: 'Courses This Term', value: 4 },
  { id: 2, label: 'Students Reached', value: 168 },
  { id: 3, label: 'Avg. Course Rating', value: '4.7 / 5' },
  { id: 4, label: 'Upcoming Advising Sessions', value: 6 }
]

const researchHighlights = [
  {
    id: 1,
    title: 'AI Ethics Grant',
    sponsor: 'NSF',
    amount: '$250K',
    status: 'In Review'
  },
  {
    id: 2,
    title: 'Robotics Journal Submission',
    sponsor: 'IEEE',
    amount: 'N/A',
    status: 'Revisions Due 11/12'
  }
]

const notifications = [
  { id: 1, message: 'Course evaluations window closes Nov 8.' },
  { id: 2, message: 'Upload final project rubric to LMS by Friday.' },
  { id: 3, message: 'Submit conference travel receipts for reimbursement.' }
]

export default function Dashboard() {
  return (
    <div className="page">
      <section className="page-section stats">
        {teachingStats.map((stat) => (
          <article key={stat.id} className="card">
            <h4>{stat.label}</h4>
            <p className="stat-value">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Research Highlights</h3>
          </header>
          <ul className="list">
            {researchHighlights.map((item) => (
              <li key={item.id}>
                <div className="list-title">{item.title}</div>
                <div className="list-sub">{item.sponsor}</div>
                <div className="badge neutral">{item.amount}</div>
                <div className="badge muted">{item.status}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Notifications</h3>
          </header>
          <ul className="list">
            {notifications.map((note) => (
              <li key={note.id}>{note.message}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
