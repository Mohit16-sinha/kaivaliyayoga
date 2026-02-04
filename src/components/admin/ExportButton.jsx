import React from 'react';
import { Button } from '../ui';

/**
 * Export button for CSV downloads.
 */
const ExportButton = ({ data, filename = 'export', columns }) => {
    const handleExport = () => {
        if (!data || data.length === 0) return;

        const headers = columns.map((col) => col.header).join(',');
        const rows = data.map((row) =>
            columns.map((col) => {
                const value = row[col.accessor];
                // Escape quotes and wrap in quotes if contains comma
                const strValue = String(value ?? '').replace(/"/g, '""');
                return strValue.includes(',') ? `"${strValue}"` : strValue;
            }).join(',')
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button variant="ghost" size="sm" onClick={handleExport}>
            📥 Export CSV
        </Button>
    );
};

export default ExportButton;
