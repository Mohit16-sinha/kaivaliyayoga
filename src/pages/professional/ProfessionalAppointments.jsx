import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Tabs, Badge, Avatar, Spinner, EmptyState } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';
import SessionNotesModal from '../../components/professional/SessionNotesModal';

/**
 * Professional Appointments page with tabs for upcoming, pending, past, cancelled.
 */
const ProfessionalAppointments = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [appointments, setAppointments] = useState({ upcoming: [], pending: [], past: [], cancelled: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const activeTab = searchParams.get('tab') || 'upcoming';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAppointments(mockAppointments);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', count: appointments.upcoming.length },
        { id: 'pending', label: 'Pending', count: appointments.pending.length },
        { id: 'past', label: 'Past', count: appointments.past.length },
        { id: 'cancelled', label: 'Cancelled', count: appointments.cancelled.length },
    ];

    const currentAppointments = appointments[activeTab] || [];

    const filteredAppointments = currentAppointments.filter(apt => {
        if (!searchQuery) return true;
        return apt.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isJoinable = (scheduledAt) => {
        const date = new Date(scheduledAt);
        const now = new Date();
        const diffMs = date - now;
        const diffMinutes = diffMs / (1000 * 60);
        return diffMinutes <= 15 && diffMinutes >= -30;
    };

    const handleConfirmBooking = async (appointmentId) => {
        console.log('Confirm booking:', appointmentId);
        // TODO: API call
    };

    const handleDeclineBooking = async (appointmentId) => {
        console.log('Decline booking:', appointmentId);
        // TODO: Show decline modal
    };

    const handleSaveNotes = async (notes) => {
        console.log('Save notes for:', selectedAppointment?.id, notes);
        // TODO: API call
    };

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'success',
            pending: 'warning',
            completed: 'success',
            cancelled: 'danger',
            no_show: 'warning',
        };
        const labels = {
            confirmed: 'Confirmed',
            pending: 'Pending',
            completed: 'Completed',
            cancelled: 'Cancelled',
            no_show: 'No Show',
        };
        return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
    };

    const AppointmentCard = ({ appointment }) => {
        const isPending = activeTab === 'pending';
        const isPast = activeTab === 'past';
        const isCancelled = activeTab === 'cancelled';

        return (
            <div className={`bg-white rounded-xl shadow-card p-6 ${isPending ? 'border-l-4 border-yellow-400' : ''}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Date/Time Badge */}
                    <div className={`flex-shrink-0 text-center p-4 rounded-xl ${isPending ? 'bg-yellow-50' : isPast ? 'bg-earth-100' : 'bg-primary-50'
                        }`}>
                        <p className="text-sm text-earth-500">{formatDate(appointment.scheduled_at)}</p>
                        <p className="text-lg font-bold text-earth-900">{formatTime(appointment.scheduled_at)}</p>
                        <p className="text-xs text-earth-400">{appointment.duration} min</p>
                    </div>

                    {/* Client Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <Avatar
                                src={appointment.client?.profile_image_url}
                                name={appointment.client?.name}
                                size="md"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-earth-900">{appointment.client?.name}</p>
                                    {appointment.is_first_session && (
                                        <Badge variant="info" size="sm">New Client</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-earth-500">{appointment.service?.name}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-earth-600 mb-3">
                            <span className="flex items-center gap-1">
                                {appointment.location_type === 'online' ? '📹 Online' : '📍 In-person'}
                            </span>
                            {getStatusBadge(appointment.status)}
                        </div>

                        {appointment.reason && (
                            <p className="text-sm text-earth-600 bg-earth-50 rounded-lg p-3 line-clamp-2">
                                <strong>Reason:</strong> {appointment.reason}
                            </p>
                        )}

                        {isPending && appointment.booked_at && (
                            <p className="text-xs text-yellow-600 mt-2">
                                Requested {new Date(appointment.booked_at).toLocaleDateString()}
                            </p>
                        )}

                        {isCancelled && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-700">
                                    <strong>Cancelled by:</strong> {appointment.cancelled_by}
                                </p>
                                {appointment.cancellation_reason && (
                                    <p className="text-sm text-red-600 mt-1">
                                        <strong>Reason:</strong> {appointment.cancellation_reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-2 sm:items-end">
                        {activeTab === 'upcoming' && (
                            <>
                                {isJoinable(appointment.scheduled_at) && (
                                    <Button variant="primary" size="sm">Join Meeting</Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setSelectedAppointment(appointment); setShowDetailsModal(true); }}
                                >
                                    View Details
                                </Button>
                                <Button variant="ghost" size="sm">Message Client</Button>
                            </>
                        )}

                        {isPending && (
                            <>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConfirmBooking(appointment.id)}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() => handleDeclineBooking(appointment.id)}
                                >
                                    Decline
                                </Button>
                            </>
                        )}

                        {isPast && (
                            <>
                                {!appointment.has_notes ? (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => { setSelectedAppointment(appointment); setShowNotesModal(true); }}
                                    >
                                        Add Notes
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setSelectedAppointment(appointment); setShowNotesModal(true); }}
                                    >
                                        View Notes
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm">Rebook Client</Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setSelectedAppointment(appointment); setShowDetailsModal(true); }}
                                >
                                    View Details
                                </Button>
                            </>
                        )}

                        {isCancelled && (
                            <Button variant="ghost" size="sm">Rebook Client</Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const EmptyStateContent = () => {
        const messages = {
            upcoming: {
                title: 'No Upcoming Appointments',
                desc: 'Your schedule is clear. New bookings will appear here.',
                action: <Link to="/professional/availability"><Button variant="primary">Update Availability</Button></Link>,
            },
            pending: {
                title: 'No Pending Requests',
                desc: 'All booking requests have been handled. Great job!',
            },
            past: {
                title: 'No Past Appointments',
                desc: 'Your appointment history will appear here.',
            },
            cancelled: {
                title: 'No Cancelled Appointments',
                desc: 'No appointments have been cancelled.',
            },
        };
        const msg = messages[activeTab];
        return (
            <EmptyState title={msg.title} description={msg.desc}>
                {msg.action}
            </EmptyState>
        );
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Appointments</h1>
                        <p className="text-earth-500 mt-1">Manage your client appointments</p>
                    </div>
                    <Link to="/professional/schedule">
                        <Button variant="ghost">
                            📅 Calendar View
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-card mb-6">
                    <div className="border-b border-earth-100">
                        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    </div>

                    {/* Filters */}
                    <div className="p-4 border-b border-earth-100">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by client name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="client">Sort by Client</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <EmptyStateContent />
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                    </div>
                )}
            </div>

            {/* Session Notes Modal */}
            <SessionNotesModal
                isOpen={showNotesModal}
                onClose={() => { setShowNotesModal(false); setSelectedAppointment(null); }}
                appointment={selectedAppointment}
                existingNotes={selectedAppointment?.session_notes}
                onSave={handleSaveNotes}
            />
        </div>
    );
};

// Mock data
const mockAppointments = {
    upcoming: [
        {
            id: 1,
            scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            status: 'confirmed',
            location_type: 'online',
            client: { name: 'John Smith', email: 'john@example.com' },
            service: { name: '1-on-1 Yoga Therapy' },
            reason: 'Looking for help with chronic back pain and stress management.',
            is_first_session: true,
        },
        {
            id: 2,
            scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 45,
            status: 'confirmed',
            location_type: 'online',
            client: { name: 'Sarah Johnson' },
            service: { name: 'Nutrition Consultation' },
            is_first_session: false,
        },
    ],
    pending: [
        {
            id: 3,
            scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            status: 'pending',
            location_type: 'online',
            client: { name: 'Michael Brown' },
            service: { name: 'Stress Management' },
            reason: 'Work-related stress and anxiety',
            booked_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            is_first_session: true,
        },
    ],
    past: [
        {
            id: 4,
            scheduled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            status: 'completed',
            location_type: 'online',
            client: { name: 'Emily Davis' },
            service: { name: '1-on-1 Yoga Therapy' },
            has_notes: false,
        },
        {
            id: 5,
            scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 45,
            status: 'completed',
            location_type: 'online',
            client: { name: 'David Wilson' },
            service: { name: 'Follow-up Session' },
            has_notes: true,
            session_notes: { summary: 'Good progress on flexibility exercises.', recommendations: 'Continue daily stretching routine.' },
        },
    ],
    cancelled: [
        {
            id: 6,
            scheduled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            status: 'cancelled',
            location_type: 'online',
            client: { name: 'Lisa Anderson' },
            service: { name: 'Initial Consultation' },
            cancelled_by: 'Client',
            cancellation_reason: 'Schedule conflict',
        },
    ],
};

export default ProfessionalAppointments;
