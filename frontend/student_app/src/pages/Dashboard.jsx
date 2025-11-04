import React from 'react'

const overviewStats = [
  { id: 1, label: 'GPA', value: '3.8', detail: 'Honors Track' },
  { id: 2, label: 'Attendance', value: '94%', detail: 'On Track' },
  { id: 3, label: 'Credits Earned', value: '18', detail: '6 courses' }
]

const todaySchedule = [
  { id: 1, time: '09:00 - 10:00', subject: 'Mathematics · Algebra II', location: 'Room B204' },
  { id: 2, time: '10:15 - 11:15', subject: 'Science · Robotics Lab', location: 'Innovation Hub' },
  { id: 3, time: '11:30 - 12:15', subject: 'English · Literature', location: 'Room A112' }
]

const alerts = [
  { id: 1, title: 'Submit lab report by Nov 8', type: 'Assignment' },
  { id: 2, title: 'Advising session scheduled Nov 11 · 3:30 PM', type: 'Advising' }
]

export default function Dashboard() {
  return (
    <div className="page">
      <section className="page-section stats">
        {overviewStats.map((stat) => (
          <article key={stat.id} className="card stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="list-title">{stat.label}</div>
            <div className="muted small">{stat.detail}</div>
          </article>
        ))}
      </section>

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Today’s Schedule</h3>
          </header>
          <ul className="list">
            {todaySchedule.map((block) => (
              <li key={block.id}>
                <div className="list-title">{block.subject}</div>
                <div className="list-sub">{block.time}</div>
                <div className="muted tiny">{block.location}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Important Alerts</h3>
          </header>
          <ul className="list">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <div className="list-title">{alert.title}</div>
                <span className="badge neutral">{alert.type}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
