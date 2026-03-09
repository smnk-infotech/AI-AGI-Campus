import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'

// simple id
const uid = () => Math.random().toString(36).slice(2)

// localStorage helpers
const STORAGE_KEY = 'ai_conversations_v1'
function loadConvos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveConvos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function Icon({ name }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>
    case 'send': return <svg {...props}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
    case 'copy': return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
    case 'thumbs-up': return <svg {...props}><path d="M14 9V5a3 3 0 0 0-6 0v4" /><path d="M5 15h10l4-8H9a4 4 0 0 0-4 4v4z" /></svg>
    case 'thumbs-down': return <svg {...props}><path d="M10 15v4a3 3 0 0 0 6 0v-4" /><path d="M19 9H9l-4 8h10a4 4 0 0 0 4-4V9z" /></svg>
    case 'refresh': return <svg {...props}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v7h-7" /></svg>
    case 'moon': return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
    case 'download': return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
    default: return null
  }
}

function Message({ m, onCopy, onRegenerate, onExecuteAction, actionBusyKey }) {
  const isUser = m.role === 'user'
  return (
    <>
      <style>{`
        .msg-bubble {
          display: flex;
          justify-content: ${isUser ? 'flex-end' : 'flex-start'};
          margin-bottom: 12px;
          animation: fadeInMsg 0.3s ease-out;
        }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-content-wrapper {
          max-width: 85%;
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }
        .msg-text {
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          word-wrap: break-word;
          font-size: 0.95rem;
          background: ${isUser ? '#10a37f' : '#444654'};
          color: ${isUser ? '#fff' : '#ececf1'};
        }
        .msg-actions {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .msg-action-btn {
          display: inline-block;
          margin-top: 6px;
          padding: 6px 12px;
          font-size: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          color: ${isUser ? '#fff' : '#10a37f'};
          cursor: pointer;
          transition: all 0.2s;
        }
        .msg-action-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
        }
        .msg-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .msg-btn-group {
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .msg-bubble:hover .msg-btn-group {
          opacity: 0.7;
        }
        .msg-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #bbb;
          transition: color 0.2s;
        }
        .msg-btn:hover {
          color: #10a37f;
        }
        .markdown-content a { color: #10a37f; }
        .markdown-content code { 
          background: rgba(0,0,0,0.3); 
          padding: 2px 6px; 
          border-radius: 4px; 
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9em;
        }
        .markdown-content pre { 
          background: #222425; 
          padding: 12px; 
          border-radius: 8px; 
          overflow: auto; 
          font-size: 0.85rem; 
          margin: 8px 0;
          border-left: 3px solid #10a37f;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin: 12px 0 8px;
          font-weight: 700;
        }
        .markdown-content p { margin: 8px 0; }
        .markdown-content ul, .markdown-content ol { margin: 8px 0; padding-left: 20px; }
        .markdown-content li { margin: 4px 0; }
      `}</style>
      <div className="msg-bubble">
        <div className="msg-content-wrapper">
          <div className="msg-text">
            {m.actions && m.actions.length > 0 && (
              <div className="msg-actions">
                {m.actions.map((act, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                    <div>⚡ <strong>{act.tool}</strong> <span style={{ opacity: 0.7 }}>({act.access_mode})</span></div>
                    <button
                      className="msg-action-btn"
                      disabled={actionBusyKey === `${act.tool}-${i}`}
                      onClick={() => onExecuteAction?.(act, i)}
                    >
                      {actionBusyKey === `${act.tool}-${i}` ? 'Executing…' : 'Execute'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
          {!isUser && (
            <div className="msg-btn-group">
              <button className="msg-btn" title="Copy" onClick={() => onCopy(m.content)}><Icon name="copy" /></button>
              <button className="msg-btn" title="Regenerate" onClick={() => onRegenerate()}><Icon name="refresh" /></button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function AIAssistant() {
  const [convos, setConvos] = useState(() => {
    const initial = loadConvos()
    if (initial.length) return initial
    const first = { id: uid(), title: 'New chat', createdAt: Date.now(), updatedAt: Date.now(), messages: [] }
    saveConvos([first])
    return [first]
  })
  const [activeId, setActiveId] = useState(convos[0]?.id)
  const active = useMemo(() => convos.find(c => c.id === activeId) || convos[0], [convos, activeId])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [controller, setController] = useState(null)
  const [kit, setKit] = useState(null)
  const [kitLoading, setKitLoading] = useState(false)
  const [kitError, setKitError] = useState('')
  const [kitTab, setKitTab] = useState('summary')
  const [studentProfile, setStudentProfile] = useState(null)
  const [actionBusyKey, setActionBusyKey] = useState('')
  const endRef = useRef(null)

  // ── Fetch student profile on mount for personalized greeting ──
  useEffect(() => {
    const token = localStorage.getItem('student_token')
    if (!token) return
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setStudentProfile(data)
          // Send a welcome message if this is a fresh first conversation
          setConvos(prev => {
            const first = prev[0]
            if (first && first.messages.length === 0) {
              const name = data.first_name || data.name || 'there'
              const greeting = {
                role: 'assistant',
                content: `Hi ${name}! 👋 I'm your personal AI Study Assistant. I know your courses, grades, and schedule — ask me anything about your academics, study tips, or assignments!`
              }
              return prev.map(c => c.id === first.id ? { ...c, messages: [greeting] } : c)
            }
            return prev
          })
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active?.messages, loading])
  useEffect(() => { saveConvos(convos) }, [convos])

  function updateActive(updater) {
    setConvos(list => list.map(c => c.id === active.id ? { ...updater(c), updatedAt: Date.now() } : c))
  }

  function newChat() {
    const c = { id: uid(), title: 'New chat', createdAt: Date.now(), updatedAt: Date.now(), messages: [{ role: 'assistant', content: 'What would you like to learn today?' }] }
    setConvos(prev => [c, ...prev])
    setActiveId(c.id)
  }

  function clearChat() {
    updateActive(() => ({ ...active, messages: [{ role: 'assistant', content: 'Chat cleared. Ask me anything!' }] }))
    setError('')
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setError('')
    const userMsg = { role: 'user', content: text }
    setInput('')
    updateActive(c => ({ ...c, title: c.title === 'New chat' ? text.slice(0, 48) : c.title, messages: [...c.messages, userMsg] }))

    const ctrl = new AbortController()
    setController(ctrl)
    const token = localStorage.getItem('student_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/ai/messages`, {
        method: 'POST', headers,
        body: JSON.stringify({ messages: [...active.messages, userMsg] }), signal: ctrl.signal
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      const reply = data.reply || '(No response)'
      const actions = data.actions || []

      updateActive(c => ({ ...c, messages: [...c.messages, { role: 'assistant', content: reply, actions: actions }] }))
    } catch (e) {
      if (e.name !== 'AbortError') setError(e?.message || 'AI request failed')
    } finally {
      setLoading(false)
      setController(null)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function stop() { controller?.abort() }

  async function regenerate() {
    if (loading) return
    const lastUser = [...active.messages].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    const ctrl = new AbortController()
    setController(ctrl)
    const token = localStorage.getItem('student_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/ai/messages`, {
        method: 'POST', headers,
        body: JSON.stringify({ messages: [...active.messages.filter(m => m.role !== 'assistant').slice(0, -1), lastUser] }), signal: ctrl.signal
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      updateActive(c => ({ ...c, messages: [...c.messages, { role: 'assistant', content: data.reply || '(No response)' }] }))
    } catch (e) {
      if (e.name !== 'AbortError') setError(e?.message || 'AI request failed')
    } finally { setLoading(false); setController(null) }
  }

  function copyText(text) { navigator.clipboard?.writeText(text) }

  async function executeAction(action, index) {
    const token = localStorage.getItem('student_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    const busyKey = `${action.tool}-${index}`
    setActionBusyKey(busyKey)
    try {
      const res = await fetch(`${API_BASE}/api/ai/actions/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool: action.tool, args: action.args || {} }),
      })
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
      const data = await res.json()
      const resultMsg = {
        role: 'assistant',
        content: `Action executed: **${data.tool}**\n\nResult:\n\n\`\`\`\n${typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2)}\n\`\`\``,
      }
      updateActive(c => ({ ...c, messages: [...c.messages, resultMsg] }))
    } catch (e) {
      setError(e?.message || 'Failed to execute action')
    } finally {
      setActionBusyKey('')
    }
  }

  function exportChat() {
    const blob = new Blob([JSON.stringify(active, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${active.title || 'chat'}.json`; a.click()
  }

  function toggleTheme() {
    const el = document.querySelector('.chatgpt');
    if (!el) return; el.dataset.theme = el.dataset.theme === 'light' ? 'dark' : 'light'
  }

  async function buildLearningKit() {
    const topic = [...active.messages].reverse().find(m => m.role === 'user')?.content || input.trim()
    if (!topic) { setKitError('Type a topic or send a message first.'); return }
    setKitError(''); setKit(null); setKitLoading(true); setKitTab('summary')
    try {
      const res = await fetch(`${API_BASE}/api/ai/teach`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) })
      if (!res.ok) throw new Error(`Teach failed: ${res.status}`)
      const data = await res.json()
      setKit(data)
    } catch (e) { setKitError(e?.message || 'Failed to build learning kit') }
    finally { setKitLoading(false) }
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <article className="card" style={{ padding: 0 }}>
        <div className="chatgpt" data-theme="dark">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="top">
              <button className="btn primary" onClick={newChat}><Icon name="plus" /> New chat</button>
              <button className="btn ghost" onClick={toggleTheme} title="Theme"><Icon name="moon" /></button>
            </div>
            <div className="convos">
              {convos.map(c => (
                <button key={c.id} className={`convo ${c.id === active.id ? 'active' : ''}`} onClick={() => setActiveId(c.id)}>
                  <div className="title">{c.title || 'Untitled'}</div>
                </button>
              ))}
            </div>
            <div className="bottom">
              <button className="btn" onClick={exportChat}><Icon name="download" /> Export</button>
              <button className="btn" onClick={clearChat}><Icon name="refresh" /> Clear</button>
            </div>
          </aside>

          {/* Main */}
          <section className="main">
            <header className="header">
              <div className="title">
                <div style={{ fontWeight: 700 }}>AI Assistant</div>
                <span className="model">model: Gemini</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="btn" onClick={buildLearningKit} disabled={kitLoading}>{kitLoading ? 'Building…' : 'Learning Kit'}</button>
                <div className="muted" style={{ fontSize: 12 }}>{loading ? 'Generating…' : 'Ready'}</div>
              </div>
            </header>

            <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {active?.messages?.map((m, i) => (
                <Message key={i} m={m} onCopy={copyText} onRegenerate={regenerate} onExecuteAction={executeAction} actionBusyKey={actionBusyKey} />
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#444654',
                    color: '#ececf1',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ animation: 'pulse 1.5s infinite' }}>✨ Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {error && <div className="muted" style={{ padding: '0 16px 8px', color: '#fca5a5' }}>{error}</div>}

            {/* Learning Kit Panel */}
            {(kitLoading || kit || kitError) && (
              <div style={{ padding: '0 16px 16px' }}>
                <div className="kit">
                  <div className="kit-tabs">
                    <button className={`kit-tab ${kitTab === 'summary' ? 'active' : ''}`} onClick={() => setKitTab('summary')}>Summary</button>
                    <button className={`kit-tab ${kitTab === 'visuals' ? 'active' : ''}`} onClick={() => setKitTab('visuals')}>Visuals</button>
                    <button className={`kit-tab ${kitTab === 'flashcards' ? 'active' : ''}`} onClick={() => setKitTab('flashcards')}>Flashcards</button>
                    <button className={`kit-tab ${kitTab === 'quiz' ? 'active' : ''}`} onClick={() => setKitTab('quiz')}>Quiz</button>
                    <button className={`kit-tab ${kitTab === 'resources' ? 'active' : ''}`} onClick={() => setKitTab('resources')}>Resources</button>
                  </div>
                  {kitError && <div className="muted" style={{ color: '#fca5a5' }}>{kitError}</div>}
                  {kitLoading && <div className="muted">Preparing learning kit…</div>}
                  {!kitLoading && kit && (
                    <div className="kit-body">
                      {kitTab === 'summary' && (
                        <div className="kit-section">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{kit.summary_md || ''}</ReactMarkdown>
                          {kit.steps_md && (
                            <div style={{ marginTop: 12 }}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{kit.steps_md}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      )}
                      {kitTab === 'visuals' && (
                        <div className="kit-grid">
                          {(kit.visuals || []).map((v, i) => (
                            <a key={i} className="kit-img" href={v.url} target="_blank" rel="noreferrer">
                              <img src={v.url} alt={v.title} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(v.title || 'learning')}/800/600` }} />
                              <div className="caption">{v.title}</div>
                            </a>
                          ))}
                          {(!kit.visuals || kit.visuals.length === 0) && <div className="muted">No images available.</div>}
                        </div>
                      )}
                      {kitTab === 'flashcards' && (
                        <div className="kit-grid">
                          {(kit.flashcards || []).map((fc, i) => (
                            <details key={i} className="card fc">
                              <summary>{fc.front}</summary>
                              <div className="muted" style={{ marginTop: 8 }}>{fc.back}</div>
                            </details>
                          ))}
                          {(!kit.flashcards || kit.flashcards.length === 0) && <div className="muted">No flashcards created.</div>}
                        </div>
                      )}
                      {kitTab === 'quiz' && (
                        <div className="kit-section">
                          {(kit.quiz || []).map((q, i) => (
                            <div key={i} className="quiz-item">
                              <div className="q">{i + 1}. {q.question}</div>
                              <div className="opts">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className="opt">
                                    <input type="radio" name={`q${i}`} />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                              <div className="muted tiny" style={{ marginTop: 6 }}>Answer: {String.fromCharCode(65 + (q.correctIndex || 0))}</div>
                            </div>
                          ))}
                          {(!kit.quiz || kit.quiz.length === 0) && <div className="muted">No quiz generated.</div>}
                        </div>
                      )}
                      {kitTab === 'resources' && (
                        <ul className="kit-list">
                          {(kit.resources || []).map((r, i) => (
                            <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                          ))}
                          {(!kit.resources || kit.resources.length === 0) && <div className="muted">No resources added.</div>}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid #444654', padding: '16px 20px 20px', background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)' }}>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}</style>
              <div style={{ display: 'flex', gap: '12px' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={Math.min(4, Math.max(1, input.split('\n').length))}
                  placeholder="Ask me anything… (Shift+Enter for new line)"
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
                    maxHeight: '200px'
                  }}
                />
                <button
                  disabled={!input.trim() || loading}
                  onClick={loading ? stop : sendMessage}
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
                  {loading ? 'Stop' : 'Send'}
                </button>
              </div>
              <div style={{ padding: '8px 6px 0', fontSize: '0.75rem', color: '#999', opacity: 0.7 }}>
                Shift+Enter for newline • Your learning data is personalized
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
