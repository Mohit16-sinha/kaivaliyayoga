import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui';

/**
 * Pending actions alert card for professional dashboard.
 */
const PendingActions = ({ actions = {} }) => {
    const items = [
        {
            id: 'bookings',
            label: 'New booking requests',
            count: actions.pending_bookings || 0,
            link: '/professional/appointments?tab=pending',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'text-yellow-600 bg-yellow-50',
            badgeVariant: 'warning',
        },
        {
            id: 'messages',
            label: 'Unread messages',
            count: actions.unread_messages || 0,
            link: '/professional/messages',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            color: 'text-blue-600 bg-blue-50',
            badgeVariant: 'info',
        },
        {
            id: 'reviews',
            label: 'Reviews needing response',
            count: actions.pending_reviews || 0,
            link: '/professional/reviews',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            color: 'text-purple-600 bg-purple-50',
            badgeVariant: 'default',
        },
    ];

    const activeItems = items.filter(item => item.count > 0);

    // Add verification alert if not verified
    if (actions.verification_incomplete) {
        activeItems.push({
            id: 'verification',
            label: 'Complete your verification',
            count: null,
            link: '/professional/verification-status',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            color: 'text-orange-600 bg-orange-50',
            badgeVariant: 'warning',
            isAlert: true,
        });
    }

    if (activeItems.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Pending Actions</h3>
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-earth-500">All caught up! No pending actions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-earth-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
                {activeItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.link}
                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-earth-50 transition-colors ${item.isAlert ? 'bg-orange-50 border border-orange-200' : ''
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-earth-900">{item.label}</p>
                        </div>
                        {item.count !== null && (
                            <Badge variant={item.badgeVariant}>{item.count}</Badge>
                        )}
                        <svg className="h-5 w-5 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PendingActions;
