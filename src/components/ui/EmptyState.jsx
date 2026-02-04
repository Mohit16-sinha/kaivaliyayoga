import React from 'react';
import Button from './Button';

/**
 * Enhanced Empty state with friendly illustrations, warm colors, and encouraging copy.
 * @param {Object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Description text
 * @param {React.ReactNode} props.icon - Custom icon or emoji
 * @param {React.ReactNode} props.action - Action button/link
 * @param {'default'|'appointments'|'messages'|'favorites'|'search'|'error'} props.variant
 */
const EmptyState = ({
    title,
    description,
    icon,
    action,
    actionText,
    onAction,
    variant = 'default',
    className = '',
}) => {
    // Variant configurations with friendly messages and icons
    const variants = {
        default: {
            icon: '📭',
            title: 'Nothing here yet',
            description: 'Content will appear here once you get started.',
            gradient: 'from-earth-50 to-earth-100',
        },
        appointments: {
            icon: '📅',
            title: 'No appointments scheduled',
            description: "You don't have any upcoming appointments. Book a session with a wellness professional to get started!",
            gradient: 'from-primary-50 to-secondary-50',
            actionText: 'Find a Professional',
        },
        messages: {
            icon: '💬',
            title: 'Your inbox is empty',
            description: 'Messages from professionals will appear here. Start a conversation after booking a session!',
            gradient: 'from-blue-50 to-indigo-50',
        },
        favorites: {
            icon: '⭐',
            title: 'No favorites yet',
            description: 'Save your favorite professionals here for quick access. Tap the heart icon on any profile to add them!',
            gradient: 'from-amber-50 to-orange-50',
            actionText: 'Browse Professionals',
        },
        search: {
            icon: '🔍',
            title: 'No results found',
            description: "We couldn't find what you're looking for. Try adjusting your search terms or filters.",
            gradient: 'from-purple-50 to-pink-50',
            actionText: 'Clear Filters',
        },
        error: {
            icon: '😅',
            title: 'Oops! Something went wrong',
            description: "Don't worry, it's not you. Please try again or contact support if the problem persists.",
            gradient: 'from-red-50 to-orange-50',
            actionText: 'Try Again',
        },
        noReviews: {
            icon: '💭',
            title: 'No reviews yet',
            description: 'Be the first to share your experience with this professional!',
            gradient: 'from-teal-50 to-cyan-50',
        },
        noProfessionals: {
            icon: '👨‍⚕️',
            title: 'No professionals available',
            description: 'No professionals match your current filters. Try broadening your search.',
            gradient: 'from-green-50 to-emerald-50',
            actionText: 'Reset Filters',
        },
    };

    const config = variants[variant] || variants.default;
    const displayIcon = icon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;
    const displayActionText = actionText || config.actionText;

    return (
        <div
            className={`
                flex flex-col items-center justify-center 
                py-12 px-6 text-center 
                rounded-2xl
                bg-gradient-to-br ${config.gradient}
                ${className}
            `}
        >
            {/* Animated icon container */}
            <div className="relative mb-6">
                {/* Background glow */}
                <div className="absolute inset-0 bg-white/50 rounded-full blur-xl scale-150" />

                {/* Icon */}
                <div className="relative text-6xl animate-bounce-slow">
                    {displayIcon}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-earth-900 mb-2">
                {displayTitle}
            </h3>

            {/* Description */}
            <p className="text-earth-600 text-sm max-w-md mb-6 leading-relaxed">
                {displayDescription}
            </p>

            {/* Action button */}
            {(action || onAction) && (
                <div className="space-x-3">
                    {action || (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={onAction}
                        >
                            {displayActionText || 'Get Started'}
                        </Button>
                    )}
                </div>
            )}

            {/* Decorative dots */}
            <div className="flex items-center gap-2 mt-8 opacity-30">
                <div className="w-2 h-2 rounded-full bg-earth-400" />
                <div className="w-2 h-2 rounded-full bg-earth-300" />
                <div className="w-2 h-2 rounded-full bg-earth-200" />
            </div>
        </div>
    );
};

export default EmptyState;
