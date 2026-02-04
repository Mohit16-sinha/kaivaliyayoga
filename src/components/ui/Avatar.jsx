import React from 'react';

/**
 * Avatar component for user/professional images.
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for image
 * @param {string} props.name - Name for fallback initials
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Avatar size
 * @param {boolean} props.verified - Show verified badge
 */
const Avatar = ({
    src,
    alt,
    name = '',
    size = 'md',
    verified = false,
    className = '',
}) => {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-lg',
    };

    const verifiedSizes = {
        sm: 'h-3 w-3 -bottom-0.5 -right-0.5',
        md: 'h-4 w-4 -bottom-0.5 -right-0.5',
        lg: 'h-5 w-5 -bottom-1 -right-1',
        xl: 'h-6 w-6 -bottom-1 -right-1',
    };

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0][0]?.toUpperCase() || '?';
    };

    return (
        <div className={`relative inline-block ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
                />
            ) : (
                <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold ring-2 ring-white`}>
                    {getInitials(name)}
                </div>
            )}
            {verified && (
                <div className={`absolute ${verifiedSizes[size]} bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white`}>
                    <svg className="h-2/3 w-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Avatar;
