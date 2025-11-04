import React from 'react'

const upcomingAssignments = [
  {
    id: 1,
    title: 'Algebra II Problem Set 4',
    course: 'Mathematics',
    due: 'Nov 6, 11:59 PM',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Robotics Lab Report',
    course: 'Science',
    due: 'Nov 8, 9:00 PM',
    status: 'Drafting'
  },
  {
    id: 3,
    title: 'Literary Analysis Essay',
    course: 'English',
    due: 'Nov 16, 11:59 PM',
    status: 'Not Started'
  }
]

const completedAssignments = [
  { id: 4, title: 'Physics Concept Map', course: 'Science', submitted: 'Oct 28', score: '92%' },
  { id: 5, title: 'Vocabulary Quiz', course: 'English', submitted: 'Oct 30', score: '88%' }
]

export default function Assignments() {
  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Upcoming</h3>
          </header>
          <ul className="list">
            {upcomingAssignments.map((item) => (
              <li key={item.id}>
                <div className="list-title">{item.title}</div>
                <div className="list-sub">{item.course}</div>
                <div className="muted small">Due {item.due}</div>
                <span className="badge neutral">{item.status}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Recently Submitted</h3>
          </header>
          <ul className="list">
            {completedAssignments.map((item) => (
              <li key={item.id}>
                <div className="list-title">{item.title}</div>
                <div className="list-sub">{item.course}</div>
                <div className="muted tiny">Submitted {item.submitted}</div>
                <span className="badge success">Score {item.score}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
