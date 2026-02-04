import React, { useState, useMemo } from 'react';
import { Button, Spinner } from '../ui';

/**
 * Reusable DataTable component with search, sort, filter, paginate.
 */
const DataTable = ({
    data = [],
    columns = [],
    loading = false,
    searchable = true,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    onRowClick,
    emptyMessage = 'No data found',
    actions,
    bulkActions,
    selectedRows = [],
    onSelectionChange,
}) => {
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter by search
    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter((row) =>
            columns.some((col) => {
                const value = row[col.accessor];
                return value?.toString().toLowerCase().includes(search.toLowerCase());
            })
        );
    }, [data, search, columns]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortColumn] || '';
            const bVal = b[sortColumn] || '';
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDirection === 'asc'
                ? aVal.toString().localeCompare(bVal.toString())
                : bVal.toString().localeCompare(aVal.toString());
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (accessor) => {
        if (sortColumn === accessor) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(accessor);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange?.(paginatedData.map((row) => row.id));
        } else {
            onSelectionChange?.([]);
        }
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            onSelectionChange?.(selectedRows.filter((r) => r !== id));
        } else {
            onSelectionChange?.([...selectedRows, id]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* Header */}
            {(searchable || bulkActions) && (
                <div className="p-4 border-b border-earth-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {searchable && (
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full sm:w-64 px-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        />
                    )}
                    {bulkActions && selectedRows.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-earth-500">{selectedRows.length} selected</span>
                            {bulkActions}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : paginatedData.length === 0 ? (
                <div className="py-12 text-center text-earth-500">{emptyMessage}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-earth-50 border-b border-earth-100">
                            <tr>
                                {onSelectionChange && (
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={paginatedData.length > 0 && paginatedData.every((r) => selectedRows.includes(r.id))}
                                            onChange={handleSelectAll}
                                            className="rounded"
                                        />
                                    </th>
                                )}
                                {columns.map((col) => (
                                    <th
                                        key={col.accessor}
                                        className={`px-4 py-3 text-left text-xs font-medium text-earth-500 uppercase ${col.sortable ? 'cursor-pointer hover:text-earth-700' : ''}`}
                                        onClick={() => col.sortable && handleSort(col.accessor)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.header}
                                            {col.sortable && sortColumn === col.accessor && (
                                                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {actions && <th className="px-4 py-3 text-right text-xs font-medium text-earth-500 uppercase">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-earth-100">
                            {paginatedData.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    className={`hover:bg-earth-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {onSelectionChange && (
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleSelectRow(row.id)}
                                                className="rounded"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={col.accessor} className="px-4 py-3 text-sm text-earth-700">
                                            {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-earth-100 flex items-center justify-between">
                    <p className="text-sm text-earth-500">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) page = i + 1;
                            else if (currentPage <= 3) page = i + 1;
                            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                            else page = currentPage - 2 + i;
                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
