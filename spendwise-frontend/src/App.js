import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import './App.css';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f0ede6' }}>
            <Navbar />
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {children}
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <AppLayout><Dashboard /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="/transactions" element={
                    <PrivateRoute>
                        <AppLayout><Transactions /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="/budgets" element={
                    <PrivateRoute>
                        <AppLayout><Budgets /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="/reports" element={
                    <PrivateRoute>
                        <AppLayout><Reports /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="/categories" element={
                    <PrivateRoute>
                        <AppLayout><Categories /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="/settings" element={
                    <PrivateRoute>
                        <AppLayout><Settings /></AppLayout>
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;