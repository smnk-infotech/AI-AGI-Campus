import React, { useState, useEffect, useRef } from 'react'

const projects = [
  {
    id: 1,
    name: 'Adaptive Robotics Curriculum',
    phase: 'Prototype Testing',
    collaborators: 'Engineering Dept.',
    milestone: 'Student pilot starts Nov 14'
  },
  {
    id: 2,
    name: 'Ethical AI Lab',
    phase: 'Grant Preparation',
    collaborators: 'AI Research Collective',
    milestone: 'Budget review Nov 9'
  }
]

const publications = [
  {
    id: 1,
    title: 'Evaluating Hybrid Learning Outcomes',
    venue: 'Journal of STEM Education',
    status: 'Accepted · In Press'
  },
  {
    id: 2,
    title: 'Robotics for Inclusive Learning',
    venue: 'ISTE 2026 Proposal',
    status: 'Drafting Abstract · Due Nov 18'
  }
]

const developmentGoals = [
  { id: 1, goal: 'Complete Inclusive Pedagogy micro-credential', progress: '60%' },
  { id: 2, goal: 'Host winter robotics bootcamp planning session', progress: 'Scheduled 11/20' }
]

export default function Research() {
  // AI State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello Dr. Thompson. I am your Research Copilot. I can help with grant writing, literature reviews, or data analysis. How can I assist you?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const newMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8001/api/ai/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an advanced academic research assistant. Help with grants, papers, and data analysis. Be formal, precise, and cite simulated sources if asked.' },
            ...messages,
            newMsg
          ]
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, actions: data.actions }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please ensure the AI Neuro-Link is active." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: 'calc(100vh - 100px)' }}>

        {/* Left Column: Dashboard */}
        <div style={{ overflowY: 'auto', paddingRight: '5px' }}>
          <section className="page-section">
            <article className="card">
              <header className="section-header">
                <h3>Active Projects</h3>
              </header>
              <ul className="list">
                {projects.map((project) => (
                  <li key={project.id}>
                    <div className="list-title">{project.name}</div>
                    <div className="list-sub">{project.collaborators}</div>
                    <div className="badge neutral">{project.phase}</div>
                    <div className="muted small" style={{ marginTop: 5 }}>Next: {project.milestone}</div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card" style={{ marginTop: 20 }}>
              <header className="section-header">
                <h3>Publications & Proposals</h3>
              </header>
              <ul className="list">
                {publications.map((item) => (
                  <li key={item.id}>
                    <div className="list-title">{item.title}</div>
                    <div className="list-sub">{item.venue}</div>
                    <div className="badge muted">{item.status}</div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card" style={{ marginTop: 20 }}>
              <header className="section-header">
                <h3>Professional Development</h3>
              </header>
              <ul className="list">
                {developmentGoals.map((goal) => (
                  <li key={goal.id}>
                    <div className="list-title">{goal.goal}</div>
                    <div className="badge neutral">{goal.progress}</div>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
          <header className="p-3 border-b" style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Research Copilot</h3>
            <span className="badge success" style={{ fontSize: '0.7rem' }}>AGI CONNECTED</span>
          </header>

          <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-card-hover)',
                color: m.role === 'user' ? '#fff' : 'var(--text-main)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
              }}>
                {/* Agent Actions Display */}
                {m.actions && m.actions.length > 0 && (
                  <div style={{ marginBottom: 8, fontSize: '0.8rem', color: m.role === 'user' ? '#eee' : '#666', opacity: 0.9, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 5 }}>
                    {m.actions.map((act, idx) => (
                      <div key={idx}>⚡ Used Tool: {act.tool}</div>
                    ))}
                  </div>
                )}
                {m.content}
              </div>
            ))}
            {loading && <div className="muted small" style={{ marginLeft: 10 }}>Analyzing Research Databases...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="composer p-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about grants, citations, or data..."
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
