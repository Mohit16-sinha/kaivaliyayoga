import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Button, Spinner } from '../../components/ui';
import { AdminStatCard, ExportButton } from '../../components/admin';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Platform Analytics page - Comprehensive dashboard with charts and insights.
 */
const PlatformAnalytics = () => {
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('6m');
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAnalyticsData(mockAnalyticsData);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const { revenueOverTime, bookingsByProfession, userGrowth, topProfessionals, popularServices, geographicData } = analyticsData || {};

    return (
        <div className="min-h-screen bg-earth-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Platform Analytics</h1>
                        <p className="text-earth-500 mt-1">Insights and performance metrics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="1m">Last Month</option>
                            <option value="3m">Last 3 Months</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                        <Button variant="ghost" size="sm" onClick={() => console.log('Export all data')}>
                            📥 Export All
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <AdminStatCard icon="💰" label="Total Revenue" value={formatPrice(analyticsData?.totalRevenue)} change="+22.1%" changeType="positive" />
                    <AdminStatCard icon="📅" label="Total Bookings" value={analyticsData?.totalBookings?.toLocaleString()} change="+15.3%" changeType="positive" />
                    <AdminStatCard icon="👥" label="Active Users" value={analyticsData?.activeUsers?.toLocaleString()} change="+12.5%" changeType="positive" />
                    <AdminStatCard icon="⭐" label="Avg Rating" value={analyticsData?.avgRating} change="+0.2" changeType="positive" />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Over Time */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-earth-900">Revenue Over Time</h3>
                            <ExportButton
                                data={revenueOverTime}
                                columns={[{ accessor: 'month', header: 'Month' }, { accessor: 'revenue', header: 'Revenue' }]}
                                filename="revenue_over_time"
                            />
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip formatter={(value) => formatPrice(value)} />
                                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bookings by Profession */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Bookings by Profession</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bookingsByProfession} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} width={100} />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* User Growth */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">User Growth</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowth}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="users" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Popular Services */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Popular Services</h3>
                        <div className="h-56 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={popularServices}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {popularServices?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                            {popularServices?.map((service, idx) => (
                                <span key={idx} className="text-xs flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    {service.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Geographic Distribution */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Top Regions</h3>
                        <div className="space-y-3">
                            {geographicData?.map((region, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-earth-700">{region.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-earth-100 rounded-full h-2">
                                            <div
                                                className="bg-primary-500 h-2 rounded-full"
                                                style={{ width: `${region.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-earth-500">{region.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Professionals Leaderboard */}
                <div className="bg-white rounded-xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-earth-900">Top Professionals</h3>
                        <ExportButton
                            data={topProfessionals}
                            columns={[
                                { accessor: 'name', header: 'Name' },
                                { accessor: 'profession', header: 'Profession' },
                                { accessor: 'sessions', header: 'Sessions' },
                                { accessor: 'revenue', header: 'Revenue' },
                                { accessor: 'rating', header: 'Rating' },
                            ]}
                            filename="top_professionals"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-earth-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-earth-500">Rank</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-earth-500">Professional</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-earth-500">Sessions</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-earth-500">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-earth-500">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProfessionals?.map((pro, idx) => (
                                    <tr key={idx} className="border-b border-earth-50 hover:bg-earth-50">
                                        <td className="py-3 px-4">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                idx === 1 ? 'bg-gray-100 text-gray-800' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-earth-100 text-earth-600'
                                                }`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-earth-900">{pro.name}</p>
                                                <p className="text-xs text-earth-500">{pro.profession}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-earth-700">{pro.sessions}</td>
                                        <td className="py-3 px-4 text-earth-700">{formatPrice(pro.revenue)}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-yellow-500">⭐</span> {pro.rating}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock Data
const mockAnalyticsData = {
    totalRevenue: 248650,
    totalBookings: 12847,
    activeUsers: 4582,
    avgRating: '4.8',
    revenueOverTime: [
        { month: 'Aug', revenue: 22000 },
        { month: 'Sep', revenue: 27500 },
        { month: 'Oct', revenue: 33000 },
        { month: 'Nov', revenue: 38500 },
        { month: 'Dec', revenue: 42000 },
        { month: 'Jan', revenue: 48650 },
    ],
    bookingsByProfession: [
        { name: 'Yoga Therapist', bookings: 4850 },
        { name: 'Nutritionist', bookings: 3200 },
        { name: 'Meditation Coach', bookings: 2800 },
        { name: 'Fitness Coach', bookings: 1997 },
    ],
    userGrowth: [
        { month: 'Aug', users: 2800 },
        { month: 'Sep', users: 3200 },
        { month: 'Oct', users: 3650 },
        { month: 'Nov', users: 4100 },
        { month: 'Dec', users: 4350 },
        { month: 'Jan', users: 4582 },
    ],
    popularServices: [
        { name: '1-on-1 Therapy', value: 42 },
        { name: 'Consultation', value: 28 },
        { name: 'Group Session', value: 18 },
        { name: 'Follow-up', value: 12 },
    ],
    geographicData: [
        { name: 'United States', percentage: 42 },
        { name: 'India', percentage: 28 },
        { name: 'United Kingdom', percentage: 12 },
        { name: 'Canada', percentage: 8 },
        { name: 'Australia', percentage: 5 },
    ],
    topProfessionals: [
        { name: 'Dr. Sarah Williams', profession: 'Yoga Therapist', sessions: 248, revenue: 31250, rating: 4.9 },
        { name: 'Dr. Michael Chen', profession: 'Nutritionist', sessions: 186, revenue: 23250, rating: 4.8 },
        { name: 'Dr. Emily Roberts', profession: 'Meditation Coach', sessions: 172, revenue: 12900, rating: 4.85 },
        { name: 'Dr. Lisa Anderson', profession: 'Yoga Therapist', sessions: 156, revenue: 19500, rating: 4.7 },
        { name: 'Dr. James Wilson', profession: 'Fitness Coach', sessions: 134, revenue: 12060, rating: 4.6 },
    ],
};

export default PlatformAnalytics;
