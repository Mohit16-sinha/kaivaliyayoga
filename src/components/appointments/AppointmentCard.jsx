import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Avatar, Button } from '../ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Appointment Card component for displaying appointment information.
 * @param {Object} props
 * @param {Object} props.appointment - Appointment data
 * @param {string} props.variant - 'upcoming' | 'past' | 'cancelled'
 * @param {function} props.onJoin - Join meeting callback
 * @param {function} props.onCancel - Cancel callback
 * @param {function} props.onReschedule - Reschedule callback
 */
const AppointmentCard = ({
    appointment,
    variant = 'upcoming',
    onJoin,
    onCancel,
    onReschedule,
    onRebook,
    onReview,
    className = '',
}) => {
    const { formatPrice } = useCurrency();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getEndTime = (dateStr, durationMinutes) => {
        const date = new Date(dateStr);
        date.setMinutes(date.getMinutes() + (durationMinutes || 60));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isJoinable = () => {
        if (variant !== 'upcoming') return false;
        const date = new Date(appointment.scheduled_at);
        const now = new Date();
        const diffMs = date - now;
        const diffMinutes = diffMs / (1000 * 60);
        return diffMinutes <= 15 && diffMinutes >= -30;
    };

    const getStatusBadge = () => {
        if (variant === 'cancelled') {
            return <Badge variant="danger">Cancelled</Badge>;
        }
        if (variant === 'past') {
            if (appointment.status === 'completed') {
                return <Badge variant="success">Completed ✓</Badge>;
            }
            if (appointment.status === 'no_show') {
                return <Badge variant="warning">No Show ⚠️</Badge>;
            }
            return <Badge variant="default">Past</Badge>;
        }
        return <Badge variant="success">Confirmed ✓</Badge>;
    };

    const handleAddToCalendar = () => {
        const title = encodeURIComponent(`Appointment with ${appointment.professional?.name}`);
        const details = encodeURIComponent(`Service: ${appointment.service?.name}\nLocation: ${appointment.location_type === 'online' ? 'Online' : appointment.location}`);
        // Create dates in format YYYYMMDDTHHMMSSZ
        const start = new Date(appointment.scheduled_at).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(new Date(appointment.scheduled_at).getTime() + (appointment.duration || 60) * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");

        const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
        window.open(googleUrl, '_blank');
    };

    const handleContactSupport = () => {
        window.location.href = '/contact';
    };

    return (
        <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden ${className}`}>
            <div className="p-6">
                {/* Professional Info */}
                <div className="flex items-start gap-4 mb-4">
                    <Avatar
                        src={appointment.professional?.profile_image_url}
                        name={appointment.professional?.name}
                        size="lg"
                        verified={appointment.professional?.is_verified}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-lg font-semibold text-earth-900">
                                    {appointment.professional?.name || 'Professional'}
                                </h3>
                                <p className="text-sm text-earth-500">
                                    {appointment.professional?.specialization || 'Wellness Professional'}
                                </p>
                            </div>
                            {getStatusBadge()}
                        </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-3 text-earth-600">
                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(appointment.scheduled_at || appointment.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(appointment.scheduled_at || appointment.start_time)} - {getEndTime(appointment.scheduled_at || appointment.start_time, appointment.duration)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{appointment.duration || 60} minutes</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{appointment.location_type === 'online' ? '📹 Online (Video Call)' : appointment.location || 'Online'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatPrice(appointment.total_price || appointment.price || 89)}</span>
                    </div>
                </div>

                {/* Cancelled Info */}
                {variant === 'cancelled' && appointment.cancellation_reason && (
                    <div className="bg-red-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-700">
                            <strong>Reason:</strong> {appointment.cancellation_reason}
                        </p>
                        {appointment.refund_status && (
                            <p className="text-sm text-red-600 mt-1">
                                <strong>Refund:</strong> {appointment.refund_status}
                            </p>
                        )}
                        <Button variant="ghost" size="sm" className="mt-2 text-red-600 w-full justify-start" onClick={handleContactSupport}>
                            Contact Support
                        </Button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-earth-100">
                    {variant === 'upcoming' && (
                        <>
                            {isJoinable() && (
                                <Button variant="primary" size="sm" onClick={onJoin}>
                                    Join Meeting
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={handleAddToCalendar}>
                                Add to Calendar
                            </Button>
                            <Link to={`/appointments/${appointment.id}`}>
                                <Button variant="ghost" size="sm">Details</Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-earth-500" onClick={onReschedule}>
                                Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={onCancel}>
                                Cancel
                            </Button>
                        </>
                    )}

                    {variant === 'past' && (
                        <>
                            {!appointment.has_review && (
                                <Button variant="primary" size="sm" onClick={onReview}>
                                    Leave Review
                                </Button>
                            )}
                            <Link to={`/appointments/${appointment.id}`}>
                                <Button variant="ghost" size="sm">View Details</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={onRebook}>
                                Rebook
                            </Button>
                            <Button variant="ghost" size="sm">
                                Download Receipt
                            </Button>
                        </>
                    )}

                    {variant === 'cancelled' && (
                        <>
                            <Button variant="primary" size="sm" onClick={onRebook}>
                                Rebook
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleContactSupport}>
                                Help
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
