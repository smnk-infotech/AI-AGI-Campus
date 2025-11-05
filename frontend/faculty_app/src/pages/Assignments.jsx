import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8081'

export default function Assignments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')

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

  async function save(item) {
    setSavingId(item.id)
    try {
      const res = await fetch(`${API_BASE}/api/assignments/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to save')
    } finally {
      setSavingId('')
    }
  }

  function onTitleChange(id, title) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, title } : x)))
  }

  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Assignments</h3>
          </header>
          {loading && <div className="muted small">Loading…</div>}
          {error && !loading && <div className="muted small" style={{ color: 'var(--danger)' }}>{error}</div>}
          {!loading && !error && (
            <ul className="list">
              {items.map((item) => (
                <li key={item.id}>
                  <div className="list-title">
                    <input
                      className="input"
                      value={item.title}
                      onChange={(e) => onTitleChange(item.id, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="list-sub">{item.course_id}</div>
                  <button className="btn btn-primary" onClick={() => save(item)} disabled={savingId === item.id}>
                    {savingId === item.id ? 'Saving…' : 'Save'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
