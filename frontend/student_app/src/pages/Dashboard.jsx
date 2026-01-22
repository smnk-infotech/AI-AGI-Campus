import React, { useEffect, useState } from 'react'

export default function Dashboard({ student }) {
  const [stats, setStats] = useState([])
  const [schedule, setSchedule] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!student) return
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/students/${student.id}/dashboard`)
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setSchedule(data.schedule)
          setAlerts(data.alerts)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [student])

  if (loading) {
    return <div className="page"><div className="p-4">Loading dashboard...</div></div>
  }

  return (
    <div className="page">
      <section className="page-section stats">
        {stats.map((stat) => (
          <article key={stat.id} className="card stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="list-title">{stat.label}</div>
            <div className="muted small">{stat.detail}</div>
          </article>
        ))}
      </section>

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Today’s Schedule</h3>
          </header>
          <ul className="list">
            {schedule.length === 0 && <li className="p-2 muted">No classes today</li>}
            {schedule.map((block) => (
              <li key={block.id}>
                <div className="list-title">{block.subject}</div>
                <div className="list-sub">{block.time}</div>
                <div className="muted tiny">{block.location}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Important Alerts</h3>
          </header>
          <ul className="list">
            {alerts.length === 0 && <li className="p-2 muted">No active alerts</li>}
            {alerts.map((alert) => (
              <li key={alert.id}>
                <div className="list-title">{alert.title}</div>
                <span className="badge neutral">{alert.type}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section full-width" style={{ marginTop: '20px' }}>
        <AGIWidget student={student} />
      </section>
    </div>
  )
}

function AGIWidget({ student }) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!student) return
    const fetchAGI = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8000/api/ai/agi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: "Analyze my recent performance and suggest a study plan.",
            module: "student",
            context: {}, // Backend will enrich this
            user_id: student.id
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
  }, [student])

  if (loading) return <div className="card"><div className="p-4 muted">AGI is thinking...</div></div>
  if (!insight) return null

  return (
    <div className="card agi-card" style={{ border: '1px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.05)' }}>
      <header className="section-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✨ Smart Campus Brain
        </h3>
      </header>
      <div className="p-4">
        {/* Render Actions (Thinking Steps) */}
        {insight.actions && insight.actions.length > 0 && (
          <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: '#666' }}>
            {insight.actions.map((action, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                <span>⚙️</span>
                <span>Used <strong>{action.tool}</strong></span>
              </div>
            ))}
          </div>
        )}

        <div className="highlight-box" style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
          <strong>Recommendation:</strong> {insight.reply}
        </div>
      </div>
    </div>
  )
}
