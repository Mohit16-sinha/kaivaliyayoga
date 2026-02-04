import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

/**
 * Search Bar component with autocomplete capability.
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {function} props.onSearch - Search callback with query
 * @param {string} props.initialValue - Initial search value
 */
const SearchBar = ({
    placeholder = 'Search professionals, services...',
    onSearch,
    initialValue = '',
    className = '',
}) => {
    const [query, setQuery] = useState(initialValue);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        } else {
            // Default: navigate to professionals page with search query
            navigate(`/professionals?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full pl-12 pr-4 py-3 border border-earth-200 rounded-full bg-white text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                />

                {/* Clear Button */}
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-14 flex items-center pr-2 text-earth-400 hover:text-earth-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                    <span className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                        Search
                    </span>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
