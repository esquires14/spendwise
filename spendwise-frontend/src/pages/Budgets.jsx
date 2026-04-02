import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Budgets() {
    const userId = localStorage.getItem('userId');
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ categoryId: '', amount: '', month: '' });

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            const [budgetRes, txRes, catRes] = await Promise.all([
                API.get(`/api/budgets?userId=${userId}`),
                API.get(`/api/transactions?userId=${userId}`),
                API.get(`/api/categories?userId=${userId}`),
            ]);
            setBudgets(budgetRes.data);
            setTransactions(txRes.data);
            setCategories(catRes.data.filter(c => c.type === 'EXPENSE'));
        } catch (err) {
            console.error('Error fetching budgets:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!form.categoryId) { setError('Category is required'); return false; }
        if (!form.amount || parseFloat(form.amount) <= 0) {
            setError('Amount must be a positive number'); return false;
        }
        if (!form.month) { setError('Month is required'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        try {
            const payload = {
                categoryId: parseInt(form.categoryId),
                amount: parseFloat(form.amount),
                month: form.month,
            };

            if (editingBudget) {
                await API.put(`/api/budgets/${editingBudget.id}?userId=${userId}`, payload);
                setSuccess('Budget updated successfully!');
            } else {
                await API.post(`/api/budgets?userId=${userId}`, payload);
                setSuccess('Budget created successfully!');
            }
            setShowModal(false);
            setEditingBudget(null);
            resetForm();
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setForm({
            categoryId: budget.category?.id || '',
            amount: budget.amount,
            month: budget.month,
        });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this budget?')) return;
        try {
            await API.delete(`/api/budgets/${id}?userId=${userId}`);
            setSuccess('Budget deleted successfully!');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete budget');
        }
    };

    const resetForm = () => {
        setForm({ categoryId: '', amount: '', month: '' });
        setError('');
    };

    const getSpentAmount = (budget) => {
        return transactions
            .filter(t =>
                t.category?.id === budget.category?.id &&
                t.type === 'EXPENSE'
            )
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const getBarColor = (percentage) => {
        if (percentage >= 100) return '#993C1D';
        if (percentage >= 80) return '#BA7517';
        return '#7F77DD';
    };

    const getStatusLabel = (percentage) => {
        if (percentage >= 100) return { text: 'Over budget', color: '#993C1D', bg: '#FAEEDA' };
        if (percentage >= 80) return { text: 'Almost full', color: '#BA7517', bg: '#FFF8EC' };
        return { text: 'On track', color: '#3C3489', bg: '#EEEDFE' };
    };

    if (loading) return <div style={{ color: '#888780', padding: '2rem' }}>Loading budgets...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Budgets</h1>
                <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add budget
                </button>
            </div>

            {success && <div className="success-text" style={{ marginBottom: '1rem' }}>{success}</div>}
            {error && !showModal && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

            {/* Budget cards */}
            {budgets.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}>
                    No budgets set yet. Add one to start tracking your spending!
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {budgets.map(budget => {
                        const spent = getSpentAmount(budget);
                        const budgetAmount = parseFloat(budget.amount);
                        const percentage = Math.min((spent / budgetAmount) * 100, 100);
                        const rawPercentage = (spent / budgetAmount) * 100;
                        const status = getStatusLabel(rawPercentage);

                        return (
                            <div key={budget.id} className="card">
                                {/* Card header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#2c2c2a' }}>
                                            {budget.category?.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888780', marginTop: '2px' }}>
                                            {budget.month}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                                        background: status.bg, color: status.color, fontWeight: '500'
                                    }}>
                    {status.text}
                  </span>
                                </div>

                                {/* Progress bar */}
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#888780' }}>
                      Spent: {formatCurrency(spent)}
                    </span>
                                        <span style={{ fontSize: '12px', color: '#888780' }}>
                      Budget: {formatCurrency(budgetAmount)}
                    </span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f0ede6', borderRadius: '99px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '8px',
                                            width: `${percentage}%`,
                                            background: getBarColor(rawPercentage),
                                            borderRadius: '99px',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#888780' }}>
                      {Math.round(rawPercentage)}% used
                    </span>
                                        <span style={{ fontSize: '11px', color: '#888780' }}>
                      {formatCurrency(Math.max(budgetAmount - spent, 0))} remaining
                    </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f5f2ee', paddingTop: '0.75rem' }}>
                                    <button className="btn-edit" onClick={() => handleEdit(budget)}>Edit</button>
                                    <button className="btn-danger" onClick={() => handleDelete(budget.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary card */}
            {budgets.length > 0 && (
                <div className="card" style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a', marginBottom: '1rem' }}>
                        Budget Summary
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div style={{ background: '#f5f2ee', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '11px', color: '#888780', marginBottom: '4px' }}>Total budgeted</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c2c2a' }}>
                                {formatCurrency(budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0))}
                            </div>
                        </div>
                        <div style={{ background: '#f5f2ee', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '11px', color: '#888780', marginBottom: '4px' }}>Total spent</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#993C1D' }}>
                                {formatCurrency(budgets.reduce((sum, b) => sum + getSpentAmount(b), 0))}
                            </div>
                        </div>
                        <div style={{ background: '#f5f2ee', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '11px', color: '#888780', marginBottom: '4px' }}>Total remaining</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#3C3489' }}>
                                {formatCurrency(budgets.reduce((sum, b) =>
                                    sum + Math.max(parseFloat(b.amount) - getSpentAmount(b), 0), 0))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-title">
                            {editingBudget ? 'Edit Budget' : 'Add Budget'}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Budget amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label>Month</label>
                                <input
                                    type="month"
                                    value={form.month}
                                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                                />
                            </div>
                            {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary"
                                        onClick={() => { setShowModal(false); setEditingBudget(null); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingBudget ? 'Save changes' : 'Add budget'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Budgets;