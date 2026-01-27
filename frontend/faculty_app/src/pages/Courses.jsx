import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'

export default function Courses({ faculty }) {
  const [courses, setCourses] = useState([])

  // Form State
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/courses/`)
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!name || !code || !faculty) return
    await fetch(`${API_BASE}/api/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, description: desc, faculty_id: faculty.id })
    })
    setName(''); setCode(''); setDesc('')
    load()
  }

  if (!faculty) return <div className="page p-4">Loading faculty context...</div>

  return (
    <div className="page">
      <section className="page-section">
        <header className="section-header">
          <h3>Manage Courses</h3>
        </header>

        <div className="card composer" style={{ marginBottom: 20 }}>
          <h4>Add New Course</h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="input" placeholder="Course Name (e.g. Intro to AI)" value={name} onChange={e => setName(e.target.value)} />
            <input className="input" placeholder="Code (e.g. CS101)" value={code} onChange={e => setCode(e.target.value)} />
            <input className="input" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={create}>Create Course</button>
          </div>
        </div>

        <div className="card">
          {loading && <div className="muted">Loading...</div>}
          <ul className="list">
            {courses.map(c => (
              <li key={c.id}>
                <div className="list-title">{c.name} <span className="badge">{c.code}</span></div>
                <div className="muted small">{c.description}</div>
              </li>
            ))}
            {!loading && courses.length === 0 && <div className="muted">No courses found.</div>}
          </ul>
        </div>
      </section>
    </div>
  )
}
