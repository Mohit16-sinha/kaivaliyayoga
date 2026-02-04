import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Button, Spinner, Badge, Avatar } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Professional Earnings page with revenue analytics.
 */
const Earnings = () => {
    const navigate = useNavigate();
    const { formatPrice, currency } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [earningsData, setEarningsData] = useState(null);
    const [chartRange, setChartRange] = useState('6');
    const [dateRange, setDateRange] = useState('30');

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const fetchEarningsData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setEarningsData(mockEarningsData);
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-earth-200 rounded-lg shadow-lg p-3">
                    <p className="font-medium text-earth-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {formatPrice(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const { summary, breakdown, chart_data, transactions, revenue_by_service } = earningsData || {};

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Earnings</h1>
                        <p className="text-earth-500 mt-1">Track your revenue and payouts</p>
                    </div>
                    <Link to="/professional/payouts">
                        <Button variant="ghost">View Payout History</Button>
                    </Link>
                </div>

                {/* Earnings Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Total Earnings Card */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                        <p className="text-emerald-100 text-sm">Total Earnings (All Time)</p>
                        <p className="text-4xl font-bold mt-2">{formatPrice(summary?.total_earnings || 0)}</p>
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-emerald-100 text-xs">This Month</p>
                                <p className="text-xl font-semibold">{formatPrice(summary?.this_month || 0)}</p>
                                <span className={`text-xs ${summary?.month_change >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                                    {summary?.month_change >= 0 ? '↑' : '↓'} {Math.abs(summary?.month_change || 0)}% vs last month
                                </span>
                            </div>
                            <div>
                                <p className="text-emerald-100 text-xs">Last Month</p>
                                <p className="text-xl font-semibold">{formatPrice(summary?.last_month || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Available Balance Card */}
                    <div className="bg-white rounded-2xl shadow-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-earth-500 text-sm">Available to Withdraw</p>
                                <p className="text-3xl font-bold text-earth-900 mt-1">{formatPrice(summary?.available_balance || 0)}</p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/professional/payouts/request')}
                                disabled={summary?.available_balance < 50}
                            >
                                Request Payout
                            </Button>
                        </div>
                        <p className="text-sm text-earth-500 mb-4">
                            {summary?.available_balance < 50
                                ? `Minimum $50 required for payout. You need ${formatPrice(50 - (summary?.available_balance || 0))} more.`
                                : 'Ready to withdraw!'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-earth-100">
                            <div>
                                <p className="text-earth-400 text-xs">Pending (7-day hold)</p>
                                <p className="font-medium text-earth-700">{formatPrice(summary?.pending_balance || 0)}</p>
                            </div>
                            <div>
                                <p className="text-earth-400 text-xs">Total Paid Out</p>
                                <p className="font-medium text-earth-700">{formatPrice(summary?.total_paid_out || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breakdown Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Gross Earnings</p>
                        <p className="text-xl font-bold text-earth-900">{formatPrice(breakdown?.gross || 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Platform Fee (20%)</p>
                        <p className="text-xl font-bold text-red-600">-{formatPrice(breakdown?.fees || 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4 border-2 border-primary-200">
                        <p className="text-earth-500 text-sm">Net Earnings</p>
                        <p className="text-xl font-bold text-primary-600">{formatPrice(breakdown?.net || 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Avg per Session</p>
                        <p className="text-xl font-bold text-earth-900">{formatPrice(breakdown?.avg_per_session || 0)}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Earnings Over Time */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-earth-900">Earnings Over Time</h3>
                            <div className="flex gap-2">
                                {['6', '12'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setChartRange(range)}
                                        className={`px-3 py-1 text-sm rounded-lg ${chartRange === range
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-earth-500 hover:bg-earth-100'
                                            }`}
                                    >
                                        {range} Months
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartRange === '6' ? chart_data?.slice(-6) : chart_data}>
                                    <defs>
                                        <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area type="monotone" dataKey="gross" name="Gross" stroke="#10B981" fillOpacity={1} fill="url(#colorGross)" />
                                    <Area type="monotone" dataKey="net" name="Net" stroke="#3B82F6" fillOpacity={1} fill="url(#colorNet)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue by Service */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h3 className="font-semibold text-earth-900 mb-4">Revenue by Service</h3>
                        <div className="flex gap-6">
                            <div className="h-48 flex-shrink-0">
                                <ResponsiveContainer width={160} height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenue_by_service}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={65}
                                            paddingAngle={2}
                                            dataKey="revenue"
                                        >
                                            {revenue_by_service?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-3">
                                {revenue_by_service?.map((service, index) => (
                                    <div key={service.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-sm text-earth-700">{service.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-earth-900">{formatPrice(service.revenue)}</p>
                                            <p className="text-xs text-earth-500">{service.sessions} sessions</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-card">
                    <div className="p-6 border-b border-earth-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="font-semibold text-earth-900">Recent Transactions</h3>
                            <div className="flex gap-2">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="px-3 py-1.5 border border-earth-200 rounded-lg text-sm"
                                >
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="all">All time</option>
                                </select>
                                <Button variant="ghost" size="sm">Export CSV</Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-earth-50 border-b border-earth-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Service</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase">Gross</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase">Fee</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase">Net</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-earth-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-100">
                                {transactions?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-earth-50">
                                        <td className="px-6 py-4 text-sm text-earth-600">{tx.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar name={tx.client} size="sm" />
                                                <span className="text-sm font-medium text-earth-900">{tx.client}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-earth-600">{tx.service}</td>
                                        <td className="px-6 py-4 text-sm text-earth-900 text-right">{formatPrice(tx.gross)}</td>
                                        <td className="px-6 py-4 text-sm text-red-600 text-right">-{formatPrice(tx.fee)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-earth-900 text-right">{formatPrice(tx.net)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={tx.status === 'paid' ? 'success' : tx.status === 'pending' ? 'warning' : 'default'}>
                                                {tx.status}
                                            </Badge>
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

// Mock data
const mockEarningsData = {
    summary: {
        total_earnings: 15420,
        this_month: 2850,
        last_month: 2400,
        month_change: 18.75,
        available_balance: 1850,
        pending_balance: 680,
        total_paid_out: 12890,
    },
    breakdown: {
        gross: 3562,
        fees: 712,
        net: 2850,
        avg_per_session: 95,
    },
    chart_data: [
        { month: 'Aug', gross: 2100, net: 1680 },
        { month: 'Sep', gross: 2500, net: 2000 },
        { month: 'Oct', gross: 2800, net: 2240 },
        { month: 'Nov', gross: 3100, net: 2480 },
        { month: 'Dec', gross: 3000, net: 2400 },
        { month: 'Jan', gross: 3562, net: 2850 },
    ],
    revenue_by_service: [
        { name: 'Yoga Therapy', revenue: 1450, sessions: 18 },
        { name: 'Consultation', revenue: 850, sessions: 12 },
        { name: 'Group Session', revenue: 400, sessions: 8 },
        { name: 'Workshop', revenue: 150, sessions: 2 },
    ],
    transactions: [
        { id: 1, date: 'Jan 12, 2026', client: 'John Smith', service: 'Yoga Therapy', gross: 125, fee: 25, net: 100, status: 'paid' },
        { id: 2, date: 'Jan 10, 2026', client: 'Sarah Johnson', service: 'Consultation', gross: 75, fee: 15, net: 60, status: 'paid' },
        { id: 3, date: 'Jan 8, 2026', client: 'Michael Brown', service: 'Yoga Therapy', gross: 125, fee: 25, net: 100, status: 'pending' },
        { id: 4, date: 'Jan 5, 2026', client: 'Emily Davis', service: 'Group Session', gross: 50, fee: 10, net: 40, status: 'paid' },
        { id: 5, date: 'Jan 3, 2026', client: 'David Wilson', service: 'Follow-up', gross: 85, fee: 17, net: 68, status: 'paid' },
    ],
};

export default Earnings;
