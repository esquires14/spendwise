import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Categories() {
    const userId = localStorage.getItem('userId');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ name: '', type: 'EXPENSE' });

    useEffect(() => {
        fetchCategories();
    }, [userId]);

    const fetchCategories = async () => {
        try {
            const res = await API.get(`/api/categories?userId=${userId}`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!form.name.trim()) { setError('Category name is required'); return false; }
        if (form.name.length < 2) { setError('Name must be at least 2 characters'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        try {
            if (editingCat) {
                await API.put(`/api/categories/${editingCat.id}?userId=${userId}`, form);
                setSuccess('Category updated successfully!');
            } else {
                await API.post(`/api/categories?userId=${userId}`, form);
                setSuccess('Category created successfully!');
            }
            setShowModal(false);
            setEditingCat(null);
            resetForm();
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
        }
    };

    const handleEdit = (cat) => {
        setEditingCat(cat);
        setForm({ name: cat.name, type: cat.type });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category? Transactions using it will be uncategorized.')) return;
        try {
            await API.delete(`/api/categories/${id}?userId=${userId}`);
            setSuccess('Category deleted successfully!');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete category');
        }
    };

    const resetForm = () => {
        setForm({ name: '', type: 'EXPENSE' });
        setError('');
    };

    const openAddModal = () => {
        setEditingCat(null);
        resetForm();
        setShowModal(true);
    };

    const filteredCategories = categories.filter(c => {
        if (activeTab === 'ALL') return true;
        return c.type === activeTab;
    });

    const getCategoryEmoji = (name) => {
        const n = name.toLowerCase();
        if (n.includes('food') || n.includes('grocery') || n.includes('dining')) return '🥦';
        if (n.includes('salary') || n.includes('income') || n.includes('wage')) return '💰';
        if (n.includes('rent') || n.includes('home') || n.includes('housing')) return '🏠';
        if (n.includes('util') || n.includes('electric') || n.includes('water')) return '⚡';
        if (n.includes('sub') || n.includes('stream') || n.includes('netflix')) return '📺';
        if (n.includes('transport') || n.includes('car') || n.includes('gas')) return '🚗';
        if (n.includes('health') || n.includes('medical') || n.includes('doctor')) return '🏥';
        if (n.includes('entertain') || n.includes('fun') || n.includes('game')) return '🎬';
        if (n.includes('freelance') || n.includes('contract')) return '💼';
        return '📁';
    };

    if (loading) return <div style={{ color: '#888780', padding: '2rem' }}>Loading categories...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Categories</h1>
                <button className="btn-primary" onClick={openAddModal}>+ Add category</button>
            </div>

            {success && <div className="success-text" style={{ marginBottom: '1rem' }}>{success}</div>}
            {error && !showModal && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '4px', background: '#e8e4db',
                borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '1.25rem'
            }}>
                {['ALL', 'EXPENSE', 'INCOME'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '12px',
                            cursor: 'pointer', fontWeight: activeTab === tab ? '500' : '400',
                            background: activeTab === tab ? '#fff' : 'transparent',
                            color: activeTab === tab ? '#3C3489' : '#5f5e5a',
                        }}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </div>
                ))}
            </div>

            {/* Categories grid */}
            {filteredCategories.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}>
                    No categories found. Add one to get started!
                </div>
            ) : (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'
                }}>
                    {filteredCategories.map(cat => (
                        <div key={cat.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '10px',
                                    background: cat.type === 'INCOME' ? '#e8f5e8' : '#EEEDFE',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', flexShrink: 0
                                }}>
                                    {getCategoryEmoji(cat.name)}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#2c2c2a' }}>
                                        {cat.name}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                    <span className={`badge ${cat.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                      {cat.type}
                    </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                        <button className="btn-edit" style={{ padding: 0 }} onClick={() => handleEdit(cat)}>
                                            Edit
                                        </button>
                                        <button className="btn-danger" style={{ padding: '0.1rem 0.5rem', fontSize: '11px' }}
                                                onClick={() => handleDelete(cat.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-title">
                            {editingCat ? 'Edit Category' : 'Add Category'}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Food & Dining"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>
                            {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary"
                                        onClick={() => { setShowModal(false); setEditingCat(null); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCat ? 'Save changes' : 'Add category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categories;