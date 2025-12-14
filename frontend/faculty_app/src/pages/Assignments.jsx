import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Assignments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')

  // New assignment state
  const [newTitle, setNewTitle] = useState('')
  const [newCourseId, setNewCourseId] = useState('')
  const [newDueDate, setNewDueDate] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/assignments/`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err?.message || 'Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    if (!newTitle || !newCourseId) return
    try {
      const res = await fetch(`${API_BASE}/api/assignments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          course_id: newCourseId,
          due_date: newDueDate || new Date().toISOString(),
          total_points: 100
        })
      })
      if (!res.ok) throw new Error(`Create failed: ${res.status}`)
      setNewTitle('')
      setNewCourseId('')
      setNewDueDate('')
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to create')
    }
  }

  async function deleteItem(id) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/assignments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Assignments</h3>
          </header>

          <div className="composer" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
            <input className="input" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <input className="input" placeholder="Course ID" value={newCourseId} onChange={e => setNewCourseId(e.target.value)} />
            <input className="input" type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
            <button className="btn btn-primary" onClick={create}>Add</button>
          </div>

          {loading && <div className="muted small">Loading…</div>}
          {error && !loading && <div className="muted small" style={{ color: 'var(--danger)' }}>{error}</div>}
          {!loading && !error && (
            <ul className="list">
              {items.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: 10, border: '1px solid #eee' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div className="muted small">{item.course_id} · Due: {item.due_date}</div>
                  </div>
                  <button className="btn btn-sm" style={{ color: 'red' }} onClick={() => deleteItem(item.id)}>Delete</button>
                </li>
              ))}
              {items.length === 0 && <div className="muted">No assignments found.</div>}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
