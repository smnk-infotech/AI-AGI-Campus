import React from 'react'

const students = [
  {name: 'Aarav Kumar', grade: '8-B', guardian: 'R. Kumar', status: 'Enrolled'},
  {name: 'Sara Patel', grade: '9-A', guardian: 'K. Patel', status: 'Enrolled'},
  {name: 'James Lee', grade: '10-C', guardian: 'M. Lee', status: 'Transfer Pending'},
  {name: 'Mia Rodriguez', grade: '11-A', guardian: 'A. Rodriguez', status: 'On Leave'},
]

export default function Students(){
  return (
    <div className="page">
      <section className="card">
        <div className="section-header">
          <h3>Student Directory</h3>
          <button className="btn-secondary">Add Student</button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Primary Guardian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.name}>
                  <td>{student.name}</td>
                  <td>{student.grade}</td>
                  <td>{student.guardian}</td>
                  <td><span className={`badge ${student.status === 'Enrolled' ? 'badge-success' : 'badge-warn'}`}>{student.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
