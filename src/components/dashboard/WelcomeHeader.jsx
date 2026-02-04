import React from 'react';

// Import background image
import WelcomeBg from '../../assets/img/cards/nathan-dumlao-pLoMDKtl-JY-unsplash.jpg';

/**
 * Enhanced Welcome header with time-based greeting, icons, and subtle animations.
 */
const WelcomeHeader = ({ userName, subtitle }) => {
    const getTimeBasedContent = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return {
                greeting: 'Good morning',
                icon: '🌅',
                accentColor: 'text-amber-100', // Adjusted for dark overlay
                message: 'Start your day with mindfulness and positive energy.',
            };
        } else if (hour >= 12 && hour < 17) {
            return {
                greeting: 'Good afternoon',
                icon: '☀️',
                accentColor: 'text-sky-100', // Adjusted for dark overlay
                message: 'Keep your wellness momentum going strong.',
            };
        } else if (hour >= 17 && hour < 21) {
            return {
                greeting: 'Good evening',
                icon: '🌇',
                accentColor: 'text-purple-100', // Adjusted for dark overlay
                message: 'Wind down and reflect on your wellness journey.',
            };
        } else {
            return {
                greeting: 'Good night',
                icon: '🌙',
                accentColor: 'text-indigo-100', // Adjusted for dark overlay
                message: 'Rest well for a refreshed tomorrow.',
            };
        }
    };

    const timeContent = getTimeBasedContent();

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-8 shadow-lg animate-fade-in group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${WelcomeBg})` }}
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
                <div className="flex-1">
                    {/* Date */}
                    <p className="text-sm text-white/70 mb-1 font-medium tracking-wide uppercase">{dateString}</p>

                    {/* Greeting with animated icon */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-3xl animate-bounce-slow">{timeContent.icon}</span>
                        <span>
                            {timeContent.greeting}, <span className={timeContent.accentColor}>{userName || 'there'}</span>!
                        </span>
                    </h1>

                    {/* Subtitle/message */}
                    <p className="text-white/90 max-w-lg text-lg">
                        {subtitle || timeContent.message}
                    </p>
                </div>

                {/* Optional stats/badges area */}
                <div className="flex items-center gap-3">
                    {/* Quick wellness tip */}
                    <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm hover:bg-white/30 transition-colors cursor-default">
                        <span className="text-lg">💡</span>
                        <span className="text-white font-medium">Daily Tip</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHeader;
