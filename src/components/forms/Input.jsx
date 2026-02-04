import React, { forwardRef } from 'react';

/**
 * Input component with label, error state, and icon support.
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {React.ReactNode} props.icon - Left icon
 * @param {string} props.placeholder - Placeholder text
 */
const Input = forwardRef(({
    label,
    error,
    type = 'text',
    icon,
    className = '',
    required = false,
    ...props
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-earth-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
                        block w-full rounded-lg border transition-colors duration-200
                        ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
                        ${error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-earth-300 text-earth-900 placeholder-earth-400 focus:ring-primary-500 focus:border-primary-500'
                        }
                        focus:outline-none focus:ring-2 focus:ring-opacity-50
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
