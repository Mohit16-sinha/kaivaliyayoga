import React, { forwardRef } from 'react';

/**
 * TextArea component for multi-line input.
 * @param {Object} props
 * @param {string} props.label - TextArea label
 * @param {string} props.error - Error message
 * @param {number} props.rows - Number of rows
 */
const TextArea = forwardRef(({
    label,
    error,
    rows = 4,
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
            <textarea
                ref={ref}
                rows={rows}
                className={`
                    block w-full rounded-lg border transition-colors duration-200
                    px-4 py-2.5 resize-none
                    ${error
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-earth-300 text-earth-900 placeholder-earth-400 focus:ring-primary-500 focus:border-primary-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;
