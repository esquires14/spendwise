import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validation
        if (!form.username.trim()) { setError('Username is required'); return; }
        if (form.username.length < 3) { setError('Username must be at least 3 characters'); return; }
        if (!form.email.trim()) { setError('Email is required'); return; }
        if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Invalid email format'); return; }
        if (!form.password.trim()) { setError('Password is required'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

        setLoading(true);
        try {
            const response = await API.post('/api/auth/register', {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('email', response.data.email);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                display: 'flex', width: '860px', borderRadius: '20px',
                overflow: 'hidden', boxShadow: '0 4px 40px rgba(0,0,0,0.10)'
            }}>
                {/* Left panel */}
                <div style={{
                    background: '#3C3489', flex: 1, display: 'flex',
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', padding: '2.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
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
                        fontSize: '24px', fontWeight: '700', color: '#fff',
                        textAlign: 'center', marginBottom: '0.75rem'
                    }}>
                        Start your journey
                    </div>
                    <div style={{
                        fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center', lineHeight: '1.6', maxWidth: '220px'
                    }}>
                        Join SpendWise and take control of your personal finances today.
                    </div>
                </div>

                {/* Right panel */}
                <div style={{
                    background: '#f0ede6', width: '400px', display: 'flex',
                    flexDirection: 'column', justifyContent: 'center', padding: '2.5rem'
                }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#2c2c2a', marginBottom: '0.4rem' }}>
                        Create account
                    </div>
                    <div style={{ fontSize: '13px', color: '#888780', marginBottom: '1.5rem' }}>
                        Fill in your details to get started
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                            />
                        </div>

                        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', height: '42px', marginBottom: '1.25rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#888780' }}>
                        Already have an account?{' '}
                        <span
                            style={{ color: '#7F77DD', cursor: 'pointer', fontWeight: '500' }}
                            onClick={() => navigate('/login')}
                        >
              Sign in
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;