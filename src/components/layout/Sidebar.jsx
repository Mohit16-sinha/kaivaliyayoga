import React from 'react';
import { NavLink } from 'react-router-dom';

// Import background image for client sidebar
import SidebarBg from '../../assets/img/cards/jeremy-bishop-EwKXn5CapA4-unsplash.jpg';

const Sidebar = ({ userType = 'client' }) => {
    // Define menu items based on role
    const getMenuItems = () => {
        if (userType === 'admin') {
            return [
                { label: 'Overview', path: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { label: 'Verification', path: '/admin/verification-requests', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Professionals', path: '/admin/professionals', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { label: 'Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                { label: 'Appointments', path: '/admin/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Payments', path: '/admin/payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                { label: 'Reviews', path: '/admin/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                { label: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            ];
        } else if (userType === 'professional') {
            return [
                { label: 'Dashboard', path: '/professional-dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { label: 'Schedule', path: '/professional/schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Appointments', path: '/professional/appointments', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            ];
        } else {
            // Client - simplified menu
            return [
                { label: 'Overview', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { label: 'My Bookings', path: '/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ];
        }
    };

    const items = getMenuItems();
    const isClient = userType === 'client';

    return (
        <aside className="w-64 border-r border-earth-200 h-full fixed left-0 top-16 hidden md:block overflow-y-auto">
            {/* Background Image for Client Sidebar */}
            {isClient && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${SidebarBg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
                </>
            )}

            {/* Content */}
            <div className={`relative z-10 h-full flex flex-col ${isClient ? '' : 'bg-white'}`}>
                {isClient && (
                    <div className="px-4 py-6">
                        <h3 className="text-white font-semibold text-xl mb-1">🧘 Welcome</h3>
                        <p className="text-white/70 text-sm">Your wellness journey</p>
                    </div>
                )}

                <nav className="space-y-2 px-3 flex-grow">
                    {items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isClient
                                    ? `group flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all ${isActive
                                        ? 'bg-white/30 backdrop-blur-sm text-white shadow-lg'
                                        : 'text-white/90 hover:bg-white/20 hover:backdrop-blur-sm'
                                    }`
                                    : `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-earth-700 hover:bg-earth-50 hover:text-earth-900'
                                    }`
                            }
                        >
                            <svg
                                className={`mr-3 flex-shrink-0 h-6 w-6 ${isClient ? 'text-white' : 'text-earth-400 group-hover:text-earth-500'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Daily Tip - positioned at bottom */}
                {isClient && (
                    <div className="px-3 pb-6 mt-auto">
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-white font-medium text-sm mb-1">✨ Daily Tip</p>
                            <p className="text-white/80 text-xs leading-relaxed">
                                Take a moment to breathe deeply. Wellness starts with mindfulness.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
