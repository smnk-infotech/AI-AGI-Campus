import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import api from '../services/api'

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
        <div className="login-page">
            <div className="login-card">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-teal-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h1>
                <p className="text-slate-500 mb-8 text-sm">Sign in to access your courses and exams</p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="text-left space-y-5">
                    <div className="form-group">
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input"
                            placeholder="student@university.edu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Demo Access:</p>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                        aarav.kumar@student.edu / password123
                    </div>
                </div>
            </div>
        </div>
    )
}
