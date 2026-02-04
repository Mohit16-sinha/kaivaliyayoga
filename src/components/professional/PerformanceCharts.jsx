import React, { useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Performance charts for professional dashboard.
 */
const PerformanceCharts = ({ bookingsData = [], revenueByService = [] }) => {
    const { formatPrice } = useCurrency();
    const [bookingsRange, setBookingsRange] = useState('6');

    const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

    // Filter bookings data based on selected range
    const filteredBookingsData = bookingsRange === '6'
        ? bookingsData.slice(-6)
        : bookingsData;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-earth-200 rounded-lg shadow-lg p-3">
                    <p className="font-medium text-earth-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.name.includes('Revenue') ? formatPrice(entry.value) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings Overview */}
            <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-earth-900">Bookings Overview</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBookingsRange('6')}
                            className={`px-3 py-1 text-sm rounded-lg ${bookingsRange === '6'
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-earth-500 hover:bg-earth-100'
                                }`}
                        >
                            6 Months
                        </button>
                        <button
                            onClick={() => setBookingsRange('12')}
                            className={`px-3 py-1 text-sm rounded-lg ${bookingsRange === '12'
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-earth-500 hover:bg-earth-100'
                                }`}
                        >
                            12 Months
                        </button>
                    </div>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredBookingsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                name="Bookings"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#10B981' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue by Service */}
            <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Revenue by Service</h3>

                <div className="flex gap-6">
                    <div className="h-48 flex-shrink-0">
                        <ResponsiveContainer width={180} height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueByService}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="revenue"
                                >
                                    {revenueByService.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatPrice(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-2">
                        {revenueByService.map((service, index) => (
                            <div key={service.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
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
    );
};

export default PerformanceCharts;
