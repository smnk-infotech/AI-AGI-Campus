import React from 'react'

const staff = [
  {name: 'Mr. R. Sharma', role: 'Principal', email: 'r.sharma@school.edu', phone: '+91 98765 10001'},
  {name: 'Ms. L. Chen', role: 'Head of Mathematics', email: 'l.chen@school.edu', phone: '+91 98765 10024'},
  {name: 'Mr. D. Mehta', role: 'Operations Manager', email: 'd.mehta@school.edu', phone: '+91 98765 10045'},
  {name: 'Ms. N. Khan', role: 'Counselor', email: 'n.khan@school.edu', phone: '+91 98765 10100'},
]

export default function Staff(){
  return (
    <div className="page">
      <section className="card">
        <div className="section-header">
          <h3>Staff Directory</h3>
          <button className="btn-secondary">Invite Staff</button>
        </div>
        <ul className="list">
          {staff.map(person => (
            <li key={person.email} className="list-item-split">
              <div>
                <div className="list-title">{person.name}</div>
                <div className="muted small">{person.role}</div>
              </div>
              <div className="list-meta">
                <span>{person.email}</span>
                <span>{person.phone}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
