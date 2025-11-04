import React from 'react'

const reports = [
  {name: 'Monthly Finance Summary', type: 'Finance', status: 'Ready', updated: 'Nov 1, 2025'},
  {name: 'Attendance Variance', type: 'Academic', status: 'Processing', updated: 'Oct 31, 2025'},
  {name: 'Admissions Pipeline', type: 'Admissions', status: 'Ready', updated: 'Oct 28, 2025'},
]

export default function Reports(){
  return (
    <div className="page">
      <section className="card">
        <div className="section-header">
          <h3>Reports & Exports</h3>
          <button className="btn-secondary">Schedule Report</button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.name}>
                  <td>{report.name}</td>
                  <td>{report.type}</td>
                  <td><span className={`badge ${report.status === 'Ready' ? 'badge-success' : 'badge-warn'}`}>{report.status}</span></td>
                  <td>{report.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
