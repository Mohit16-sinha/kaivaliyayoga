import { useState, useMemo } from 'react';

/**
 * Pagination logic hook.
 * @param {Object} options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerPage - Items per page (default: 10)
 * @param {number} options.initialPage - Initial page (default: 1)
 */
const usePagination = ({
    totalItems = 0,
    itemsPerPage = 10,
    initialPage = 1,
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    const pagination = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return {
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            startIndex: start,
            endIndex: Math.min(end, totalItems),
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        };
    }, [currentPage, totalPages, itemsPerPage, totalItems]);

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        if (pagination.hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const previousPage = () => {
        if (pagination.hasPreviousPage) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return {
        ...pagination,
        goToPage,
        nextPage,
        previousPage,
        setCurrentPage,
    };
};

export default usePagination;
