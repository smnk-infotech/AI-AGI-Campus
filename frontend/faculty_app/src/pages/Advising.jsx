import React from 'react'

const advisees = [
  {
    id: 1,
    name: 'Liam Nguyen',
    program: 'B.S. Computer Science',
    graduation: 'Spring 2026',
    nextMeeting: 'Nov 6 · 2:00 PM',
    focus: 'Internship placement'
  },
  {
    id: 2,
    name: 'Sophia Carter',
    program: 'B.S. Physics',
    graduation: 'Fall 2025',
    nextMeeting: 'Nov 7 · 11:30 AM',
    focus: 'Graduate school planning'
  },
  {
    id: 3,
    name: 'Ethan Perez',
    program: 'B.Eng. Robotics',
    graduation: 'Spring 2027',
    nextMeeting: 'Nov 8 · 3:15 PM',
    focus: 'Capstone project scope'
  }
]

const actionItems = [
  { id: 1, text: 'Review Liam’s internship resume before Nov 5.' },
  { id: 2, text: 'Send graduate recommendation form to Sophia.' },
  { id: 3, text: 'Share robotics competition resources with Ethan.' }
]

export default function Advising() {
  return (
    <div className="page">
      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Advisee Roster</h3>
            <span className="badge neutral">{advisees.length} students</span>
          </header>
          <ul className="list">
            {advisees.map((advisee) => (
              <li key={advisee.id}>
                <div className="list-title">{advisee.name}</div>
                <div className="list-sub">{advisee.program}</div>
                <div className="muted small">Graduation: {advisee.graduation}</div>
                <div className="badge muted">Next: {advisee.nextMeeting}</div>
                <div className="muted small">Focus: {advisee.focus}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Action Items</h3>
          </header>
          <ul className="list">
            {actionItems.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
