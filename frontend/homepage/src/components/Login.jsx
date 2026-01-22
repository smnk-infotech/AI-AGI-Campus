import React, { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch(`${API_BASE}/api/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });

            if (!res.ok) throw new Error('Invalid credentials');

            const data = await res.json();
            const { access_token, role } = data;

            // Redirect Logic based on Port Mapping
            let targetUrl = '';
            if (role === 'student') targetUrl = 'http://localhost:5174';
            else if (role === 'faculty') targetUrl = 'http://localhost:5175';
            else if (role === 'admin') targetUrl = 'http://localhost:5177';
            else throw new Error('Unknown role');

            // Append token for handover
            window.location.href = `${targetUrl}?token=${access_token}`;

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ padding: 10, cursor: 'pointer' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
