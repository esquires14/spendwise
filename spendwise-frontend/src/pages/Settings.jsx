import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Settings() {
    const userId = localStorage.getItem('userId');
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Profile state
    const [profile, setProfile] = useState({ username: '', email: '' });

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        currency: 'USD', dateFormat: 'MM/DD/YYYY', defaultReportPeriod: 'MONTHLY'
    });

    // Notifications state
    const [notifications, setNotifications] = useState({
        budgetAlertsEnabled: true,
        monthlySummaryEnabled: true,
        newTransactionAlertsEnabled: false
    });

    useEffect(() => {
        fetchSettings();
    }, [userId]);

    const fetchSettings = async () => {
        try {
            const res = await API.get(`/api/users/${userId}/settings`);
            setPreferences({
                currency: res.data.currency || 'USD',
                dateFormat: res.data.dateFormat || 'MM/DD/YYYY',
                defaultReportPeriod: res.data.defaultReportPeriod || 'MONTHLY',
            });
            setNotifications({
                budgetAlertsEnabled: res.data.budgetAlertsEnabled,
                monthlySummaryEnabled: res.data.monthlySummaryEnabled,
                newTransactionAlertsEnabled: res.data.newTransactionAlertsEnabled,
            });
            // Load profile from localStorage
            setProfile({
                username: localStorage.getItem('username') || '',
                email: localStorage.getItem('email') || '',
            });
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setError('');
        setTimeout(() => setSuccess(''), 3000);
    };

    const showError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    // Save profile
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profile.username.trim()) { showError('Username is required'); return; }
        if (!profile.email.trim()) { showError('Email is required'); return; }
        if (!/\S+@\S+\.\S+/.test(profile.email)) { showError('Invalid email format'); return; }
        try {
            await API.put(`/api/users/${userId}`, profile);
            localStorage.setItem('username', profile.username);
            localStorage.setItem('email', profile.email);
            showSuccess('Profile updated successfully!');
        } catch (err) {
            showError(err.response?.data || 'Failed to update profile');
        }
    };

    // Save password
    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (!passwords.currentPassword) { showError('Current password is required'); return; }
        if (!passwords.newPassword) { showError('New password is required'); return; }
        if (passwords.newPassword.length < 6) { showError('New password must be at least 6 characters'); return; }
        if (passwords.newPassword !== passwords.confirmPassword) { showError('Passwords do not match'); return; }
        try {
            await API.put(`/api/users/${userId}/password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showSuccess('Password updated successfully!');
        } catch (err) {
            showError(err.response?.data || 'Failed to update password');
        }
    };

    // Save preferences
    const handleSavePreferences = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/api/users/${userId}/settings`, {
                ...preferences,
                ...notifications,
            });
            showSuccess('Preferences saved successfully!');
        } catch (err) {
            showError('Failed to save preferences');
        }
    };

    // Save notifications
    const handleSaveNotifications = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/api/users/${userId}/settings`, {
                ...preferences,
                ...notifications,
            });
            showSuccess('Notification settings saved!');
        } catch (err) {
            showError('Failed to save notifications');
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
        if (!window.confirm('This will permanently delete all your data. Are you absolutely sure?')) return;
        try {
            await API.delete(`/api/users/${userId}`);
            localStorage.clear();
            window.location.href = '/login';
        } catch (err) {
            showError('Failed to delete account');
        }
    };

    const initials = profile.username?.slice(0, 2).toUpperCase() || 'U';

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'security', label: 'Security' },
        { id: 'preferences', label: 'Preferences' },
        { id: 'notifications', label: 'Notifications' },
    ];

    if (loading) return <div style={{ color: '#888780', padding: '2rem' }}>Loading settings...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
            </div>

            {/* Feedback */}
            {success && <div className="success-text" style={{ marginBottom: '1rem' }}>{success}</div>}
            {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '4px', background: '#e8e4db',
                borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '1.25rem'
            }}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
                        style={{
                            padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '12px',
                            cursor: 'pointer', fontWeight: activeTab === tab.id ? '500' : '400',
                            background: activeTab === tab.id ? '#fff' : 'transparent',
                            color: activeTab === tab.id ? '#3C3489' : '#5f5e5a',
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1.25rem' }}>
                        Profile information
                    </div>
                    {/* Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#7F77DD', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexShrink: 0
                        }}>
                            <span style={{ color: '#fff', fontSize: '20px', fontWeight: '500' }}>{initials}</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#7F77DD', fontWeight: '500' }}>
                                {profile.username}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888780', marginTop: '2px' }}>
                                Personal account
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSaveProfile}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                value={profile.username}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', height: '38px' }}>
                            Save changes
                        </button>
                    </form>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1.25rem' }}>
                        Change password
                    </div>
                    <form onSubmit={handleSavePassword}>
                        <div className="form-group">
                            <label>Current password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="form-group">
                            <label>New password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm new password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                placeholder="Repeat new password"
                            />
                        </div>
                        <button type="submit" className="btn-primary"
                                style={{ width: '100%', height: '38px', marginBottom: '0.75rem' }}>
                            Update password
                        </button>
                    </form>
                    <div style={{ borderTop: '1px solid #f5f2ee', paddingTop: '1rem', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a', marginBottom: '0.5rem' }}>
                            Danger zone
                        </div>
                        <div style={{ fontSize: '12px', color: '#888780', marginBottom: '0.75rem' }}>
                            Once you delete your account all of your data will be permanently removed.
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            style={{
                                width: '100%', height: '38px', background: '#fff3f0',
                                color: '#993C1D', border: '1px solid #f5c6bb', borderRadius: '10px',
                                fontSize: '13px', fontWeight: '500', cursor: 'pointer'
                            }}
                        >
                            Delete account
                        </button>
                    </div>
                </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1.25rem' }}>
                        App preferences
                    </div>
                    <form onSubmit={handleSavePreferences}>
                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                value={preferences.currency}
                                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                            >
                                <option value="USD">USD — US Dollar ($)</option>
                                <option value="EUR">EUR — Euro (€)</option>
                                <option value="GBP">GBP — British Pound (£)</option>
                                <option value="CAD">CAD — Canadian Dollar (CA$)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date format</label>
                            <select
                                value={preferences.dateFormat}
                                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Default report period</label>
                            <select
                                value={preferences.defaultReportPeriod}
                                onChange={(e) => setPreferences({ ...preferences, defaultReportPeriod: e.target.value })}
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', height: '38px' }}>
                            Save preferences
                        </button>
                    </form>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1.25rem' }}>
                        Notification settings
                    </div>
                    <form onSubmit={handleSaveNotifications}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                            {[
                                {
                                    key: 'budgetAlertsEnabled',
                                    title: 'Budget alerts',
                                    sub: 'Notify when spending exceeds 80% of a budget'
                                },
                                {
                                    key: 'monthlySummaryEnabled',
                                    title: 'Monthly summary',
                                    sub: 'Receive a monthly financial report on the 1st'
                                },
                                {
                                    key: 'newTransactionAlertsEnabled',
                                    title: 'Transaction alerts',
                                    sub: 'Notify on each new transaction added'
                                },
                            ].map(item => (
                                <div key={item.key} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', padding: '0.75rem',
                                    background: '#f9f7f4', borderRadius: '10px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#2c2c2a' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888780', marginTop: '2px' }}>
                                            {item.sub}
                                        </div>
                                    </div>
                                    {/* Toggle */}
                                    <div
                                        onClick={() => setNotifications({
                                            ...notifications, [item.key]: !notifications[item.key]
                                        })}
                                        style={{
                                            width: '38px', height: '22px', borderRadius: '99px',
                                            background: notifications[item.key] ? '#7F77DD' : '#ddd8ce',
                                            position: 'relative', cursor: 'pointer', flexShrink: 0,
                                            transition: 'background 0.2s ease'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: '3px',
                                            left: notifications[item.key] ? '19px' : '3px',
                                            width: '16px', height: '16px', background: '#fff',
                                            borderRadius: '50%', transition: 'left 0.2s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', height: '38px' }}>
                            Save notifications
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Settings;