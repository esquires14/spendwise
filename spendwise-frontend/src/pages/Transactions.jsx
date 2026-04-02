import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Transactions() {
    const userId = localStorage.getItem('userId');
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Search/filter state
    const [keyword, setKeyword] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Form state
    const [form, setForm] = useState({
        description: '', amount: '', date: '', type: 'EXPENSE',
        categoryId: '', source: '', paymentMethod: ''
    });

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            const [txRes, catRes] = await Promise.all([
                API.get(`/api/transactions?userId=${userId}`),
                API.get(`/api/categories?userId=${userId}`),
            ]);
            setTransactions(txRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            let url = `/api/transactions/search?userId=${userId}`;
            if (keyword) url += `&keyword=${keyword}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;
            const res = await API.get(url);
            let results = res.data;
            if (filterType) results = results.filter(t => t.type === filterType);
            if (filterCategory) results = results.filter(t => t.category?.id === parseInt(filterCategory));
            setTransactions(results);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const handleReset = () => {
        setKeyword('');
        setFilterType('');
        setFilterCategory('');
        setStartDate('');
        setEndDate('');
        fetchData();
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!form.description.trim()) { setError('Description is required'); return false; }
        if (!form.amount || parseFloat(form.amount) <= 0) { setError('Amount must be a positive number'); return false; }
        if (!form.date) { setError('Date is required'); return false; }
        if (!form.categoryId) { setError('Category is required'); return false; }
        if (form.type === 'INCOME' && !form.source.trim()) { setError('Source is required for income'); return false; }
        if (form.type === 'EXPENSE' && !form.paymentMethod.trim()) { setError('Payment method is required for expenses'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        try {
            if (editingTx) {
                await API.put(`/api/transactions/${editingTx.id}?userId=${userId}`, {
                    description: form.description,
                    amount: parseFloat(form.amount),
                    date: form.date,
                    type: form.type,
                    categoryId: parseInt(form.categoryId),
                    source: form.source,
                    paymentMethod: form.paymentMethod,
                });
                setSuccess('Transaction updated successfully!');
            } else {
                await API.post(`/api/transactions?userId=${userId}`, {
                    description: form.description,
                    amount: parseFloat(form.amount),
                    date: form.date,
                    type: form.type,
                    categoryId: parseInt(form.categoryId),
                    source: form.source,
                    paymentMethod: form.paymentMethod,
                });
                setSuccess('Transaction added successfully!');
            }
            setShowModal(false);
            setEditingTx(null);
            resetForm();
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
        }
    };

    const handleEdit = (tx) => {
        setEditingTx(tx);
        setForm({
            description: tx.description,
            amount: tx.amount,
            date: tx.date,
            type: tx.type,
            categoryId: tx.category?.id || '',
            source: tx.source || '',
            paymentMethod: tx.paymentMethod || '',
        });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await API.delete(`/api/transactions/${id}?userId=${userId}`);
            setSuccess('Transaction deleted successfully!');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete transaction');
        }
    };

    const resetForm = () => {
        setForm({
            description: '', amount: '', date: '', type: 'EXPENSE',
            categoryId: '', source: '', paymentMethod: ''
        });
        setError('');
    };

    const openAddModal = () => {
        setEditingTx(null);
        resetForm();
        setShowModal(true);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

    if (loading) return <div style={{ color: '#888780', padding: '2rem' }}>Loading transactions...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Transactions</h1>
                <button className="btn-primary" onClick={openAddModal}>+ Add transaction</button>
            </div>

            {success && <div className="success-text" style={{ marginBottom: '1rem', fontSize: '13px' }}>{success}</div>}

            {/* Search and filters */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>Search by keyword</label>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Type</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="">All types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                    <div>
                        <label>Start date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label>End date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" onClick={handleSearch}>Search</button>
                    <button className="btn-secondary" onClick={handleReset}>Reset</button>
                </div>
            </div>

            {/* Transactions table */}
            <div className="card">
                {transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888780', padding: '3rem 0' }}>
                        No transactions found. Add one to get started!
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id}>
                                <td style={{ fontWeight: '500' }}>{tx.description}</td>
                                <td>
                    <span className="badge badge-purple">
                      {tx.category?.name || 'Uncategorized'}
                    </span>
                                </td>
                                <td style={{ color: '#888780', fontSize: '12px' }}>{formatDate(tx.date)}</td>
                                <td>
                    <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                      {tx.type}
                    </span>
                                </td>
                                <td className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}
                                    style={{ textAlign: 'right' }}>
                                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-edit" onClick={() => handleEdit(tx)}>Edit</button>
                                    <button className="btn-danger" onClick={() => handleDelete(tx.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-title">
                            {editingTx ? 'Edit Transaction' : 'Add Transaction'}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Enter description"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label>Amount ($)</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.amount}
                                        onChange={handleFormChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={form.type} onChange={handleFormChange}>
                                        <option value="EXPENSE">Expense</option>
                                        <option value="INCOME">Income</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="categoryId" value={form.categoryId} onChange={handleFormChange}>
                                        <option value="">Select category</option>
                                        {categories
                                            .filter(c => c.type === form.type)
                                            .map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            {form.type === 'INCOME' && (
                                <div className="form-group">
                                    <label>Source</label>
                                    <input
                                        name="source"
                                        value={form.source}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Salary, Freelance"
                                    />
                                </div>
                            )}
                            {form.type === 'EXPENSE' && (
                                <div className="form-group">
                                    <label>Payment method</label>
                                    <input
                                        name="paymentMethod"
                                        value={form.paymentMethod}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Card, Cash"
                                    />
                                </div>
                            )}
                            {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary"
                                        onClick={() => { setShowModal(false); setEditingTx(null); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingTx ? 'Save changes' : 'Add transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;