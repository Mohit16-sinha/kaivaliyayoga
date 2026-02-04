import React from 'react';

/**
 * Tab navigation component.
 * @param {Object} props
 * @param {Array<{id: string, label: string, count?: number}>} props.tabs - Tab items
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.onChange - Tab change handler
 */
const Tabs = ({
    tabs,
    activeTab,
    onChange,
    className = '',
}) => {
    return (
        <div className={`border-b border-earth-200 ${className}`}>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === tab.id
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300'
                            }
                        `}
                    >
                        {tab.icon && (
                            <span className="mr-2">{tab.icon}</span>
                        )}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'bg-earth-100 text-earth-600'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;
