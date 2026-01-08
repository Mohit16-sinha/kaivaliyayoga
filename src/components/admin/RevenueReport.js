import React, { useState, useEffect } from 'react';

const RevenueReport = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRevenue = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const queryParams = new URLSearchParams({ from, to });
            const response = await fetch(`http://localhost:8080/admin/revenue?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setReport(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({ from, to, export: 'true' });
        window.open(`http://localhost:8080/admin/revenue?${queryParams}&token=${token}`, '_blank');
        // Note: For Token in URL to work, Backend might need query param auth or we use blob download.
        // For simplicity, let's assume specific download handling or just open works if browser keeps cookies (it won't for JWT headers).
        // Better approach: fetch blob.

        fetch(`http://localhost:8080/admin/revenue?${queryParams}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'revenue_report.csv';
                a.click();
            });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Revenue Reports</h2>

            {/* Filters */}
            <div className="flex gap-4 mb-6 items-end">
                <div>
                    <label className="block text-sm text-gray-600">From</label>
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">To</label>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded" />
                </div>
                <button
                    onClick={fetchRevenue}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
                {report && (
                    <button onClick={downloadCSV} className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50">
                        Export CSV
                    </button>
                )}
            </div>

            {/* Results */}
            {report && (
                <div>
                    <div className="mb-4 bg-gray-50 p-4 rounded flex justify-between">
                        <div>
                            <span className="text-gray-500">Transactions:</span> <strong>{report.count}</strong>
                        </div>
                        <div>
                            <span className="text-gray-500">Total Revenue:</span> <strong className="text-xl text-green-700">₹{report.total.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Order ID</th>
                                    <th className="p-3">Method</th>
                                    <th className="p-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.payments?.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td className="p-3">{p.User?.name || 'Unknown'}</td>
                                        <td className="p-3 font-mono text-xs">{p.order_id}</td>
                                        <td className="p-3 text-sm">{p.method}</td>
                                        <td className="p-3 text-right font-medium">₹{p.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueReport;
