import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Dashboard() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'User';
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, budgetRes, catRes] = await Promise.all([
                    API.get(`/api/transactions?userId=${userId}`),
                    API.get(`/api/budgets?userId=${userId}`),
                    API.get(`/api/categories?userId=${userId}`),
                ]);
                setTransactions(txRes.data);
                setBudgets(budgetRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error('Error loading dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    // Get 5 most recent transactions
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ color: '#888780', fontSize: '14px' }}>Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#2c2c2a' }}>
                    Hello, {username}! 👋
                </h1>
                <p style={{ fontSize: '13px', color: '#888780', marginTop: '4px' }}>
                    Here's your financial overview
                </p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{ background: '#3C3489', borderRadius: '16px', padding: '1rem 1.1rem' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                        Total income
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                        {formatCurrency(totalIncome)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
                        All time
                    </div>
                </div>
                <div style={{ background: '#7F77DD', borderRadius: '16px', padding: '1rem 1.1rem' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                        Total expenses
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                        {formatCurrency(totalExpenses)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
                        All time
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1rem 1.1rem' }}>
                    <div style={{ fontSize: '11px', color: '#888780', marginBottom: '4px' }}>
                        Net balance
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#2c2c2a' }}>
                        {formatCurrency(netBalance)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#888780', marginTop: '3px' }}>
                        {transactions.length} transactions
                    </div>
                </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>

                {/* Recent transactions */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a' }}>
              Recent transactions
            </span>
                        <a href="/transactions" style={{ fontSize: '11px', color: '#7F77DD', textDecoration: 'none' }}>
                            See all →
                        </a>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888780', fontSize: '13px', padding: '2rem 0' }}>
                            No transactions yet. Add one to get started!
                        </div>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.description}</td>
                                    <td>
                      <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.category?.name || 'Uncategorized'}
                      </span>
                                    </td>
                                    <td style={{ color: '#888780', fontSize: '12px' }}>{formatDate(tx.date)}</td>
                                    <td className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}
                                        style={{ textAlign: 'right' }}>
                                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Budget status */}
                <div className="card">
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1rem' }}>
                        Budget status
                    </div>

                    {budgets.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888780', fontSize: '13px', padding: '2rem 0' }}>
                            No budgets set. <a href="/budgets" style={{ color: '#7F77DD' }}>Add one →</a>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {budgets.slice(0, 5).map(budget => {
                                const spent = transactions
                                    .filter(t => t.category?.id === budget.category?.id && t.type === 'EXPENSE')
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                                const percentage = Math.min((spent / parseFloat(budget.amount)) * 100, 100);
                                const isOver = spent > parseFloat(budget.amount);
                                const isWarning = percentage >= 80;

                                return (
                                    <div key={budget.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#2c2c2a' }}>
                        {budget.category?.name}
                      </span>
                                            <span style={{ fontSize: '11px', color: '#888780' }}>
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </span>
                                        </div>
                                        <div style={{
                                            height: '6px', background: '#f0ede6',
                                            borderRadius: '99px', overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '6px',
                                                width: `${percentage}%`,
                                                background: isOver ? '#993C1D' : isWarning ? '#BA7517' : '#7F77DD',
                                                borderRadius: '99px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;