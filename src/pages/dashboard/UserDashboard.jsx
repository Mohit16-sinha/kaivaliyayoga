import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, WelcomeHeader, NextAppointment, ActivityTimeline } from '../../components/dashboard';
import { AppointmentCard } from '../../components/appointments';
import { ProfessionalCard } from '../../components/professional';
import { Button, Spinner, Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import appointmentService from '../../services/appointmentService';

/**
 * User Dashboard - Central hub for managing appointments and wellness journey.
 */
const UserDashboard = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    // Modal states
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch real dashboard data (or individual components if dashboard endpoint doesn't exist)
            const appointments = await appointmentService.getAll();

            // Construct dashboard data from appointments
            // This is a temporary client-side construction until full dashboard API exists
            const upcoming = appointments.upcoming || [];
            const next = upcoming.length > 0 ? upcoming[0] : null;

            setDashboardData({
                stats: {
                    total_appointments: (appointments.upcoming?.length || 0) + (appointments.past?.length || 0) + (appointments.cancelled?.length || 0),
                    upcoming_appointments: appointments.upcoming?.length || 0,
                    total_spent: 0, // Calculate from past payments
                    favorites_count: 0 // Fetch from favorites API
                },
                next_appointment: next,
                upcoming_appointments: upcoming.slice(1, 4), // Next 3 after the first one
                recent_activity: [], // Fetch from activity log
                recommended_professionals: [] // Fetch recommendations
            });

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Fallback for UI testing if API fails
            // setDashboardData(mockDashboardData);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (appointmentId) => {
        // Find appointment in next or upcoming
        let apt = dashboardData.next_appointment?.id === appointmentId ? dashboardData.next_appointment : null;
        if (!apt) {
            apt = dashboardData.upcoming_appointments.find(a => a.id === appointmentId);
        }

        if (apt) {
            setSelectedAppointment(apt);
            setCancelModalOpen(true);
        }
    };

    const confirmCancel = async () => {
        if (!selectedAppointment) return;
        setActionLoading(true);
        try {
            await appointmentService.cancel(selectedAppointment.id, cancelReason);
            setCancelModalOpen(false);
            setCancelReason('');
            setSelectedAppointment(null);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReschedule = (appointmentId) => {
        let apt = dashboardData.next_appointment?.id === appointmentId ? dashboardData.next_appointment : null;
        if (!apt) {
            apt = dashboardData.upcoming_appointments.find(a => a.id === appointmentId);
        }

        if (apt) {
            setSelectedAppointment(apt);
            setRescheduleModalOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const stats = dashboardData?.stats || {};
    const nextAppointment = dashboardData?.next_appointment;
    const upcomingAppointments = dashboardData?.upcoming_appointments || [];
    const recentActivity = dashboardData?.recent_activity || [];
    const recommendedProfessionals = dashboardData?.recommended_professionals || [];

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <WelcomeHeader
                    userName={user?.full_name?.split(' ')[0] || user?.name || 'there'}
                    subtitle="Your wellness journey continues. Here's what's happening today."
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* ... StatCards remain same ... */}
                    <StatCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        label="Total Appointments"
                        value={stats.total_appointments || 0}
                        change={stats.appointments_change}
                        changeType="positive"
                    />
                    <StatCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Upcoming"
                        value={stats.upcoming_appointments || 0}
                        link="/appointments"
                    />
                    <StatCard
                        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Total Spent"
                        value={formatPrice(stats.total_spent || 0)}
                    />
                    <StatCard
                        icon={<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>}
                        label="Favorites"
                        value={stats.favorites_count || 0}
                        link="/favorites"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Next Appointment with Handlers */}
                        <NextAppointment
                            appointment={nextAppointment}
                            onCancel={handleCancel}
                            onReschedule={handleReschedule}
                        />

                        {/* Upcoming Appointments */}
                        {/* ... (rest of the grid content) ... */}
                        <div className="bg-white dark:bg-earth-800 rounded-xl shadow-card p-6 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-earth-900 dark:text-white">Your Next Appointments</h3>
                                <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                                    View All →
                                </Link>
                            </div>

                            {upcomingAppointments.length === 0 ? (
                                <p className="text-earth-500 dark:text-earth-400 text-center py-8">No upcoming appointments</p>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center gap-4 p-4 bg-earth-50 dark:bg-earth-700 rounded-lg transition-colors">
                                            {/* ... appointment list item ... */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                                                {appointment.professional?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-earth-900 dark:text-white truncate">
                                                    {appointment.professional?.name}
                                                </p>
                                                <p className="text-sm text-earth-500 dark:text-earth-400">
                                                    {appointment.service?.name || 'Consultation'} • {appointment.duration || 60} min
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-earth-900 dark:text-white">
                                                    {new Date(appointment.scheduled_at || appointment.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-earth-500 dark:text-earth-400">
                                                    {new Date(appointment.scheduled_at || appointment.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                            <Link to={`/appointments/${appointment.id}`}>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recommended Professionals ... */}
                        {/* ... */}
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-8">
                        {/* Quick Actions & Timeline ... */}
                        <div className="bg-white dark:bg-earth-800 rounded-xl shadow-card p-6 transition-colors">
                            <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* ... quick action buttons ... */}
                                <Link to="/professionals">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">🔍</span>
                                        <span className="text-xs">Find Professional</span>
                                    </Button>
                                </Link>
                                <Link to="/appointments">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">📅</span>
                                        <span className="text-xs">Appointments</span>
                                    </Button>
                                </Link>
                                <Link to="/messages">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2 relative">
                                        <span className="text-2xl">💬</span>
                                        <span className="text-xs">Messages</span>
                                        {stats.unread_messages > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {stats.unread_messages}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link to="/favorites">
                                    <Button variant="ghost" className="w-full h-auto py-4 flex-col gap-2">
                                        <span className="text-2xl">⭐</span>
                                        <span className="text-xs">Favorites</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <ActivityTimeline activities={recentActivity} />
                    </div>
                </div>

                {/* Modals */}
                {/* Cancel Modal */}
                {cancelModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-earth-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 transition-colors">
                            <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Cancel Appointment</h3>
                            <p className="text-earth-600 dark:text-earth-300 mb-4">
                                Are you sure you want to cancel this appointment with{' '}
                                <strong className="text-earth-900 dark:text-white">{selectedAppointment?.professional?.name || selectedAppointment?.professional?.user?.full_name}</strong>?
                            </p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Reason for cancellation (optional)"
                                className="w-full border border-earth-200 dark:border-earth-600 rounded-lg p-3 mb-4 bg-white dark:bg-earth-700 text-earth-900 dark:text-white placeholder-earth-400 dark:placeholder-earth-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows={3}
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setCancelModalOpen(false);
                                        setCancelReason('');
                                        setSelectedAppointment(null);
                                    }}
                                    className="px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-700"
                                >
                                    Keep Appointment
                                </button>
                                <button
                                    onClick={confirmCancel}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reschedule Modal */}
                {rescheduleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-earth-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 transition-colors">
                            <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Reschedule Appointment</h3>
                            <p className="text-earth-600 dark:text-earth-300 mb-4">
                                Rescheduling appointment with{' '}
                                <strong className="text-earth-900 dark:text-white">{selectedAppointment?.professional?.name || selectedAppointment?.professional?.user?.full_name}</strong>
                            </p>
                            <p className="text-earth-500 dark:text-earth-400 text-sm mb-4">
                                To reschedule, please contact the professional directly or book a new time slot on their profile page.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setRescheduleModalOpen(false);
                                        setSelectedAppointment(null);
                                    }}
                                    className="px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-700"
                                >
                                    Close
                                </button>
                                <Link
                                    to={`/professionals/${selectedAppointment?.professional?.id}`}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    View Professional
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
