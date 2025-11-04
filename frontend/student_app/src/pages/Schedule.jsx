import React from 'react'

const weeklyCalendar = [
  {
    day: 'Monday',
    blocks: [
      { time: '08:30', title: 'Mentor Check-in', location: 'Advising Center' },
      { time: '09:00', title: 'Mathematics - Algebra II', location: 'Room B204' },
      { time: '11:30', title: 'English Workshop', location: 'Room A112' }
    ]
  },
  {
    day: 'Tuesday',
    blocks: [
      { time: '09:00', title: 'Science - Robotics Lab', location: 'Innovation Hub' },
      { time: '13:30', title: 'Design Thinking Lab', location: 'Makerspace' }
    ]
  },
  {
    day: 'Wednesday',
    blocks: [
      { time: '09:00', title: 'Mathematics - Algebra II', location: 'Room B204' },
      { time: '10:15', title: 'Global Studies Seminar', location: 'Room C310' },
      { time: '15:00', title: 'Robotics Club', location: 'Innovation Hub' }
    ]
  },
  {
    day: 'Thursday',
    blocks: [
      { time: '08:45', title: 'Wellness Advisory', location: 'Commons' },
      { time: '10:15', title: 'Science - Robotics Lab', location: 'Innovation Hub' }
    ]
  },
  {
    day: 'Friday',
    blocks: [
      { time: '09:00', title: 'Mathematics - Algebra II', location: 'Room B204' },
      { time: '11:30', title: 'English Symposium', location: 'Auditorium' },
      { time: '14:30', title: 'Student Leadership Council', location: 'Learning Commons' }
    ]
  }
]

export default function Schedule() {
  return (
    <div className="page">
      <section className="page-section grid-auto">
        {weeklyCalendar.map((day) => (
          <article key={day.day} className="card">
            <header className="section-header">
              <h3>{day.day}</h3>
            </header>
            <ul className="list">
              {day.blocks.map((block) => (
                <li key={`${day.day}-${block.time}`}>
                  <div className="list-title">{block.title}</div>
                  <div className="list-sub">{block.time}</div>
                  <div className="muted tiny">{block.location}</div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}
