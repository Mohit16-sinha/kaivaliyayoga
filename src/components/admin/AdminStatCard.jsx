import React from 'react';

/**
 * Admin stat card with icon, value, label, and change indicator.
 */
const AdminStatCard = ({ icon, label, value, change, changeType = 'neutral', className = '' }) => {
    const changeColors = {
        positive: 'text-green-600 bg-green-50',
        negative: 'text-red-600 bg-red-50',
        neutral: 'text-earth-500 bg-earth-50',
    };

    return (
        <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-earth-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-earth-900">{value}</p>
                    {change !== undefined && (
                        <p className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${changeColors[changeType]}`}>
                            {changeType === 'positive' && '↑'}
                            {changeType === 'negative' && '↓'}
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStatCard;
