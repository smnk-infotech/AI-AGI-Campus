import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function AGIController() {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'I am the Campus AGI Controller. I am monitoring student performance, resource allocation, and policy compliance. How can I assist you in optimizing campus operations?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    async function send() {
        if (!input) return
        const newMsg = { role: 'user', text: input }
        setMessages(prev => [...prev, newMsg])
        setInput('')
        setLoading(true)

        try {
            // Updated to use the Agent-aware /messages endpoint
            const res = await fetch(`${API_BASE}/api/ai/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: "You are an AGI Campus Controller. Analyze data, simulate policies, and provide strategic advice." },
                        ...messages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
                        { role: 'user', content: input }
                    ]
                })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: 'model', text: data.reply, actions: data.actions }])
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: 'System Error: Neural Link Disconnected.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <header className="section-header">
                <h3>Campus AGI Controller</h3>
                <span className="badge success">ONLINE</span>
            </header>

            <div className="card" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 15 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        background: m.role === 'user' ? '#0070f3' : '#f5f5f5',
                        color: m.role === 'user' ? '#fff' : '#000',
                        padding: '10px 15px',
                        borderRadius: 12,
                        maxWidth: '80%'
                    }}>
                        {/* Agent Actions Display */}
                        {m.actions && m.actions.length > 0 && (
                            <div style={{ marginBottom: 10, fontSize: '0.85rem', color: '#666', background: 'rgba(0,0,0,0.05)', padding: '5px 10px', borderRadius: 5 }}>
                                {m.actions.map((act, idx) => (
                                    <div key={idx} style={{ marginBottom: 5 }}>
                                        <strong>⚙️ Running:</strong> <code>{act.tool}</code>
                                        <div style={{ fontSize: '0.8em', opacity: 0.8 }}>Result: {act.result?.slice(0, 80)}...</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && <div className="muted small">Running AGI simulations...</div>}
            </div>

            <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                <input className="input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Query the Campus Core..." style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={send} disabled={loading}>Execute</button>
            </div>
        </div>
    )
}
