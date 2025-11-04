import React from 'react'

const weeklySchedule = [
  {
    day: 'Monday',
    sessions: [
      { time: '09:00 - 10:15', title: 'PHY101 Lecture', location: 'Science A201' },
      { time: '13:00 - 14:00', title: 'Office Hours', location: 'Faculty Hub 4' }
    ]
  },
  {
    day: 'Tuesday',
    sessions: [
      { time: '10:30 - 12:00', title: 'MTH240 Discussion', location: 'Math B102' },
      { time: '15:00 - 16:00', title: 'Research Lab Sync', location: 'Innovation Lab' }
    ]
  },
  {
    day: 'Wednesday',
    sessions: [
      { time: '09:00 - 10:15', title: 'PHY101 Lecture', location: 'Science A201' },
      { time: '11:00 - 12:30', title: 'CSE330 Workshop', location: 'Innovation Lab 3' }
    ]
  },
  {
    day: 'Thursday',
    sessions: [
      { time: '14:00 - 15:15', title: 'MTH240 Online', location: 'Virtual Classroom' }
    ]
  },
  {
    day: 'Friday',
    sessions: [
      { time: '09:30 - 11:00', title: 'Grant Planning', location: 'Research Commons' },
      { time: '13:00 - 15:00', title: 'Capstone Reviews', location: 'Innovation Lab 1' }
    ]
  }
]

export default function Schedule() {
  return (
    <div className="page">
      <section className="page-section grid-auto">
        {weeklySchedule.map((day) => (
          <article key={day.day} className="card">
            <header className="section-header">
              <h3>{day.day}</h3>
            </header>
            <ul className="list">
              {day.sessions.map((session) => (
                <li key={session.title}>
                  <div className="list-title">{session.title}</div>
                  <div className="list-sub">{session.time}</div>
                  <div className="muted small">{session.location}</div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}
