import React from 'react'

const goals = [
  { id: 1, title: 'Mindfulness Practice', progress: '4 of 6 sessions completed', status: 'On Track' },
  { id: 2, title: 'Robotics Team Fitness Routine', progress: '3 of 4 workouts this week', status: 'Keep Going' }
]

const supportTeam = [
  { id: 1, name: 'Ms. Latha Desai', role: 'Counselor', focus: 'Academic planning' },
  { id: 2, name: 'Coach Amir Rahman', role: 'Athletics Mentor', focus: 'Strength & stamina' }
]

export default function Wellbeing() {
  return (
    <div className="page">
      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Personal Goals</h3>
          </header>
          <ul className="list">
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="list-title">{goal.title}</div>
                <div className="muted small">{goal.progress}</div>
                <span className="badge neutral">{goal.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Support Circle</h3>
          </header>
          <ul className="list">
            {supportTeam.map((member) => (
              <li key={member.id}>
                <div className="list-title">{member.name}</div>
                <div className="list-sub">{member.role}</div>
                <div className="muted tiny">Focus: {member.focus}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Resources</h3>
          </header>
          <ul className="list">
            <li>Guided breathing exercises playlist · 5 minutes.</li>
            <li>After-school homework lab · Monday to Thursday · 4:00 - 5:30 PM.</li>
            <li>Student wellbeing hotline: <strong>+1 (800) 555-1212</strong>.</li>
          </ul>
        </article>
      </section>
    </div>
  )
}
