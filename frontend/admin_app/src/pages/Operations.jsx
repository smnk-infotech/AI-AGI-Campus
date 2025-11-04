import React from 'react'

const attendance = [
  {className: 'Grade 8-B', present: 31, total: 34, trend: '+2%'},
  {className: 'Grade 9-A', present: 29, total: 30, trend: '-1%'},
  {className: 'Grade 10-C', present: 32, total: 33, trend: '+0%'},
]

const transport = [
  {route: 'Route 1', driver: 'V. Singh', status: 'On Time'},
  {route: 'Route 2', driver: 'T. Patel', status: 'Maintenance'},
  {route: 'Route 3', driver: 'S. Bose', status: 'On Time'},
]

export default function Operations(){
  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <h3>Attendance Overview</h3>
          <a href="#" className="muted small">Download report</a>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Present</th>
                <th>Total</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(item => (
                <tr key={item.className}>
                  <td>{item.className}</td>
                  <td>{item.present}</td>
                  <td>{item.total}</td>
                  <td>{item.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="card">
        <div className="section-header">
          <h3>Transport Status</h3>
          <a href="#" className="muted small">Manage routes</a>
        </div>
        <ul className="list">
          {transport.map(item => (
            <li key={item.route} className="list-item-split">
              <div className="list-title">{item.route}</div>
              <div className="muted small">Driver: {item.driver}</div>
              <span className={`badge ${item.status === 'On Time' ? 'badge-success' : 'badge-warn'}`}>{item.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
