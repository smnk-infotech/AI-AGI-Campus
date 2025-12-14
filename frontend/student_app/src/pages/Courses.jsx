import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
const STUDENT_ID = "53576fbc-5bde-46ac-b4d7-48eeed9b5f126" // Seeded Aarav ID

export default function Courses() {
  const [myCourses, setMyCourses] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [my, all] = await Promise.all([
        fetch(`${API_BASE}/api/courses/my/${STUDENT_ID}`).then(r => r.json()),
        fetch(`${API_BASE}/api/courses/`).then(r => r.json())
      ])
      setMyCourses(my || [])
      setAllCourses(all || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function enroll(courseId) {
    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: STUDENT_ID })
      })
      if (res.ok) {
        alert("Enrolled!")
        load()
      } else {
        const d = await res.json()
        alert(d.message || "Failed")
      }
    } catch (e) { console.error(e) }
  }

  // Filter out already enrolled courses from "Available"
  const available = allCourses.filter(c => !myCourses.find(m => m.id === c.id))

  return (
    <div className="page">
      <section className="page-section">
        <header className="section-header"><h3>My Courses</h3></header>
        <div className="card">
          <ul className="list">
            {myCourses.map(c => (
              <li key={c.id}>
                <div className="list-title">{c.name} <span className="badge success">{c.code}</span></div>
                <div className="muted small">{c.description}</div>
              </li>
            ))}
            {myCourses.length === 0 && <div className="muted">You are not enrolled in any courses.</div>}
          </ul>
        </div>
      </section>

      <section className="page-section">
        <header className="section-header"><h3>Available Courses</h3></header>
        <div className="card">
          <ul className="list">
            {available.map(c => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="list-title">{c.name} <span className="badge">{c.code}</span></div>
                  <div className="muted small">{c.description}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => enroll(c.id)}>Enroll</button>
              </li>
            ))}
            {!loading && available.length === 0 && <div className="muted">No other courses available.</div>}
          </ul>
        </div>
      </section>
    </div>
  )
}
