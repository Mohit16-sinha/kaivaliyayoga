import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button } from '../ui';

/**
 * Today's schedule timeline for professional dashboard.
 */
const TodaySchedule = ({ appointments = [], onViewDetails, onJoinMeeting }) => {
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

    const getCurrentTimePosition = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        // Position relative to 8 AM - 8 PM (12 hour range)
        const startHour = 8;
        const endHour = 20;
        const totalMinutes = (hours - startHour) * 60 + minutes;
        const totalRange = (endHour - startHour) * 60;
        return Math.max(0, Math.min(100, (totalMinutes / totalRange) * 100));
    };

    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-earth-900">Today's Schedule</h3>
                    <Link to="/professional/schedule" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View Calendar →
                    </Link>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-earth-500 mb-2">No appointments today</p>
                    <p className="text-sm text-earth-400">Enjoy your free day!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-earth-900">Today's Schedule</h3>
                    <p className="text-sm text-earth-500">{appointments.length} appointment{appointments.length > 1 ? 's' : ''} today</p>
                </div>
                <Link to="/professional/schedule" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View Calendar →
                </Link>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Current time indicator */}
                <div
                    className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                    style={{ top: `${getCurrentTimePosition()}%` }}
                >
                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                </div>

                <div className="space-y-4">
                    {appointments.map((apt, index) => (
                        <div
                            key={apt.id}
                            className={`flex gap-4 p-4 rounded-lg border ${isJoinable(apt.scheduled_at)
                                    ? 'border-primary-200 bg-primary-50'
                                    : 'border-earth-100 bg-earth-50'
                                }`}
                        >
                            {/* Time */}
                            <div className="flex-shrink-0 text-center">
                                <p className="text-lg font-bold text-earth-900">{formatTime(apt.scheduled_at)}</p>
                                <p className="text-xs text-earth-500">{apt.duration} min</p>
                            </div>

                            {/* Divider */}
                            <div className="w-px bg-earth-200 self-stretch" />

                            {/* Client Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <Avatar
                                        src={apt.client?.profile_image_url}
                                        name={apt.client?.name}
                                        size="sm"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-medium text-earth-900 truncate">{apt.client?.name}</p>
                                        <p className="text-sm text-earth-500">{apt.service?.name}</p>
                                    </div>
                                    {apt.is_first_session && (
                                        <Badge variant="info" size="sm">First Session</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex items-center gap-2">
                                {isJoinable(apt.scheduled_at) && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onJoinMeeting?.(apt)}
                                    >
                                        Join Meeting
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onViewDetails?.(apt)}
                                >
                                    Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodaySchedule;
