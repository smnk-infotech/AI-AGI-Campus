import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const API = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'
const tkn = () => localStorage.getItem('admin_token')

/* ─── tiny helpers ─── */
const hdr = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tkn()}` })
const get = (url) => fetch(`${API}${url}`, { headers: hdr() }).then(r => r.json())
const post = (url, body) => fetch(`${API}${url}`, { method: 'POST', headers: hdr(), body: JSON.stringify(body) }).then(r => r.json())

/* ─── SVG icons ─── */
function Ic({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const m = {
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    log: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v7h-7" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
  }
  return <svg {...p}>{m[name]}</svg>
}

/* ─── Status badge ─── */
function Badge({ status }) {
  const map = { good: ['#10b981', 'Good'], warning: ['#f59e0b', 'Warning'], 'at-risk': ['#ef4444', 'At Risk'] }
  const [bg, label] = map[status] || ['#94a3b8', status]
  return <span style={{ background: bg, color: '#fff', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{label}</span>
}

/* ─── Stat Card ─── */
function Stat({ icon, label, value, sub, color = '#0d9488' }) {
  return (
    <div className="agi-stat">
      <div className="agi-stat-ic" style={{ background: `${color}18`, color }}><Ic name={icon} size={22} /></div>
      <div>
        <div className="agi-stat-val">{value}</div>
        <div className="agi-stat-lbl">{label}</div>
        {sub && <div className="agi-stat-sub">{sub}</div>}
      </div>
    </div>
  )
}

function pct(p, t) { return t > 0 ? Math.round((p / t) * 100) : 0 }

/* ═══════════════════════════════════════════════════════════════
   AGI CONTROLLER
   ═══════════════════════════════════════════════════════════════ */
export default function AGIController() {
  const [tab, setTab] = useState('command')
  const [S, setS] = useState(null)
  const [logs, setLogs] = useState([])
  const [notifs, setNotifs] = useState([])
  const [studOv, setStudOv] = useState([])
  const [facOv, setFacOv] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: "**AGI Campus Controller Online.**\nI have full visibility into students, faculty, attendance, courses, grades, and campus operations.\n\nTry commands like:\n- *Show campus attendance overview*\n- *List at-risk students*\n- *Simulate extending semester by 2 weeks*\n- *Broadcast alert: Library closed tomorrow*\n- *Analyze faculty workload distribution*" }
  ])
  const [input, setInput] = useState('')
  const [bcMsg, setBcMsg] = useState('')
  const [bcTarget, setBcTarget] = useState('all')
  const [actionBusyKey, setActionBusyKey] = useState('')
  const endRef = useRef(null)

  /* ── data fetch ── */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [s, l, n, st, f] = await Promise.all([
        get('/api/admin/agi/status'),
        get('/api/admin/agi/logs?limit=30'),
        get('/api/admin/agi/notifications'),
        get('/api/admin/agi/students-overview'),
        get('/api/admin/agi/faculty-overview'),
      ])
      setS(s); setLogs(l); setNotifs(n); setStudOv(st); setFacOv(f)
    } catch (e) { console.error('AGI fetch:', e) }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  /* ── send command ── */
  async function sendCmd() {
    const text = input.trim(); if (!text || busy) return
    setInput(''); setMsgs(p => [...p, { role: 'user', text }]); setBusy(true)
    try {
      const d = await post('/api/admin/agi/command', { command: text, context: { source: 'admin_console' } })
      setMsgs(p => [...p, { role: 'ai', text: d.reply || 'No response.', actions: d.actions }])
      if (d.actions?.length) setTimeout(refresh, 500)
    } catch (e) { setMsgs(p => [...p, { role: 'ai', text: `**Error:** ${e.message}` }]) }
    setBusy(false)
  }

  /* ── broadcast ── */
  async function sendBc() {
    if (!bcMsg.trim()) return
    try {
      await post('/api/admin/agi/broadcast', { message: bcMsg, target_role: bcTarget })
      setMsgs(p => [...p, { role: 'ai', text: `**Alert Broadcasted** to **${bcTarget}**: ${bcMsg}` }])
      setBcMsg(''); setTimeout(refresh, 500)
    } catch (e) { console.error(e) }
  }

  async function executeAction(action, index) {
    const key = `${action.tool}-${index}`
    setActionBusyKey(key)
    try {
      const d = await post('/api/ai/actions/execute', { tool: action.tool, args: action.args || {} })
      setMsgs(p => [...p, { role: 'ai', text: `**Action Executed:** ${d.tool}\n\n${typeof d.result === 'string' ? d.result : JSON.stringify(d.result, null, 2)}` }])
      setTimeout(refresh, 500)
    } catch (e) {
      setMsgs(p => [...p, { role: 'ai', text: `**Action Error:** ${e.message}` }])
    }
    setActionBusyKey('')
  }

  /* ── quick commands ── */
  const quicks = [
    { l: 'Campus Overview', c: 'Give me a full campus status overview including student count, faculty, attendance rate, and revenue' },
    { l: 'At-Risk Students', c: 'List all at-risk students with attendance below 60% and suggest interventions' },
    { l: 'Attendance Analysis', c: 'Analyze campus-wide attendance patterns and provide improvement recommendations' },
    { l: 'Faculty Workload', c: 'Analyze faculty workload distribution and identify overloaded instructors' },
    { l: 'Simulate Policy', c: 'Simulate extending the current semester by 2 weeks. What is the impact?' },
    { l: 'Grade Distribution', c: 'Analyze grade distribution across courses and identify courses that need attention' },
  ]

  const tabList = [
    { id: 'command', l: 'Command Center', ic: 'cpu' },
    { id: 'overview', l: 'Org Overview', ic: 'globe' },
    { id: 'students', l: 'Student Intel', ic: 'users' },
    { id: 'faculty', l: 'Faculty Intel', ic: 'shield' },
    { id: 'logs', l: 'AGI Logs', ic: 'log' },
    { id: 'alerts', l: 'Broadcasts', ic: 'bell' },
  ]

  return (
    <div className="agi-ctrl">
      {/* ── Header ── */}
      <div className="agi-hdr">
        <div className="agi-hdr-l">
          <div className="agi-hdr-ic"><Ic name="cpu" size={28} /></div>
          <div><h2 className="agi-hdr-t">AGI Organization Controller</h2><p className="agi-hdr-sub">Full-spectrum campus intelligence &amp; autonomous operations</p></div>
        </div>
        <div className="agi-hdr-r">
          <span className="agi-dot" /><span className="agi-online">SYSTEM ONLINE</span>
          <button className="agi-ref" onClick={refresh} title="Refresh"><Ic name="refresh" size={16} /></button>
        </div>
      </div>

      {/* ── Stats ── */}
      {S && (
        <div className="agi-stats">
          <Stat icon="users" label="Students" value={S.campus.students} />
          <Stat icon="shield" label="Faculty" value={S.campus.faculty} color="#6366f1" />
          <Stat icon="activity" label="Attendance" value={`${S.attendance.rate}%`} sub={`${S.attendance.present}/${S.attendance.total}`} color={S.attendance.rate >= 80 ? '#10b981' : '#f59e0b'} />
          <Stat icon="alert" label="At-Risk" value={S.at_risk_students.length} color={S.at_risk_students.length ? '#ef4444' : '#10b981'} />
          <Stat icon="zap" label="AGI Actions" value={S.agi.logs} sub={`${S.agi.memories} memories`} color="#8b5cf6" />
          <Stat icon="globe" label="Revenue" value={`$${S.campus.revenue.toLocaleString()}`} sub={`${S.campus.enrollments} enrollments`} color="#0ea5e9" />
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="agi-tabs">
        {tabList.map(t => (
          <button key={t.id} className={`agi-tab${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
            <Ic name={t.ic} size={14} /> {t.l}
          </button>
        ))}
      </div>

      {/* ══════ COMMAND CENTER ══════ */}
      {tab === 'command' && (
        <div className="agi-pnl">
          <div className="agi-qrow">{quicks.map((q, i) => (
            <button key={i} className="agi-qbtn" onClick={() => { setInput(q.c); setTab('command') }}><Ic name="zap" size={12} /> {q.l}</button>
          ))}</div>

          <div className="agi-chat" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#1d1e1e' }}>
            <style>{`
              .admin-msg-bubble {
                display: flex;
                justify-content: flex-start;
                animation: fadeInMsg 0.3s ease-out;
              }
              .admin-msg-bubble.user {
                justify-content: flex-end;
              }
              @keyframes fadeInMsg {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .admin-msg-text {
                padding: 12px 16px;
                border-radius: 12px;
                max-width: 85%;
                line-height: 1.5;
                font-size: 0.95rem;
              }
              .admin-msg-text.user {
                background: #10a37f;
                color: #fff;
              }
              .admin-msg-text.ai {
                background: #444654;
                color: #ececf1;
              }
            `}</style>
            {msgs.map((m, i) => (
              <div key={i} className={`admin-msg-bubble ${m.role}`}>
                <div className={`admin-msg-text ${m.role}`}>
                  {m.actions && m.actions.length > 0 && (
                    <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                      {m.actions.map((a, j) => (
                        <div key={j} style={{ marginBottom: '6px' }}>
                          <div>⚡ <strong>{a.tool}</strong> ({a.access_mode})</div>
                          <button
                            className="agi-qbtn"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: '4px' }}
                            disabled={actionBusyKey === `${a.tool}-${j}`}
                            onClick={() => executeAction(a, j)}
                          >
                            {actionBusyKey === `${a.tool}-${j}` ? 'Executing…' : 'Execute'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {busy && <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '10px 16px', background: '#444654', color: '#ececf1', borderRadius: '12px', fontSize: '0.95rem' }}>
                ✨ Reasoning…
              </div>
            </div>}
            <div ref={endRef} />
          </div>

          <div style={{ borderTop: '1px solid #444654', padding: '16px 20px 20px', background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendCmd())}
                rows={Math.min(3, Math.max(1, input.split('\n').length))}
                placeholder="Enter AGI command… (Shift+Enter for new line)"
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
                onClick={sendCmd}
                disabled={busy || !input.trim()}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: input.trim() && !busy ? '#10a37f' : '#555555',
                  color: '#fff',
                  cursor: input.trim() && !busy ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {busy ? 'Executing…' : 'Execute'}
              </button>
            </div>
          </div>

          <div className="agi-bc">
            <h4><Ic name="bell" size={14} /> Broadcast Alert</h4>
            <div className="agi-bc-row">
              <select value={bcTarget} onChange={e => setBcTarget(e.target.value)} className="agi-sel">
                <option value="all">All Users</option><option value="student">Students</option><option value="faculty">Faculty</option>
              </select>
              <input className="agi-inp" value={bcMsg} onChange={e => setBcMsg(e.target.value)} placeholder="Type alert message..." style={{ flex: 1 }} />
              <button className="agi-bcbtn" onClick={sendBc} disabled={!bcMsg.trim()}>Broadcast</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ ORG OVERVIEW ══════ */}
      {tab === 'overview' && S && (
        <div className="agi-pnl">
          <h3 style={{ marginBottom: 16 }}>Campus Intelligence Dashboard</h3>
          <div className="agi-g3">
            <div className="agi-card">
              <h4><Ic name="activity" size={16} /> Attendance Breakdown</h4>
              <div className="agi-bars">
                <div className="agi-bar"><div className="agi-bf good" style={{ width: `${pct(S.attendance.present, S.attendance.total)}%` }} /><span>Present: {S.attendance.present}</span></div>
                <div className="agi-bar"><div className="agi-bf warn" style={{ width: `${pct(S.attendance.late, S.attendance.total)}%` }} /><span>Late: {S.attendance.late}</span></div>
                <div className="agi-bar"><div className="agi-bf bad" style={{ width: `${pct(S.attendance.absent, S.attendance.total)}%` }} /><span>Absent: {S.attendance.absent}</span></div>
              </div>
            </div>
            <div className="agi-card">
              <h4><Ic name="log" size={16} /> Academic Stats</h4>
              <div className="agi-kvs"><div className="agi-kv"><span>Courses</span><b>{S.campus.courses}</b></div><div className="agi-kv"><span>Assignments</span><b>{S.campus.assignments}</b></div><div className="agi-kv"><span>Enrollments</span><b>{S.campus.enrollments}</b></div><div className="agi-kv"><span>Graded</span><b>{S.campus.graded_enrollments}</b></div></div>
            </div>
            <div className="agi-card">
              <h4><Ic name="cpu" size={16} /> AGI Brain Activity</h4>
              <div className="agi-kvs"><div className="agi-kv"><span>Thought Logs</span><b>{S.agi.logs}</b></div><div className="agi-kv"><span>Memories</span><b>{S.agi.memories}</b></div><div className="agi-kv"><span>Notifications</span><b>{S.agi.notifications}</b></div><div className="agi-kv"><span>Tools</span><b>6</b></div></div>
            </div>
          </div>
          {S.at_risk_students.length > 0 && (
            <div className="agi-card" style={{ marginTop: 16 }}>
              <h4 style={{ color: '#ef4444' }}><Ic name="alert" size={16} /> At-Risk Students</h4>
              <table className="agi-tbl"><thead><tr><th>Name</th><th>Major</th><th>Attendance</th><th>Status</th></tr></thead><tbody>
                {S.at_risk_students.map(s => <tr key={s.id}><td style={{ fontWeight: 600 }}>{s.name}</td><td>{s.major || '—'}</td><td>{s.rate}%</td><td><Badge status="at-risk" /></td></tr>)}
              </tbody></table>
            </div>
          )}
        </div>
      )}

      {/* ══════ STUDENTS ══════ */}
      {tab === 'students' && (
        <div className="agi-pnl">
          <h3 style={{ marginBottom: 16 }}>Student Intelligence ({studOv.length})</h3>
          {!studOv.length && <p className="agi-muted">No student data.</p>}
          <div style={{ overflowX: 'auto' }}>
            <table className="agi-tbl"><thead><tr><th>Name</th><th>Email</th><th>Major</th><th>Year</th><th>Attendance</th><th>Courses</th><th>Grades</th><th>Status</th></tr></thead><tbody>
              {studOv.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td className="agi-muted">{s.email}</td>
                  <td>{s.major || '—'}</td><td>{s.year || '—'}</td>
                  <td style={{ fontWeight: 600, color: s.attendance_rate < 60 ? '#ef4444' : s.attendance_rate < 80 ? '#f59e0b' : '#10b981' }}>{s.attendance_rate}%</td>
                  <td>{s.courses}</td><td>{s.grades.length ? s.grades.join(', ') : '—'}</td>
                  <td><Badge status={s.status} /></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {/* ══════ FACULTY ══════ */}
      {tab === 'faculty' && (
        <div className="agi-pnl">
          <h3 style={{ marginBottom: 16 }}>Faculty Intelligence ({facOv.length})</h3>
          {!facOv.length && <p className="agi-muted">No faculty data.</p>}
          <div className="agi-g2">
            {facOv.map(f => (
              <div key={f.id} className="agi-card">
                <h4>{f.name}</h4>
                <div className="agi-muted" style={{ fontSize: 13 }}>{f.email}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="agi-badge">{f.department || 'General'}</span>
                  <span className="agi-badge blue">{f.courses_count} Courses</span>
                  <span className="agi-badge purple">{f.total_students} Students</span>
                </div>
                {f.courses.length > 0 && <ul className="agi-clist">{f.courses.map(c => <li key={c.id}><b>{c.code}</b> — {c.name}</li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ LOGS ══════ */}
      {tab === 'logs' && (
        <div className="agi-pnl">
          <h3 style={{ marginBottom: 16 }}>AGI Thought Logs ({logs.length})</h3>
          {!logs.length && <p className="agi-muted">No AGI activity yet. Send a command to generate logs.</p>}
          <div className="agi-ll">{logs.map(l => (
            <div key={l.id} className="agi-li">
              <div className="agi-li-top"><span className="agi-badge purple">{l.module}</span><span className="agi-muted" style={{ fontSize: 12 }}>{new Date(l.timestamp).toLocaleString()}</span></div>
              <div className="agi-li-goal"><Ic name="zap" size={12} /> <b>Goal:</b> {l.goal}</div>
              <div className="agi-li-dec"><b>Decision:</b> {l.decision?.slice(0, 200)}{l.decision?.length > 200 ? '…' : ''}</div>
            </div>
          ))}</div>
        </div>
      )}

      {/* ══════ BROADCASTS ══════ */}
      {tab === 'alerts' && (
        <div className="agi-pnl">
          <h3 style={{ marginBottom: 16 }}>System Broadcasts ({notifs.length})</h3>
          {!notifs.length && <p className="agi-muted">No broadcasts yet.</p>}
          <div className="agi-ll">{notifs.map(n => (
            <div key={n.id} className="agi-li">
              <div className="agi-li-top"><span className="agi-badge">{n.sender}</span><span className="agi-badge blue">To: {n.target}</span><span className="agi-muted" style={{ fontSize: 12 }}>{new Date(n.timestamp).toLocaleString()}</span></div>
              <div style={{ marginTop: 6 }}>{n.message}</div>
            </div>
          ))}</div>
        </div>
      )}

      {loading && <div className="agi-load">Loading intelligence data...</div>}
    </div>
  )
}
