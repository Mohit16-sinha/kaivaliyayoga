import React from 'react';

/**
 * Enhanced Card component with soft shadows, hover lift, and optional gradient accent.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.action - Optional action element (button, link)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.noPadding - Remove default padding
 * @param {'default'|'gradient'|'outline'} props.variant - Card style variant
 * @param {boolean} props.hoverable - Enable hover lift effect
 */
const Card = ({
    children,
    title,
    subtitle,
    action,
    className = '',
    noPadding = false,
    variant = 'default',
    hoverable = true,
}) => {
    const variantStyles = {
        default: 'bg-white border border-earth-100',
        gradient: 'bg-gradient-to-br from-white to-earth-50 border border-earth-100',
        outline: 'bg-white border-2 border-earth-200',
    };

    return (
        <div
            className={`
                rounded-2xl shadow-soft overflow-hidden
                transition-all duration-300
                ${variantStyles[variant]}
                ${hoverable ? 'hover:shadow-xl hover:-translate-y-1' : ''}
                ${className}
            `}
        >
            {(title || action) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 bg-earth-50/50">
                    <div>
                        {title && (
                            <h3 className="text-lg font-semibold text-earth-900">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-earth-500 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
};

export default Card;
