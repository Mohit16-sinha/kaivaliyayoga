import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Button, Spinner, Badge, Avatar } from '../../components/ui';
import { AdminStatCard } from '../../components/admin';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Admin Dashboard - Platform overview with metrics, pending actions, activity feed.
 */
const AdminDashboardNew = () => {
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setDashboardData(mockDashboardData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const { stats, pendingActions, activityFeed, revenueChart, userGrowthChart } = dashboardData || {};

    return (
        <div className="min-h-screen bg-earth-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Admin Dashboard</h1>
                    <p className="text-earth-500 mt-1">Platform overview and management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <AdminStatCard
                        icon="👥"
                        label="Total Users"
                        value={stats?.total_users?.toLocaleString()}
                        change={`+${stats?.users_growth}% this month`}
                        changeType="positive"
                    />
                    <AdminStatCard
                        icon="🧑‍⚕️"
                        label="Professionals"
                        value={stats?.total_professionals?.toLocaleString()}
                        change={`+${stats?.professionals_growth}% this month`}
                        changeType="positive"
                    />
                    <AdminStatCard
                        icon="📅"
                        label="Appointments"
                        value={stats?.total_appointments?.toLocaleString()}
                        change={`+${stats?.appointments_growth}% this month`}
                        changeType="positive"
                    />
                    <AdminStatCard
                        icon="💰"
                        label="Revenue"
                        value={formatPrice(stats?.total_revenue)}
                        change={`+${stats?.revenue_growth}% this month`}
                        changeType="positive"
                    />
                </div>

                {/* Pending Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                    <Link to="/admin/verification-requests" className="block">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-800 font-medium">Verification Requests</p>
                                    <p className="text-2xl font-bold text-yellow-900">{pendingActions?.verification_requests}</p>
                                </div>
                                <span className="text-3xl">🔍</span>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/reviews" className="block">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-800 font-medium">Reported Reviews</p>
                                    <p className="text-2xl font-bold text-red-900">{pendingActions?.reported_reviews}</p>
                                </div>
                                <span className="text-3xl">⚠️</span>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/payments" className="block">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-800 font-medium">Pending Payouts</p>
                                    <p className="text-2xl font-bold text-blue-900">{pendingActions?.pending_payouts}</p>
                                </div>
                                <span className="text-3xl">💸</span>
                            </div>
                        </div>
                    </Link>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-800 font-medium">Support Tickets</p>
                                <p className="text-2xl font-bold text-purple-900">{pendingActions?.support_tickets}</p>
                            </div>
                            <span className="text-3xl">🎫</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Revenue (Last 12 Months)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChart}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip formatter={(value) => formatPrice(value)} />
                                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">User Growth</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userGrowthChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="users" name="Users" fill="#3B82F6" />
                                    <Bar dataKey="professionals" name="Professionals" fill="#8B5CF6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Activity Feed & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-card">
                        <div className="p-4 border-b border-earth-100">
                            <h3 className="font-semibold text-earth-900">Recent Activity</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {activityFeed?.map((activity, idx) => (
                                <div key={idx} className="p-4 border-b border-earth-50 hover:bg-earth-50">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activity.type === 'signup' ? 'bg-green-100' :
                                            activity.type === 'booking' ? 'bg-blue-100' :
                                                activity.type === 'payment' ? 'bg-yellow-100' :
                                                    activity.type === 'verification' ? 'bg-purple-100' : 'bg-earth-100'
                                            }`}>
                                            {activity.type === 'signup' && '👤'}
                                            {activity.type === 'booking' && '📅'}
                                            {activity.type === 'payment' && '💳'}
                                            {activity.type === 'verification' && '✓'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-earth-900">{activity.message}</p>
                                            <p className="text-xs text-earth-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/verification-requests">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    🔍 Review Verifications
                                </Button>
                            </Link>
                            <Link to="/admin/professionals">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    👨‍⚕️ Manage Professionals
                                </Button>
                            </Link>
                            <Link to="/admin/users">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    👥 Manage Users
                                </Button>
                            </Link>
                            <Link to="/admin/payments">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    💰 Process Payouts
                                </Button>
                            </Link>
                            <Link to="/admin/appointments">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    📅 View Appointments
                                </Button>
                            </Link>
                            <Link to="/admin/analytics">
                                <Button variant="ghost" className="w-full justify-center text-sm h-auto py-3">
                                    📊 Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock Data
const mockDashboardData = {
    stats: {
        total_users: 4582,
        users_growth: 12.5,
        total_professionals: 156,
        professionals_growth: 8.2,
        total_appointments: 12847,
        appointments_growth: 15.3,
        total_revenue: 248650,
        revenue_growth: 22.1,
    },
    pendingActions: {
        verification_requests: 8,
        reported_reviews: 3,
        pending_payouts: 12,
        support_tickets: 5,
    },
    revenueChart: [
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18500 },
        { month: 'Apr', revenue: 22000 },
        { month: 'May', revenue: 19800 },
        { month: 'Jun', revenue: 24500 },
        { month: 'Jul', revenue: 28000 },
        { month: 'Aug', revenue: 31200 },
        { month: 'Sep', revenue: 27500 },
        { month: 'Oct', revenue: 33000 },
        { month: 'Nov', revenue: 38500 },
        { month: 'Dec', revenue: 42000 },
        { month: 'Jan', revenue: 48650 },
    ],
    userGrowthChart: [
        { month: 'Aug', users: 120, professionals: 8 },
        { month: 'Sep', users: 180, professionals: 12 },
        { month: 'Oct', users: 250, professionals: 15 },
        { month: 'Nov', users: 340, professionals: 22 },
        { month: 'Dec', users: 420, professionals: 28 },
        { month: 'Jan', users: 510, professionals: 35 },
    ],
    activityFeed: [
        { type: 'signup', message: 'John Doe signed up as a new user', time: '2 minutes ago' },
        { type: 'booking', message: 'Sarah J. booked a session with Dr. Smith', time: '5 minutes ago' },
        { type: 'verification', message: 'Dr. Emily Roberts submitted verification documents', time: '12 minutes ago' },
        { type: 'payment', message: 'Payment of $125 received for appointment #12847', time: '18 minutes ago' },
        { type: 'signup', message: 'Dr. Michael Chen registered as a professional', time: '25 minutes ago' },
        { type: 'booking', message: 'Completed: Session between Alex K. and Dr. Patel', time: '32 minutes ago' },
        { type: 'payment', message: 'Payout of $850 processed for Dr. Williams', time: '45 minutes ago' },
        { type: 'verification', message: 'Verification approved for Dr. Susan Lee', time: '1 hour ago' },
    ],
};

export default AdminDashboardNew;
