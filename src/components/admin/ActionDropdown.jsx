import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown menu for row actions.
 */
const ActionDropdown = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-earth-100 rounded-lg">
                {trigger || (
                    <svg className="h-5 w-5 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-earth-100 py-1 z-50">
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { onClick: () => { child.props.onClick?.(); setIsOpen(false); } })
                    )}
                </div>
            )}
        </div>
    );
};

export const ActionItem = ({ icon, children, onClick, variant = 'default' }) => {
    const variants = {
        default: 'text-earth-700 hover:bg-earth-50',
        danger: 'text-red-600 hover:bg-red-50',
    };
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${variants[variant]}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

export default ActionDropdown;
