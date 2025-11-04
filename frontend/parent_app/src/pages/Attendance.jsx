import React from 'react'

const monthlyAttendance = [
  { month: 'September 2025', present: 20, total: 22 },
  { month: 'October 2025', present: 21, total: 22 },
  { month: 'November 2025', present: 8, total: 10 }
]

const eligibilitySummary = [
  { id: 1, title: 'Overall Attendance', value: '95%', status: 'On Track' },
  { id: 2, title: 'Co-curricular Participation', value: '4 activities', status: 'Above Goal' }
]

export default function Attendance() {
  return (
    <div className="page">
      <section className="page-section stats">
        {eligibilitySummary.map((item) => (
          <article key={item.id} className="card">
            <div className="list-title">{item.title}</div>
            <div className="stat-value">{item.value}</div>
            <div className="badge neutral">{item.status}</div>
          </article>
        ))}
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Monthly Breakdown</h3>
            <span className="muted small">Tap each month to view daily details in the mobile app.</span>
          </header>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Present Days</th>
                  <th>Total Days</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAttendance.map((month) => (
                  <tr key={month.month}>
                    <td>{month.month}</td>
                    <td>{month.present}</td>
                    <td>{month.total}</td>
                    <td>{Math.round((month.present / month.total) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  )
}
