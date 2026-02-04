import React, { useState } from 'react';

/**
 * Enhanced Button component with gradients, ripple effects, and beautiful interactions.
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'link'|'accent'|'gradient'} props.variant
 * @param {'sm'|'md'|'lg'|'xl'} props.size
 * @param {boolean} props.disabled
 * @param {boolean} props.loading
 * @param {React.ReactNode} props.icon - Optional icon to show before text
 * @param {React.ReactNode} props.iconRight - Optional icon to show after text
 * @param {boolean} props.fullWidth
 * @param {string} props.className
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 });

    // Handle ripple effect on click
    const handleClick = (e) => {
        if (disabled || loading) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRipple({ active: true, x, y });
        setTimeout(() => setRipple({ active: false, x: 0, y: 0 }), 600);

        onClick?.(e);
    };

    const baseStyles = `
        relative overflow-hidden
        inline-flex items-center justify-center gap-2
        font-semibold rounded-full
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        active:scale-[0.98]
    `;

    const variants = {
        primary: `
            bg-gradient-to-r from-primary-500 to-primary-600
            text-white
            hover:from-primary-600 hover:to-primary-700
            hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5
            focus:ring-primary-500
        `,
        secondary: `
            bg-gradient-to-r from-secondary-500 to-secondary-600
            text-white
            hover:from-secondary-600 hover:to-secondary-700
            hover:shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5
            focus:ring-secondary-500
        `,
        danger: `
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            hover:from-red-600 hover:to-red-700
            hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5
            focus:ring-red-500
        `,
        accent: `
            bg-gradient-to-r from-accent-500 to-accent-600
            text-white
            hover:from-accent-600 hover:to-accent-700
            hover:shadow-lg hover:shadow-accent-500/30 hover:-translate-y-0.5
            focus:ring-accent-500
        `,
        gradient: `
            bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500
            bg-[length:200%_100%]
            text-white
            hover:bg-[position:100%_0%]
            hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5
            focus:ring-purple-500
            animate-gradient-shift
        `,
        ghost: `
            bg-transparent
            text-earth-700 dark:text-earth-200
            hover:bg-earth-100 dark:hover:bg-earth-700 hover:text-earth-900 dark:hover:text-white
            focus:ring-earth-500
            border border-earth-200 dark:border-earth-600 hover:border-earth-300 dark:hover:border-earth-500
        `,
        link: `
            bg-transparent
            text-primary-600
            hover:text-primary-700 hover:underline
            focus:ring-primary-500
            p-0 shadow-none
        `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
    };

    // Loading spinner
    const LoadingSpinner = () => (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `.replace(/\s+/g, ' ').trim()}
            {...props}
        >
            {/* Ripple effect */}
            {ripple.active && (
                <span
                    className="absolute bg-white/30 rounded-full animate-ping"
                    style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                        animation: 'ripple 0.6s linear',
                    }}
                />
            )}

            {/* Shine effect overlay */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </span>

            {/* Content */}
            <span className="relative flex items-center gap-2">
                {loading ? <LoadingSpinner /> : icon}
                {loading ? 'Loading...' : children}
                {!loading && iconRight}
            </span>
        </button>
    );
};

// Add ripple keyframes style
const style = document.createElement('style');
style.textContent = `
@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(15); opacity: 0; }
}
`;
if (typeof document !== 'undefined' && !document.querySelector('#ripple-styles')) {
    style.id = 'ripple-styles';
    document.head.appendChild(style);
}

export default Button;
