import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const AIPracticeStats = () => {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:8080/api/ai-practice/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                setStats(statsData);

                // Fetch History
                const historyRes = await fetch('http://localhost:8080/api/ai-practice/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const historyData = await historyRes.json();

                // Process history for chart (chronological order)
                const chartData = [...historyData].reverse().map(session => ({
                    date: new Date(session.date).toLocaleDateString(),
                    score: session.accuracy_score
                }));

                setHistory(historyData);
                setStats(prev => ({ ...prev, chartData }));

            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-earth-100 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-earth-100 pt-32 pb-12 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-primary text-earth-900">Your Progress</h1>
                    <Link to="/ai-practice" className="px-6 py-2 bg-accent text-white rounded-full font-bold hover:bg-accent-hover transition-colors">
                        New Practice
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-500 font-medium">Total Sessions</h3>
                        <p className="text-4xl font-bold text-earth-900">{stats?.total_sessions || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-500 font-medium">Total Practice Time</h3>
                        <p className="text-4xl font-bold text-earth-900">
                            {Math.round((stats?.total_duration || 0) / 60)} <span className="text-lg text-gray-400">min</span>
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-500 font-medium">Avg. Accuracy</h3>
                        <p className={`text-4xl font-bold ${(stats?.average_score || 0) >= 90 ? 'text-green-500' :
                                (stats?.average_score || 0) >= 70 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                            {stats?.average_score || 0}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-earth-900 mb-6">Accuracy Trend</h3>
                        <div className="h-[300px] w-full">
                            {stats?.chartData && stats.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No data available yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History List */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-earth-900 mb-6">Recent Sessions</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {history.map(session => (
                                <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-earth-900">{session.pose_name || "Yoga Pose"}</p>
                                        <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`font-bold ${session.accuracy_score >= 90 ? 'text-green-500' :
                                            session.accuracy_score >= 70 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {session.accuracy_score}%
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && (
                                <p className="text-center text-gray-400 py-4">No sessions yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPracticeStats;
