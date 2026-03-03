import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login({ setToken }) {
    const [email, setEmail] = useState('admin@campus.edu')
    const [password, setPassword] = useState('admin123')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = await api.login(email, password)
            setToken(data.access_token)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form className="card" onSubmit={handleLogin} style={{ width: 400, padding: 40 }}>
                <h2>Admin Console Login</h2>
                <p className="muted">Authorized personnel only.</p>

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
                    {loading ? 'Logging in...' : 'Access Console'}
                </button>
            </form>
        </div>
    )
}
