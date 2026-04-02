import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validation
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        setLoading(true);
        try {
            const response = await API.post('/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('email', response.data.email);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', height: '100vh', background: '#f0ede6',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                display: 'flex', width: '860px', height: '540px',
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 4px 40px rgba(0,0,0,0.10)'
            }}>
                {/* Left panel */}
                <div style={{
                    background: '#3C3489', flex: 1, display: 'flex',
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', padding: '2.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>S</span>
                        </div>
                        <span style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>SpendWise</span>
                    </div>
                    <div style={{
                        fontSize: '26px', fontWeight: '700', color: '#fff',
                        textAlign: 'center', marginBottom: '0.75rem', lineHeight: '1.3'
                    }}>
                        Take control of your finances
                    </div>
                    <div style={{
                        fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center', lineHeight: '1.6', maxWidth: '220px'
                    }}>
                        Track spending, set budgets, and generate reports — all in one place.
                    </div>
                </div>

                {/* Right panel */}
                <div style={{
                    background: '#f0ede6', width: '380px', display: 'flex',
                    flexDirection: 'column', justifyContent: 'center', padding: '2.5rem'
                }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#2c2c2a', marginBottom: '0.4rem' }}>
                        Welcome back
                    </div>
                    <div style={{ fontSize: '13px', color: '#888780', marginBottom: '2rem' }}>
                        Sign in to your account
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>

                        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', height: '42px', marginBottom: '1.25rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#888780' }}>
                        Don't have an account?{' '}
                        <span
                            style={{ color: '#7F77DD', cursor: 'pointer', fontWeight: '500' }}
                            onClick={() => navigate('/register')}
                        >
              Create one
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;