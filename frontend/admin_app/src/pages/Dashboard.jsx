import React, { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || [])
        setEvents(data.events || [])
        setAlerts(data.alerts || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page"><div className="p-4">Loading dashboard...</div></div>

  return (
    <div className="page">
      <div className="cards-grid">
        {stats.map(item => (
          <div key={item.label} className="card stat-card">
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="two-column">
        <section className="card">
          <div className="section-header">
            <h3>Upcoming Events</h3>
            <a href="#" className="muted small">View calendar</a>
          </div>
          <ul className="list">
            {events.length === 0 && <li className="p-2 muted">No upcoming events</li>}
            {events.map(item => (
              <li key={item.title}>
                <div className="list-title">{item.title}</div>
                <div className="muted small">{item.date} · {item.owner}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="section-header">
            <h3>Operational Alerts</h3>
            <a href="#" className="muted small">Resolve</a>
          </div>
          <ul className="list">
            {alerts.length === 0 && <li className="p-2 muted">No alerts</li>}
            {alerts.map((item, idx) => (
              <li key={idx}>
                <div className="list-title">{item}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card full-width" style={{ marginTop: '20px', border: '1px solid #7c3aed', background: 'rgba(124, 58, 237, 0.05)' }}>
        <AGIWidget />
      </section>
    </div>
  )
}

function AGIWidget() {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  const fetchAGI = async (customGoal = null) => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/ai/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: customGoal || "Analyze campus-wide operational patterns and suggest improvements.",
          module: "admin",
          context: {},
          user_id: "admin-global"
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

  useEffect(() => {
    fetchAGI()
  }, [])

  const handleSimulate = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    fetchAGI(query)
  }

  return (
    <div>
      <div className="section-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌐 AGI Campus Controller
        </h3>
      </div>

      <div className="p-4">
        {/* Simulation Input */}
        <form onSubmit={handleSimulate} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ask 'What If'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Thinking...' : 'Simulate'}
          </button>
        </form>

        {loading && <div className="muted text-center p-4">Running Multi-Agent Simulation...</div>}

        {!loading && insight && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <strong>Strategic Analysis:</strong> <span className="muted">{insight.analysis}</span>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.1)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', marginBottom: '15px' }}>
              <strong style={{ color: '#7c3aed' }}>Policy Recommendation:</strong>
              <p style={{ marginTop: '5px', fontWeight: 500 }}>{insight.decision}</p>
            </div>
            <div>
              <strong>Reasoning Log:</strong>
              <p className="small muted mt-2" style={{ fontFamily: 'monospace' }}>{insight.explanation}</p>
              {insight.confidence && (
                <div style={{ marginTop: '5px', fontSize: '0.8em', color: insight.confidence > 80 ? 'green' : 'orange' }}>
                  Confidence Score: {insight.confidence}%
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
