import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { EarningsCard, TodaySchedule, PendingActions, PerformanceCharts } from '../../components/professional';
import { StatCard, WelcomeHeader } from '../../components/dashboard';
import { Button, Spinner, Avatar } from '../../components/ui';

/**
 * Professional Dashboard - Main hub for healthcare providers.
 */
const ProfessionalDashboard = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.get('/professional/dashboard/stats');
            await new Promise(resolve => setTimeout(resolve, 500));
            setDashboardData(mockDashboardData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setDashboardData(mockDashboardData);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPayout = () => {
        navigate('/professional/payouts/request');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const { stats, earnings, today_appointments, pending_actions, next_appointment, chart_data } = dashboardData || {};

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <WelcomeHeader
                    userName={user?.full_name?.split(' ')[0] || 'Doctor'}
                    subtitle={`You have ${today_appointments?.length || 0} appointment${today_appointments?.length !== 1 ? 's' : ''} scheduled today.`}
                />

                {/* Next Appointment Highlight */}
                {next_appointment && (
                    <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <p className="text-primary-100 text-sm">Next Appointment</p>
                                    <p className="text-xl font-bold">{next_appointment.client?.name}</p>
                                    <p className="text-primary-100">{next_appointment.service?.name} • {next_appointment.time_until}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Avatar
                                    src={next_appointment.client?.profile_image_url}
                                    name={next_appointment.client?.name}
                                    size="lg"
                                    className="border-2 border-white/30"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="bg-white/20 text-white hover:bg-white/30"
                                        onClick={() => navigate(`/professional/appointments/${next_appointment.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="bg-white text-primary-600 hover:bg-primary-50"
                                    >
                                        Prepare Session
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        label="Total Clients"
                        value={stats?.total_clients || 0}
                        change={`+${stats?.new_clients_this_month || 0} this month`}
                        changeType="positive"
                        link="/professional/clients"
                    />
                    <StatCard
                        icon={
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        label="Sessions Completed"
                        value={stats?.total_sessions || 0}
                        change={`${stats?.sessions_this_month || 0} this month`}
                        link="/professional/appointments?tab=past"
                    />
                    <StatCard
                        icon={
                            <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        }
                        label="Average Rating"
                        value={stats?.average_rating?.toFixed(1) || '5.0'}
                        change={`${stats?.total_reviews || 0} reviews`}
                        badge={stats?.average_rating >= 4.8 ? '⭐ Top Rated' : null}
                    />
                    <StatCard
                        icon={
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                        label="Response Rate"
                        value={`${stats?.response_rate || 100}%`}
                        change={`Avg ${stats?.avg_response_time || '< 1h'}`}
                        badge={stats?.response_rate >= 95 ? '🚀 Fast' : null}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Earnings Card */}
                        <EarningsCard
                            earnings={earnings}
                            onRequestPayout={handleRequestPayout}
                        />

                        {/* Today's Schedule */}
                        <TodaySchedule
                            appointments={today_appointments}
                            onViewDetails={(apt) => navigate(`/professional/appointments/${apt.id}`)}
                            onJoinMeeting={(apt) => console.log('Join meeting:', apt.id)}
                        />

                        {/* Performance Charts */}
                        <PerformanceCharts
                            bookingsData={chart_data?.bookings || []}
                            revenueByService={chart_data?.revenue_by_service || []}
                        />
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-8">
                        {/* Pending Actions */}
                        <PendingActions actions={pending_actions} />

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-card p-6">
                            <h3 className="text-lg font-semibold text-earth-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/professional/availability">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">📅</span>
                                        <span className="text-xs">Update Schedule</span>
                                    </Button>
                                </Link>
                                <Link to="/professional/earnings">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">💰</span>
                                        <span className="text-xs">View Earnings</span>
                                    </Button>
                                </Link>
                                <Link to="/professional/clients">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">👥</span>
                                        <span className="text-xs">Manage Clients</span>
                                    </Button>
                                </Link>
                                <Link to="/professional/profile-edit">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">⚙️</span>
                                        <span className="text-xs">Profile Settings</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Verification Status (if not verified) */}
                        {pending_actions?.verification_incomplete && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-800">Complete Your Verification</h4>
                                        <p className="text-sm text-orange-700 mt-1">
                                            Verified profiles get more bookings. Complete your verification to unlock your full potential.
                                        </p>
                                        <Link to="/professional/verification-status">
                                            <Button variant="primary" size="sm" className="mt-3">
                                                Complete Verification
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock dashboard data
const mockDashboardData = {
    stats: {
        total_clients: 47,
        new_clients_this_month: 8,
        total_sessions: 234,
        sessions_this_month: 18,
        average_rating: 4.9,
        total_reviews: 127,
        response_rate: 98,
        avg_response_time: '< 1h',
    },
    earnings: {
        this_month: 4250,
        last_month: 3800,
        gross: 5100,
        fees: 850,
        available_balance: 2850,
        pending_balance: 680,
    },
    next_appointment: {
        id: 1,
        time_until: 'in 2 hours',
        client: { name: 'John Smith', profile_image_url: null },
        service: { name: '1-on-1 Yoga Therapy' },
    },
    today_appointments: [
        {
            id: 1,
            scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            client: { name: 'John Smith' },
            service: { name: '1-on-1 Yoga Therapy' },
            is_first_session: true,
        },
        {
            id: 2,
            scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            duration: 45,
            client: { name: 'Sarah Johnson' },
            service: { name: 'Nutrition Consultation' },
            is_first_session: false,
        },
        {
            id: 3,
            scheduled_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            client: { name: 'Michael Brown' },
            service: { name: 'Stress Management' },
            is_first_session: false,
        },
    ],
    pending_actions: {
        pending_bookings: 3,
        unread_messages: 5,
        pending_reviews: 2,
        verification_incomplete: false,
    },
    chart_data: {
        bookings: [
            { month: 'Jul', bookings: 12 },
            { month: 'Aug', bookings: 18 },
            { month: 'Sep', bookings: 15 },
            { month: 'Oct', bookings: 22 },
            { month: 'Nov', bookings: 19 },
            { month: 'Dec', bookings: 25 },
            { month: 'Jan', bookings: 28 },
        ],
        revenue_by_service: [
            { name: 'Yoga Therapy', revenue: 2100, sessions: 24 },
            { name: 'Consultation', revenue: 1250, sessions: 15 },
            { name: 'Group Session', revenue: 680, sessions: 8 },
            { name: 'Workshop', revenue: 420, sessions: 2 },
        ],
    },
};

export default ProfessionalDashboard;
