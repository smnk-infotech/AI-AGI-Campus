import React from 'react'

const stats = [
  {label: 'Active Students', value: '1,248'},
  {label: 'Teachers', value: '78'},
  {label: 'Attendance This Week', value: '92%'},
  {label: 'Pending Fees', value: '$18.4k'},
]

const upcoming = [
  {title: 'Parent-Teacher Conference', date: 'Nov 05, 2025', owner: 'Academic Office'},
  {title: 'Winter Term Planning', date: 'Nov 12, 2025', owner: 'Operations'},
  {title: 'Audit Submission', date: 'Nov 28, 2025', owner: 'Finance'},
]

const alerts = [
  'Bus Route 4 experiencing delays — notify parents',
  '5 teacher contracts expiring this quarter',
  'Server maintenance scheduled on Nov 10, 9PM',
]

export default function Dashboard(){
  return (
    <div className="page">
      <div className="cards-grid">
        {stats.map(item => (
          <div key={item.label} className="card stat-card">
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="two-column">
        <section className="card">
          <div className="section-header">
            <h3>Upcoming Events</h3>
            <a href="#" className="muted small">View calendar</a>
          </div>
          <ul className="list">
            {upcoming.map(item => (
              <li key={item.title}>
                <div className="list-title">{item.title}</div>
                <div className="muted small">{item.date} · {item.owner}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="section-header">
            <h3>Operational Alerts</h3>
            <a href="#" className="muted small">Resolve</a>
          </div>
          <ul className="list">
            {alerts.map(item => (
              <li key={item}>
                <div className="list-title">{item}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
