import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Login({ setToken }) {
    const [email, setEmail] = useState('aarav.kumar@student.edu')
    const [password, setPassword] = useState('password123')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)

            const res = await fetch(`${API_BASE}/api/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            })

            if (!res.ok) throw new Error('Invalid credentials')

            const data = await res.json()
            setToken(data.access_token)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form className="card" onSubmit={handleLogin} style={{ width: 400, padding: 40 }}>
                <h2>Student Login</h2>
                <p className="muted">Enter your credentials to access the console.</p>

                {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5 }}>Email</label>
                    <input
                        className="input"
                        style={{ width: '100%' }}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 5 }}>Password</label>
                    <input
                        className="input"
                        type="password"
                        style={{ width: '100%' }}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}
