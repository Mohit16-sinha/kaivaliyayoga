import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Avatar } from '../ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Next Appointment card highlighting the user's upcoming appointment.
 */
const NextAppointment = ({ appointment, onCancel, onReschedule }) => {
    const { formatPrice } = useCurrency();

    if (!appointment) {
        return (
            <div className="bg-white rounded-xl border-2 border-dashed border-earth-200 p-6 text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-earth-900 mb-2">No Upcoming Appointments</h3>
                <p className="text-earth-500 mb-4">You don't have any appointments scheduled.</p>
                <Link to="/professionals">
                    <Button variant="primary">Find a Professional</Button>
                </Link>
            </div>
        );
    }

    const formatRelativeTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = date - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 0) return 'Started';
        if (diffHours < 1) return `In ${Math.floor(diffMs / (1000 * 60))} minutes`;
        if (diffHours < 24) return `In ${diffHours} hours`;
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isJoinable = () => {
        const date = new Date(appointment.scheduled_at || appointment.start_time);
        const now = new Date();
        const diffMs = date - now;
        const diffMinutes = diffMs / (1000 * 60);
        return diffMinutes <= 15 && diffMinutes >= -30;
    };

    const handleAddToCalendar = () => {
        const title = encodeURIComponent(`Appointment with ${appointment.professional?.name}`);
        const details = encodeURIComponent(`Service: ${appointment.service?.name}\nLink: ${appointment.meeting_link}`);
        const dateStr = appointment.scheduled_at || appointment.start_time;
        const start = new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(new Date(dateStr).getTime() + (appointment.duration || 60) * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");

        const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
        window.open(googleUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-xl border-2 border-primary-200 shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-primary-50 px-6 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700">Next Appointment</span>
                <Badge variant="success">{formatRelativeTime(appointment.scheduled_at || appointment.start_time)}</Badge>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Professional Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <Avatar
                            src={appointment.professional?.profile_image_url}
                            name={appointment.professional?.name}
                            size="lg"
                            verified={appointment.professional?.is_verified}
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-earth-900">
                                {appointment.professional?.name || 'Professional'}
                            </h3>
                            <p className="text-earth-500 mb-2">
                                {appointment.service?.name || appointment.service_name || 'Consultation'}
                            </p>
                            <div className="space-y-1 text-sm text-earth-600">
                                <p className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDateTime(appointment.scheduled_at || appointment.start_time)}
                                </p>
                                <p className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {appointment.duration || 60} minutes
                                </p>
                                <p className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {appointment.location_type === 'online' ? 'Online (Video Call)' : appointment.location || 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                        {isJoinable() && (
                            <Button variant="primary" size="lg" className="w-full">
                                Join Meeting
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="w-full" onClick={handleAddToCalendar}>
                            Add to Calendar
                        </Button>
                        <Link to={`/appointments/${appointment.id}`} className="block">
                            <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-1 text-earth-500" onClick={() => onReschedule && onReschedule(appointment.id)}>
                                Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 text-red-500" onClick={() => onCancel && onCancel(appointment.id)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NextAppointment;
