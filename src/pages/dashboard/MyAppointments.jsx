import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppointmentCard } from '../../components/appointments';
import { Button, Tabs, Spinner, EmptyState } from '../../components/ui';
import appointmentService from '../../services/appointmentService';

/**
 * My Appointments page with tabs for upcoming, past, and cancelled appointments.
 */
const MyAppointments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [appointments, setAppointments] = useState({ upcoming: [], past: [], cancelled: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal states
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await appointmentService.getAll();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            // Fallback to empty if API fails
            setAppointments({ upcoming: [], past: [], cancelled: [] });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', count: appointments.upcoming.length },
        { id: 'past', label: 'Past', count: appointments.past.length },
        { id: 'cancelled', label: 'Cancelled', count: appointments.cancelled.length },
    ];

    const currentAppointments = appointments[activeTab] || [];

    const filteredAppointments = currentAppointments.filter(apt => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            apt.professional?.name?.toLowerCase().includes(query) ||
            apt.service?.name?.toLowerCase().includes(query)
        );
    });

    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.start_time || a.scheduled_at) - new Date(b.start_time || b.scheduled_at);
        }
        if (sortBy === 'professional') {
            return (a.professional?.name || '').localeCompare(b.professional?.name || '');
        }
        return 0;
    });

    const paginatedAppointments = sortedAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

    const handleCancel = (appointmentId) => {
        const apt = currentAppointments.find(a => a.id === appointmentId);
        setSelectedAppointment(apt);
        setCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!selectedAppointment) return;
        setActionLoading(true);
        try {
            await appointmentService.cancel(selectedAppointment.id, cancelReason);
            setCancelModalOpen(false);
            setCancelReason('');
            setSelectedAppointment(null);
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReschedule = (appointmentId) => {
        const apt = currentAppointments.find(a => a.id === appointmentId);
        setSelectedAppointment(apt);
        setRescheduleModalOpen(true);
    };

    const handleRebook = (appointment) => {
        // Navigate to professional page for rebooking
        window.location.href = `/professionals/${appointment.professional?.id}`;
    };

    const handleReview = (appointment) => {
        // Navigate to review page
        window.location.href = `/appointments/${appointment.id}/review`;
    };

    const EmptyStateContent = () => {
        if (activeTab === 'upcoming') {
            return (
                <EmptyState
                    icon={
                        <svg className="h-16 w-16 text-earth-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    title="No Upcoming Appointments"
                    description="You don't have any appointments scheduled. Find a professional and book your first session!"
                >
                    <Link to="/professionals">
                        <Button variant="primary">Find a Professional</Button>
                    </Link>
                </EmptyState>
            );
        }
        if (activeTab === 'past') {
            return (
                <EmptyState
                    icon={
                        <svg className="h-16 w-16 text-earth-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    title="No Past Appointments"
                    description="Your appointment history will appear here once you complete sessions."
                />
            );
        }
        return (
            <EmptyState
                icon={
                    <svg className="h-16 w-16 text-earth-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                }
                title="No Cancelled Appointments"
                description="You haven't cancelled any appointments."
            />
        );
    };

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 pb-12 transition-colors">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900 dark:text-white">My Appointments</h1>
                        <p className="text-earth-500 dark:text-earth-400 mt-1">Manage your wellness appointments</p>
                    </div>
                    <Link to="/professionals">
                        <Button variant="primary">
                            Book New Appointment
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-earth-800 rounded-xl shadow-card mb-6 transition-colors">
                    <div className="border-b border-earth-100 dark:border-earth-700">
                        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    </div>

                    {/* Filters */}
                    <div className="p-4 border-b border-earth-100 dark:border-earth-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-sm bg-white dark:bg-earth-700 text-earth-900 dark:text-white placeholder-earth-400 dark:placeholder-earth-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-sm bg-white dark:bg-earth-700 text-earth-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="professional">Sort by Professional</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : paginatedAppointments.length === 0 ? (
                    <EmptyStateContent />
                ) : (
                    <div className="space-y-4">
                        {paginatedAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                variant={activeTab}
                                onCancel={() => handleCancel(appointment.id)}
                                onReschedule={() => handleReschedule(appointment.id)}
                                onRebook={() => handleRebook(appointment)}
                                onReview={() => handleReview(appointment)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-sm font-medium text-earth-700 dark:text-earth-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50 dark:hover:bg-earth-700"
                        >
                            ← Previous
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === i + 1
                                    ? 'bg-primary-600 text-white'
                                    : 'border border-earth-200 dark:border-earth-600 text-earth-700 dark:text-earth-200 hover:bg-earth-50 dark:hover:bg-earth-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-sm font-medium text-earth-700 dark:text-earth-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50 dark:hover:bg-earth-700"
                        >
                            Next →
                        </button>
                    </div>
                )}

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
                                className="w-full bg-white dark:bg-earth-700 text-earth-900 dark:text-white border border-earth-200 dark:border-earth-600 rounded-lg p-3 mb-4 placeholder-earth-400 dark:placeholder-earth-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

                {/* Reschedule Modal - Placeholder */}
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

export default MyAppointments;

