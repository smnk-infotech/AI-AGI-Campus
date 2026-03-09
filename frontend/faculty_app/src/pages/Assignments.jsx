import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'

export default function Assignments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // New assignment state
  const [form, setForm] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    description: '',
    totalPoints: 100,
    rubricCriteria: [{ name: 'Clarity', points: 25 }, { name: 'Correctness', points: 50 }, { name: 'Completeness', points: 25 }],
    pointAllocations: { submission: 60, participation: 20, quality: 20 },
    gradingScale: { A: 90, B: 80, C: 70, D: 60, F: 0 }
  })

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
    if (!form.title || !form.courseId) {
      alert('Title and Course ID are required')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/assignments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          course_id: form.courseId,
          due_date: form.dueDate || new Date().toISOString(),
          description: form.description,
          total_points: form.totalPoints,
          rubric_criteria: form.rubricCriteria,
          point_allocations: form.pointAllocations,
          grading_scale: form.gradingScale
        })
      })
      if (!res.ok) throw new Error(`Create failed: ${res.status}`)
      setForm({
        title: '',
        courseId: '',
        dueDate: '',
        description: '',
        totalPoints: 100,
        rubricCriteria: [{ name: 'Clarity', points: 25 }, { name: 'Correctness', points: 50 }, { name: 'Completeness', points: 25 }],
        pointAllocations: { submission: 60, participation: 20, quality: 20 },
        gradingScale: { A: 90, B: 80, C: 70, D: 60, F: 0 }
      })
      setShowCreateForm(false)
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

  const handleRubricChange = (idx, field, value) => {
    const updated = [...form.rubricCriteria]
    updated[idx] = { ...updated[idx], [field]: field === 'points' ? parseInt(value) || 0 : value }
    setForm({ ...form, rubricCriteria: updated })
  }

  const addRubricItem = () => {
    setForm({
      ...form,
      rubricCriteria: [...form.rubricCriteria, { name: '', points: 0 }]
    })
  }

  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Assignments</h3>
            <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : '+ New Assignment'}
            </button>
          </header>

          {showCreateForm && (
            <div style={{ 
              padding: '16px', 
              marginBottom: '20px', 
              background: '#f5f5f5', 
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h4>Create New Assignment</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Title *</label>
                  <input 
                    className="input" 
                    placeholder="e.g., Problem Set 1" 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Course ID *</label>
                  <input 
                    className="input" 
                    placeholder="Course UUID" 
                    value={form.courseId} 
                    onChange={e => setForm({ ...form, courseId: e.target.value })} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Due Date</label>
                  <input 
                    className="input" 
                    type="datetime-local" 
                    value={form.dueDate} 
                    onChange={e => setForm({ ...form, dueDate: e.target.value })} 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Total Points</label>
                  <input 
                    className="input" 
                    type="number" 
                    value={form.totalPoints} 
                    onChange={e => setForm({ ...form, totalPoints: parseInt(e.target.value) || 100 })} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea 
                  className="input" 
                  rows={3}
                  placeholder="Assignment description…"
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  style={{ width: '100%', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Rubric Criteria</h4>
                {form.rubricCriteria.map((rc, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input 
                      className="input" 
                      placeholder="e.g., Clarity"
                      value={rc.name}
                      onChange={e => handleRubricChange(idx, 'name', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <input 
                      className="input" 
                      type="number"
                      placeholder="Points"
                      value={rc.points}
                      onChange={e => handleRubricChange(idx, 'points', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                ))}
                <button 
                  className="btn"
                  onClick={addRubricItem}
                  style={{ fontSize: '0.8rem', padding: '4px 8px', marginTop: '8px' }}
                >
                  + Add Criterion
                </button>
              </div>

              <button className="btn btn-primary" onClick={create} style={{ width: '100%' }}>Create Assignment</button>
            </div>
          )}

          {loading && <div className="muted small">Loading…</div>}
          {error && !loading && <div className="muted small" style={{ color: 'var(--danger)' }}>{error}</div>}
          {!loading && !error && (
            <ul className="list">
              {items.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, padding: 10, border: '1px solid #eee', borderRadius: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div className="muted small">{item.course_id} · {item.total_points} pts · Due: {item.due_date}</div>
                    {item.description && <div style={{ fontSize: '0.85rem', marginTop: '4px', color: '#666' }}>{item.description}</div>}
                    {item.rubric_criteria && item.rubric_criteria.length > 0 && (
                      <div style={{ fontSize: '0.8rem', marginTop: '6px', color: '#888' }}>
                        📋 Rubric: {item.rubric_criteria.map(r => r.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <button 
                    className="btn btn-sm" 
                    style={{ color: 'red', padding: '4px 8px', fontSize: '0.8rem' }} 
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
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
