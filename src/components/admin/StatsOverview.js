import React, { useState, useEffect } from 'react';

const StatsOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading stats...</div>;
    if (!stats) return <div>Failed to load stats.</div>;

    return (
        <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Revenue" value={`₹${stats.total_revenue?.toLocaleString() || 0}`} color="bg-green-100 text-green-800" />
                <MetricCard title="Active Students" value={stats.total_students} color="bg-blue-100 text-blue-800" />
                <MetricCard title="Bookings (Today)" value={stats.active_bookings_today} color="bg-purple-100 text-purple-800" />
                <MetricCard title="Unread Messages" value={stats.unread_messages} color="bg-red-100 text-red-800" />
            </div>

            {/* Detailed Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="font-bold text-gray-700 mb-4">Financial Overview</h3>
                    <div className="flex justify-between border-b py-2">
                        <span>Monthly Revenue</span>
                        <span className="font-semibold">₹{stats.monthly_revenue?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span>Weekly Revenue</span>
                        <span className="font-semibold">₹{stats.weekly_revenue?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="font-bold text-gray-700 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                        {stats.recent_bookings?.map(b => (
                            <div key={b.id} className="flex justify-between text-sm">
                                <div>
                                    <span className="font-medium block">{b.user_name}</span>
                                    <span className="text-gray-500">{b.class_name}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block ${b.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                                        {b.status}
                                    </span>
                                    <span className="text-xs text-gray-400">{b.class_time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, color }) => (
    <div className={`p-6 rounded-lg shadow ${color}`}>
        <h3 className="text-sm font-semibold opacity-80">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

export default StatsOverview;
