import React from 'react'

export default function App(){
  const child = {name:'Aarav Kumar', class:'8-B', roll:24, attendance:'95%', guardian:'Mr. R. Kumar'}
  const attendance = [
    {month:'Sep 2025', present:20, total:22},
    {month:'Oct 2025', present:21, total:22},
  ]
  const grades = [
    {subject:'Math', grade:'A'},
    {subject:'Science', grade:'A-'},
    {subject:'English', grade:'B+'},
  ]

  return (
    <div className="app page-parent">
      <header className="page-header">
        <div>
          <h1>Parent Portal</h1>
          <p>Overview for your child and recent updates.</p>
        </div>
      </header>

      <main>
        <section className="card child-profile">
          <h3>Child Profile</h3>
          <div><strong>Name:</strong> {child.name}</div>
          <div><strong>Class:</strong> {child.class} · Roll #{child.roll}</div>
          <div><strong>Attendance:</strong> {child.attendance}</div>
          <div><strong>Guardian:</strong> {child.guardian}</div>
        </section>

        <section className="two-col">
          <div className="card">
            <h3>Attendance</h3>
            <table className="table">
              <thead><tr><th>Month</th><th>Present</th><th>Total</th></tr></thead>
              <tbody>
                {attendance.map((a,i) => <tr key={i}><td>{a.month}</td><td>{a.present}</td><td>{a.total}</td></tr>)}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Recent Grades</h3>
            <ul className="activity">
              {grades.map((g,i)=> <li key={i}><strong>{g.subject}:</strong> {g.grade}</li>)}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
