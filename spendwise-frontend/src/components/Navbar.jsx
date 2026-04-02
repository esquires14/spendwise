import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Reports', path: '/reports' },
    { label: 'Categories', path: '/categories' },
    { label: 'Settings', path: '/settings' },
];

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username') || 'User';
    const initials = username.slice(0, 2).toUpperCase();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{
            width: '190px', background: '#e8e4db', display: 'flex',
            flexDirection: 'column', padding: '1.5rem 1rem', flexShrink: 0,
            minHeight: '100vh'
        }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
                <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    background: '#7F77DD', display: 'flex', alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>S</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#2c2c2a' }}>
          SpendWise
        </span>
            </div>

            {/* User card */}
            <div style={{
                background: '#ddd8ce', borderRadius: '14px', padding: '1rem',
                marginBottom: '1.75rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px'
            }}>
                <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: '#7F77DD', display: 'flex', alignItems: 'center',
                    justifyContent: 'center'
                }}>
          <span style={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}>
            {initials}
          </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#2c2c2a' }}>
                    {username}
                </div>
                <div style={{ fontSize: '11px', color: '#888780' }}>Personal account</div>
            </div>

            {/* Nav items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '9px',
                                padding: '0.55rem 0.85rem', borderRadius: '10px',
                                fontSize: '13px', cursor: 'pointer',
                                background: isActive ? '#7F77DD' : 'transparent',
                                color: isActive ? '#fff' : '#5f5e5a',
                                fontWeight: isActive ? '500' : '400',
                            }}
                        >
                            <div style={{
                                width: '7px', height: '7px', borderRadius: '50%',
                                background: 'currentColor', flexShrink: 0
                            }} />
                            {item.label}
                        </div>
                    );
                })}
            </div>

            {/* Logout */}
            <div
                onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '0.55rem 0.85rem', fontSize: '13px',
                    color: '#888780', cursor: 'pointer', marginTop: '1rem'
                }}
            >
                <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#888780', flexShrink: 0
                }} />
                Log out
            </div>
        </div>
    );
}

export default Navbar;