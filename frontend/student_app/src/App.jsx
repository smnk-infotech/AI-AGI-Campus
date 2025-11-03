import React from 'react'

export default function App(){
  const timetable = [
    {time:'09:00', subject:'Mathematics'},
    {time:'10:15', subject:'Science'},
    {time:'11:30', subject:'English'},
  ]

  const assignments = [
    {id:1,title:'Math: Algebra worksheet', due:'2025-11-04'},
    {id:2,title:'Science: Lab report', due:'2025-11-08'},
  ]

  const progress = [
    {subject:'Math', percent:88},
    {subject:'Science', percent:92},
    {subject:'English', percent:78},
  ]

  return (
    <div className="app page-student">
      <header className="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Your timetable, assignments and progress at a glance.</p>
        </div>
      </header>

      <main>
        <section className="card">
          <h3>Today's Timetable</h3>
          <ul className="events">
            {timetable.map((t,i)=> <li key={i}><strong>{t.time}</strong> — {t.subject}</li>)}
          </ul>
        </section>

        <section className="two-col">
          <div className="card">
            <h3>Assignments</h3>
            <ul className="activity">
              {assignments.map(a=> <li key={a.id}>{a.title} <span className="muted">(due {a.due})</span></li>)}
            </ul>
          </div>

          <div className="card">
            <h3>Progress</h3>
            <ul className="progress-list">
              {progress.map((p,i)=> (
                <li key={i}><div className="progress-subject">{p.subject}</div>
                  <div className="progress-bar"><div style={{width: p.percent + '%'}} className="progress-fill"/></div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
