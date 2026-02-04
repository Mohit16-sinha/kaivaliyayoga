import React from 'react';

/**
 * Badge component for status indicators.
 * @param {Object} props
 * @param {'success'|'warning'|'error'|'info'|'default'|'yoga'|'doctor'|'nutrition'|'psychology'} props.variant
 * @param {'sm'|'md'} props.size
 * @param {React.ReactNode} props.children
 */
const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
}) => {
    const variants = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-earth-100 text-earth-700',
        // Professional category colors
        yoga: 'bg-purple-100 text-purple-800',
        doctor: 'bg-blue-100 text-blue-800',
        nutrition: 'bg-green-100 text-green-800',
        psychology: 'bg-teal-100 text-teal-800',
        nurse: 'bg-pink-100 text-pink-800',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
