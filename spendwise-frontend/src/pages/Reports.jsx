import React, { useState } from 'react';
import API from '../api/axios';

function Reports() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'User';
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const validateDates = () => {
        if (!startDate) { setError('Start date is required'); return false; }
        if (!endDate) { setError('End date is required'); return false; }
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date'); return false;
        }
        return true;
    };

    const handleGenerateReport = async () => {
        setError('');
        if (!validateDates()) return;

        setLoading(true);
        try {
            const res = await API.get(
                `/api/reports?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
            );
            setReport(res.data);
        } catch (err) {
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    // Group transactions by category for the report table
    const getCategoryRows = () => {
        if (!report?.transactions) return [];
        const grouped = {};
        report.transactions.forEach(tx => {
            const catName = tx.category?.name || 'Uncategorized';
            if (!grouped[catName]) {
                grouped[catName] = { name: catName, type: tx.type, total: 0, count: 0 };
            }
            grouped[catName].total += parseFloat(tx.amount);
            grouped[catName].count += 1;
        });
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Financial Report</h1>
                <p style={{ fontSize: '13px', color: '#888780', marginTop: '4px' }}>
                    Generate a summary report for any date range
                </p>
            </div>

            {/* Date controls */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label>Start date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>End date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        onClick={handleGenerateReport}
                        disabled={loading}
                        style={{ height: '38px', whiteSpace: 'nowrap' }}
                    >
                        {loading ? 'Generating...' : 'Generate report'}
                    </button>
                </div>
                {error && <div className="error-text" style={{ marginTop: '0.75rem' }}>{error}</div>}
            </div>

            {/* Report output */}
            {report && (
                <div className="card">
                    {/* Report header */}
                    <div style={{
                        borderBottom: '2px solid #f0ede6',
                        paddingBottom: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#2c2c2a' }}>
                                    {report.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888780', marginTop: '4px' }}>
                                    Period: {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888780', marginTop: '2px' }}>
                                    User: {username}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: '#888780' }}>
                                    Generated: {formatDateTime(report.generatedAt)}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888780', marginTop: '2px' }}>
                                    {report.transactionCount} transactions
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary pills */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
                        <div style={{ background: '#3C3489', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginBottom: '3px' }}>
                                Total income
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                                {formatCurrency(report.totalIncome)}
                            </div>
                        </div>
                        <div style={{ background: '#7F77DD', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginBottom: '3px' }}>
                                Total expenses
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                                {formatCurrency(report.totalExpenses)}
                            </div>
                        </div>
                        <div style={{ background: '#f5f2ee', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '10px', color: '#888780', marginBottom: '3px' }}>
                                Net balance
                            </div>
                            <div style={{
                                fontSize: '18px', fontWeight: '600',
                                color: parseFloat(report.netBalance) >= 0 ? '#3C3489' : '#993C1D'
                            }}>
                                {formatCurrency(report.netBalance)}
                            </div>
                        </div>
                        <div style={{ background: '#f5f2ee', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '10px', color: '#888780', marginBottom: '3px' }}>
                                Transactions
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c2c2a' }}>
                                {report.transactionCount}
                            </div>
                        </div>
                    </div>

                    {/* Report table */}
                    {report.transactions?.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888780', padding: '2rem' }}>
                            No transactions found for this date range.
                        </div>
                    ) : (
                        <>
                            {/* By category breakdown */}
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a', marginBottom: '0.75rem' }}>
                                Breakdown by category
                            </div>
                            <table style={{ marginBottom: '1.5rem' }}>
                                <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'right' }}>Transactions</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getCategoryRows().map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: '500' }}>{row.name}</td>
                                        <td>
                        <span className={`badge ${row.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                          {row.type}
                        </span>
                                        </td>
                                        <td style={{ textAlign: 'right', color: '#888780' }}>{row.count}</td>
                                        <td className={row.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}
                                            style={{ textAlign: 'right' }}>
                                            {row.type === 'INCOME' ? '+' : '-'}{formatCurrency(row.total)}
                                        </td>
                                    </tr>
                                ))}
                                {/* Totals row */}
                                <tr style={{ borderTop: '2px solid #f0ede6' }}>
                                    <td style={{ fontWeight: '700' }}>Net Total</td>
                                    <td></td>
                                    <td style={{ textAlign: 'right', fontWeight: '700' }}>
                                        {report.transactionCount}
                                    </td>
                                    <td style={{
                                        textAlign: 'right', fontWeight: '700',
                                        color: parseFloat(report.netBalance) >= 0 ? '#3C3489' : '#993C1D'
                                    }}>
                                        {formatCurrency(report.netBalance)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            {/* Full transaction list */}
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c2c2a', marginBottom: '0.75rem' }}>
                                All transactions
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{tx.description}</td>
                                        <td>
                        <span className="badge badge-purple">
                          {tx.category?.name || 'Uncategorized'}
                        </span>
                                        </td>
                                        <td style={{ color: '#888780', fontSize: '12px' }}>
                                            {formatDate(tx.date)}
                                        </td>
                                        <td>
                        <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type}
                        </span>
                                        </td>
                                        <td className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}
                                            style={{ textAlign: 'right' }}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!report && !loading && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}>
                    <div style={{ fontSize: '32px', marginBottom: '0.75rem' }}>📊</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
                        No report generated yet
                    </div>
                    <div style={{ fontSize: '13px' }}>
                        Select a date range above and click Generate report to see your financial summary.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;