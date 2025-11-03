import React from 'react'

function CourseCard({course}){
  return (
    <div className="card course-card">
      <h4>{course.name}</h4>
      <div className="muted small">{course.code} · {course.room}</div>
      <div className="small">Students: <strong>{course.students}</strong></div>
    </div>
  )
}

export default function App(){
  const courses = [
    {id:1,name:'Physics - Mechanics',code:'PHY101',room:'A201',students:36},
    {id:2,name:'Mathematics - Algebra',code:'MTH201',room:'B102',students:42},
    {id:3,name:'Computer Science',code:'CSE301',room:'Lab 3',students:28},
  ]

  const schedule = [
    {time:'09:00 - 10:00', title:'Physics Lecture'},
    {time:'10:15 - 11:15', title:'Mathematics Tutorial'},
    {time:'11:30 - 12:30', title:'CS Lab'},
  ]

  const announcements = [
    {id:1,text:'Submit mid-term grades by Nov 10.'},
    {id:2,text:'Faculty meeting on Nov 3 at 3PM.'},
  ]

  return (
    <div className="app page-faculty">
      <header className="page-header">
        <div>
          <h1>Faculty Dashboard</h1>
          <p>Your courses, schedule and recent announcements.</p>
        </div>
      </header>

      <main>
        <section className="courses-grid">
          {courses.map(c => <CourseCard key={c.id} course={c} />)}
        </section>

        <section className="two-col">
          <div className="card">
            <h3>Today's Schedule</h3>
            <ul className="events">
              {schedule.map((s,i) => <li key={i}><strong>{s.time}</strong> — {s.title}</li>)}
            </ul>
          </div>

          <div className="card">
            <h3>Announcements</h3>
            <ul className="activity">
              {announcements.map(a => <li key={a.id}>{a.text}</li>)}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
