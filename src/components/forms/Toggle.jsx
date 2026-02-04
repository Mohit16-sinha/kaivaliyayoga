import React from 'react';

/**
 * Toggle switch component.
 * @param {Object} props
 * @param {boolean} props.checked - Toggle state
 * @param {function} props.onChange - Change handler
 * @param {string} props.label - Toggle label
 * @param {string} props.description - Helper text
 */
const Toggle = ({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`flex items-start ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${checked ? 'bg-primary-500' : 'bg-earth-200'}
                `}
            >
                <span
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
            {(label || description) && (
                <div className="ml-3">
                    {label && (
                        <span className="text-sm font-medium text-earth-900">{label}</span>
                    )}
                    {description && (
                        <p className="text-sm text-earth-500">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Toggle;
