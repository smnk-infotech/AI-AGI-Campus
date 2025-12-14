import React, { useEffect, useState } from 'react'

export default function Dashboard({ faculty }) {
  const [stats, setStats] = useState([])
  const [highlights, setHighlights] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!faculty) return
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/faculty/${faculty.id}/dashboard`)
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setHighlights(data.research_highlights)
          // Map string notifications to objects if needed, or update render
          setNotifications(data.notifications.map((msg, i) => ({ id: i, message: msg })))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [faculty])

  if (loading) return <div className="page"><div className="p-4">Loading dashboard...</div></div>

  return (
    <div className="page">
      <section className="page-section stats">
        {stats.map((stat) => (
          <article key={stat.id} className="card">
            <h4>{stat.label}</h4>
            <p className="stat-value">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Research Highlights</h3>
          </header>
          <ul className="list">
            {highlights.length === 0 && <li className="p-2 muted">No research highlights</li>}
            {highlights.map((item) => (
              <li key={item.id}>
                <div className="list-title">{item.title}</div>
                <div className="list-sub">{item.org}</div>
                <div className="badge neutral">{item.amount}</div>
                <div className="badge muted">{item.status}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Notifications</h3>
          </header>
          <ul className="list">
            {notifications.length === 0 && <li className="p-2 muted">No notifications</li>}
            {notifications.map((note) => (
              <li key={note.id}>{note.message}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section full-width" style={{ marginTop: '20px' }}>
        <AGIWidget faculty={faculty} />
      </section>
    </div>
  )
}

function AGIWidget({ faculty }) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!faculty) return
    const fetchAGI = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8000/api/ai/agi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: "Analyze my teaching load and identify at-risk students.",
            module: "faculty",
            context: {},
            user_id: faculty.id
          })
        })
        const data = await res.json()
        setInsight(data)
      } catch (err) {
        console.error("AGI Error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAGI()
  }, [faculty])

  if (loading) return <div className="card"><div className="p-4 muted">AGI is thinking...</div></div>
  if (!insight) return null

  return (
    <div className="card agi-card" style={{ border: '1px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.05)' }}>
      <header className="section-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🧠 Faculty Brain
        </h3>
      </header>
      <div className="p-4">
        <div style={{ marginBottom: '10px' }}>
          <strong>Analysis:</strong> <span className="muted">{insight.analysis}</span>
        </div>
        <div className="highlight-box" style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
          <strong>Recommendation:</strong> {insight.decision}
        </div>
        <details style={{ marginTop: '10px', cursor: 'pointer' }}>
          <summary className="small muted">Why this suggestion?</summary>
          <p className="small mt-2">{insight.explanation}</p>
        </details>
      </div>
    </div>
  )
}
