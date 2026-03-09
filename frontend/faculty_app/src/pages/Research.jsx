import React, { useState, useEffect, useRef } from 'react'
import api from '../services/api'

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
  const [actionBusyKey, setActionBusyKey] = useState('')
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
      const data = await api.sendAIMessage(input, 'faculty')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, actions: data.actions }])
    } catch (e) {
      console.error('Failed to send message:', e)
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please ensure the AI Neuro-Link is active." }])
    } finally {
      setLoading(false)
    }
  }

  async function executeAction(action, index) {
    const key = `${action.tool}-${index}`
    setActionBusyKey(key)
    try {
      const data = await api.executeAIAction(action.tool, action.args || {})
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Action executed: ${data.tool}\nResult: ${typeof data.result === 'string' ? data.result : JSON.stringify(data.result)}`,
      }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Action failed: ${e.message}` }])
    } finally {
      setActionBusyKey('')
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

          <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#1d1e1e' }}>
            <style>{`
              .faculty-msg-bubble {
                display: flex;
                justify-content: flex-start;
                animation: fadeInMsg 0.3s ease-out;
              }
              .faculty-msg-bubble.user {
                justify-content: flex-end;
              }
              @keyframes fadeInMsg {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .faculty-msg-text {
                padding: 12px 16px;
                border-radius: 12px;
                max-width: 85%;
                line-height: 1.5;
                font-size: 0.95rem;
              }
              .faculty-msg-text.user {
                background: #10a37f;
                color: #fff;
              }
              .faculty-msg-text.assistant {
                background: #444654;
                color: #ececf1;
              }
              .faculty-msg-actions {
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                font-size: 0.85rem;
              }
              .faculty-msg-action-btn {
                display: inline-block;
                margin-top: 6px;
                padding: 4px 10px;
                font-size: 0.75rem;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 6px;
                color: #10a37f;
                cursor: pointer;
                transition: all 0.2s;
              }
              .faculty-msg-action-btn:hover:not(:disabled) {
                background: rgba(255,255,255,0.15);
              }
              .faculty-msg-action-btn:disabled {
                opacity: 0.5;
              }
            `}</style>
            {messages.map((m, i) => (
              <div key={i} className={`faculty-msg-bubble ${m.role}`}>
                <div className={`faculty-msg-text ${m.role}`}>
                  {m.actions && m.actions.length > 0 && (
                    <div className="faculty-msg-actions">
                      {m.actions.map((act, idx) => (
                        <div key={idx} style={{ marginBottom: '6px' }}>
                          <div>⚡ <strong>{act.tool}</strong> ({act.access_mode})</div>
                          <button
                            className="faculty-msg-action-btn"
                            disabled={actionBusyKey === `${act.tool}-${idx}`}
                            onClick={() => executeAction(act, idx)}
                          >
                            {actionBusyKey === `${act.tool}-${idx}` ? 'Executing…' : 'Execute'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>{m.content}</div>
                </div>
              </div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', padding: '10px 16px', color: '#999', fontSize: '0.9rem' }}>✨ Analyzing…</div>}
            <div ref={chatEndRef} />
          </div>

          <div style={{ borderTop: '1px solid #444654', padding: '16px 20px 20px', background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                rows={Math.min(3, Math.max(1, input.split('\n').length))}
                placeholder="Ask about grants, citations, or data… (Shift+Enter for new line)"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #444654',
                  background: '#222425',
                  color: '#ececf1',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  maxHeight: '150px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: input.trim() && !loading ? '#10a37f' : '#555555',
                  color: '#fff',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Analyzing…' : 'Send'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
