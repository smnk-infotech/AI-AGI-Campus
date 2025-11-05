import React, { useEffect, useRef, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8081'

function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        className={isUser ? 'bubble user' : 'bubble assistant'}
        style={{
          maxWidth: '70%',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          margin: '0.25rem 0',
          background: isUser ? 'var(--primary-600)' : 'var(--surface-2)',
          color: isUser ? 'white' : 'inherit',
          whiteSpace: 'pre-wrap'
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your study assistant. Ask me anything about your courses or assignments." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setError('')

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/ai/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      const reply = data.reply || '(No response)'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e?.message || 'AI request failed')
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([{ role: 'assistant', content: 'Chat cleared. What should we study next?' }])
    setError('')
  }

  async function regenerate() {
    if (loading) return
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/ai/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages.slice(0, -1), lastUser] })
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '(No response)' }])
    } catch (e) {
      setError(e?.message || 'AI request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <section className="page-section" style={{ flex: 1, display: 'flex' }}>
        <article className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>AI Study Assistant</h3>
              <p className="muted small">Chat with an AI about your assignments, concepts, and study plans.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={clearChat} disabled={loading}>Clear</button>
              <button className="btn" onClick={regenerate} disabled={loading}>Regenerate</button>
            </div>
          </header>

          <div className="chat-area" style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {messages.map((m, idx) => (
              <MessageBubble key={idx} role={m.role} content={m.content} />
            ))}
            {loading && <div className="muted small">Assistant is typing…</div>}
            <div ref={endRef} />
          </div>

          {error && <div className="muted small" style={{ color: 'var(--danger)', padding: '0 0.75rem 0.5rem' }}>{error}</div>}

          <div className="input-row" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Send a message (Shift+Enter for newline)"
              rows={2}
              style={{ flex: 1, resize: 'vertical' }}
            />
            <button className="btn btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>
        </article>
      </section>
    </div>
  )
}
