import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'

export default function Advising({ faculty }) {
  const [advisees, setAdvisees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!faculty) return
    const fetchAdvisees = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/faculty/${faculty.id}/advisees`)
        if (res.ok) {
          const data = await res.json()
          setAdvisees(data)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchAdvisees()
  }, [faculty])

  const actionItems = [
    { id: 1, text: 'Review Pending Transcripts' },
    { id: 2, text: 'Approve Spring Semester Schedules' }
    // Could also be dynamic in future
  ]

  if (loading) return <div className="page p-4">Loading roster...</div>

  return (
    <div className="page">
      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Advisee Roster</h3>
            <span className="badge neutral">{advisees.length} students</span>
          </header>
          <ul className="list">
            {advisees.map((advisee) => (
              <li key={advisee.id}>
                <div className="list-title">{advisee.name}</div>
                <div className="list-sub">{advisee.program}</div>
                <div className="muted small">Graduation: {advisee.graduation}</div>
                <div className="muted small">Email: {advisee.email}</div>
              </li>
            ))}
            {advisees.length === 0 && <div className="muted">No students currently enrolled in your courses.</div>}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Action Items</h3>
          </header>
          <ul className="list">
            {actionItems.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
