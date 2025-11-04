import React from 'react'

const studentProfile = {
  name: 'Aarav Kumar',
  grade: '8-B',
  roll: 24,
  advisor: 'Ms. Priya Sharma',
  attendance: '95%',
  currentFocus: 'STEM Innovation Lab'
}

const upcomingEvents = [
  { id: 1, title: 'Parent-Teacher Conference', date: 'Nov 12 · 4:00 PM', location: 'Academic Block C' },
  { id: 2, title: 'Robotics Showcase', date: 'Nov 18 · 5:30 PM', location: 'Innovation Hall' }
]

const recentNotifications = [
  { id: 1, message: 'New grade posted for Mathematics Unit 3.', time: '2h ago' },
  { id: 2, message: 'Fee invoice for Term 2 available for review.', time: '1d ago' },
  { id: 3, message: 'Reminder: Submit field trip consent form.', time: '2d ago' }
]

export default function Dashboard() {
  return (
    <div className="page">
      <section className="page-section profile-grid">
        <article className="card profile-card">
          <header>
            <h3>Student Snapshot</h3>
          </header>
          <dl className="profile-list">
            <div><dt>Name</dt><dd>{studentProfile.name}</dd></div>
            <div><dt>Class / Roll</dt><dd>{studentProfile.grade} · #{studentProfile.roll}</dd></div>
            <div><dt>Advisor</dt><dd>{studentProfile.advisor}</dd></div>
            <div><dt>Attendance</dt><dd>{studentProfile.attendance}</dd></div>
            <div><dt>Focus Area</dt><dd>{studentProfile.currentFocus}</dd></div>
          </dl>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Upcoming Events</h3>
          </header>
          <ul className="list">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <div className="list-title">{event.title}</div>
                <div className="list-sub">{event.date}</div>
                <div className="muted small">{event.location}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Notifications</h3>
          </header>
          <ul className="list">
            {recentNotifications.map((note) => (
              <li key={note.id}>
                <div className="list-title">{note.message}</div>
                <div className="muted small">{note.time}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
