import React, { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Assignments({ student }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submittedIds, setSubmittedIds] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!student) return
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${API_BASE}/api/assignments/`)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load assignments')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [student])

  function submit(id) {
    if (confirm("Submit this assignment? (Simulation)")) {
      setSubmittedIds(prev => new Set(prev).add(id))
    }
  }

  const now = new Date()
  const { upcoming, past } = useMemo(() => {
    const up = []
    const pa = []
    for (const a of items) {
      const due = a?.due_date ? new Date(a.due_date) : null
      const course = a?.course_id || 'Course'
      const title = a?.title || 'Untitled assignment'
      const id = a?.id || `${title}-${course}`
      const userSubmitted = submittedIds.has(id)

      const display = {
        id,
        title,
        course,
        dueText: due ? due.toLocaleString() : 'TBD',
        status: userSubmitted ? 'Submitted' : 'Open'
      }
      if (due && due < now) pa.push(display)
      else up.push(display)
    }
    return { upcoming: up, past: pa }
  }, [items, submittedIds])

  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Upcoming</h3>
          </header>
          {loading && <div className="muted small">Loading assignments…</div>}
          {error && !loading && <div className="muted small" style={{ color: 'var(--danger)' }}>{error}</div>}
          {!loading && !error && (
            <ul className="list">
              {upcoming.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="list-title">{item.title}</div>
                    <div className="list-sub">{item.course}</div>
                    <div className="muted small">Due {item.dueText}</div>
                  </div>
                  <div>
                    {item.status === 'Submitted' ? (
                      <span className="badge success">Submitted</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => submit(item.id)}>Submit</button>
                    )}
                  </div>
                </li>
              ))}
              {upcoming.length === 0 && <li className="muted small">No upcoming assignments.</li>}
            </ul>
          )}
        </article>
      </section>

      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Recently Closed</h3>
          </header>
          {!loading && !error && (
            <ul className="list">
              {past.map((item) => (
                <li key={item.id}>
                  <div className="list-title">{item.title}</div>
                  <div className="list-sub">{item.course}</div>
                  <div className="muted tiny">Closed {item.dueText}</div>
                  <span className="badge success">Completed</span>
                </li>
              ))}
              {past.length === 0 && <li className="muted small">No recent assignments.</li>}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
