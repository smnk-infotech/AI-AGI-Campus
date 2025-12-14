import React, { useRef, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
const STUDENT_ID = "53576fbc-5bde-46ac-b4d7-48eeed9b5f126" // Seeded Aarav ID

export default function Attendance() {
    const videoRef = useRef(null)
    const [stream, setStream] = useState(null)
    const [status, setStatus] = useState('')

    async function startCamera() {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true })
            setStream(s)
            if (videoRef.current) videoRef.current.srcObject = s
        } catch (err) {
            alert("Camera access denied or missing.")
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop())
            setStream(null)
        }
    }

    async function verifyAndMark() {
        setStatus('Verifying face...')
        // Simulation of Face Rec: wait 1s then verify
        setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/api/attendance/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_id: STUDENT_ID, status: 'Present', method: 'FaceRec' })
                })
                const data = await res.json()
                if (res.ok) {
                    setStatus("✅ Verified & Marked Present!")
                    stopCamera()
                } else {
                    setStatus(`❌ ${data.message || 'Error'}`)
                }
            } catch (e) { setStatus("❌ Network Error") }
        }, 1500)
    }

    return (
        <div className="page">
            <section className="page-section">
                <header className="section-header"><h3>Attendance Verification</h3></header>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#000', height: 300, width: '100%', maxWidth: 400, margin: '0 auto', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stream ? (
                            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className="muted">Camera Off</div>
                        )}
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        {!stream ? (
                            <button className="btn btn-primary" onClick={startCamera}>Start Camera</button>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={verifyAndMark}>Verify Face</button>
                                <button className="btn" onClick={stopCamera}>Cancel</button>
                            </>
                        )}
                    </div>

                    <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>{status}</div>
                </div>
            </section>
        </div>
    )
}
