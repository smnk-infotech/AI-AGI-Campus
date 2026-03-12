import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Advising({ faculty }) {
  const [advisees, setAdvisees] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!faculty) return
    const fetchAdvisees = async () => {
      try {
        // Fallback to general students if advisees endpoint is mock/missing
        const data = await api.getStudents()
        // Map to expected format
        const mapped = data.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          program: s.major,
          graduation: `Year ${s.year}`,
          email: s.email
        }))
        setAdvisees(mapped)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvisees()
  }, [faculty])

  const handleMarkAttendance = async (studentId, name, status) => {
    try {
      await api.markAttendance(null, studentId, status)
      setMessage(`Successfully marked ${name} as ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      alert('Failed to mark attendance: ' + e.message)
    }
  }

  const actionItems = [
    { id: 1, text: 'Review Pending Transcripts' },
    { id: 2, text: 'Approve Spring Semester Schedules' }
  ]

  if (loading) return <div className="page p-4">Loading roster...</div>

  return (
    <div className="page">
      {message && (
        <div style={{
          position: 'fixed', top: 20, right: 20, backgroundColor: '#10b981',
          color: 'white', padding: '10px 20px', borderRadius: 8, zIndex: 1001,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      )}

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Class Roster & Attendance</h3>
            <span className="badge neutral">{advisees.length} students</span>
          </header>
          <ul className="list">
            {advisees.map((advisee) => (
              <li key={advisee.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div className="list-title">{advisee.name}</div>
                  <div className="list-sub">{advisee.program} • {advisee.graduation}</div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleMarkAttendance(advisee.id, advisee.name, 'Present')}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Present
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAttendance(advisee.id, advisee.name, 'Absent')}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Absent
                  </button>
                </div>
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
