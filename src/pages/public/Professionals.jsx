import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchBar, FilterSidebar } from '../../components/search';
import { ProfessionalCard, ProfessionalCardSkeletonGrid } from '../../components/professional';
import { EmptyState, Button, Spinner } from '../../components/ui';
import professionalService from '../../services/professionalService';

/**
 * Enhanced Professionals listing page with search, filters, sorting, and pagination.
 */
const Professionals = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('recommended');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        types: [],
        minRating: null,
        priceRanges: [],
        languages: [],
        availability: null,
        experience: null,
        verifiedOnly: false,
        onlineOnly: false,
        inPersonOnly: false,
    });

    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const limit = 12;

    useEffect(() => {
        // If type is in URL, add to filters
        if (type && !filters.types.includes(type)) {
            setFilters(prev => ({ ...prev, types: [type] }));
        }
    }, [type]);

    useEffect(() => {
        fetchProfessionals();
    }, [query, filters, currentPage, sortBy]);

    const fetchProfessionals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await professionalService.search({
                q: query,
                type: filters.types.join(',') || undefined,
                minRating: filters.minRating || undefined,
                languages: filters.languages.join(',') || undefined,
                availability: filters.availability || undefined,
                verifiedOnly: filters.verifiedOnly || undefined,
                page: currentPage,
                limit,
                sort_by: sortBy,
            });

            const data = response.data || response.professionals || response || [];
            setProfessionals(Array.isArray(data) ? data : []);
            setTotalCount(response.total || data.length || 0);
        } catch (err) {
            console.error('Failed to fetch professionals:', err);
            setError('Failed to load professionals.');
            // Use mock data for demo
            setProfessionals(mockProfessionals);
            setTotalCount(mockProfessionals.length);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchQuery) => {
        setSearchParams(searchQuery ? { q: searchQuery } : {});
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            types: [],
            minRating: null,
            priceRanges: [],
            languages: [],
            availability: null,
            experience: null,
            verifiedOnly: false,
            onlineOnly: false,
            inPersonOnly: false,
        });
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    // Get active filter chips for display
    const getActiveFilterChips = () => {
        const chips = [];

        filters.types.forEach(t => {
            const label = formatType(t);
            chips.push({
                key: `type-${t}`, label, onRemove: () => {
                    setFilters(prev => ({ ...prev, types: prev.types.filter(x => x !== t) }));
                }
            });
        });

        if (filters.minRating) {
            chips.push({
                key: 'rating', label: `${filters.minRating}+ Stars`, onRemove: () => {
                    setFilters(prev => ({ ...prev, minRating: null }));
                }
            });
        }

        filters.languages.forEach(l => {
            chips.push({
                key: `lang-${l}`, label: l.charAt(0).toUpperCase() + l.slice(1), onRemove: () => {
                    setFilters(prev => ({ ...prev, languages: prev.languages.filter(x => x !== l) }));
                }
            });
        });

        if (filters.verifiedOnly) {
            chips.push({
                key: 'verified', label: 'Verified Only', onRemove: () => {
                    setFilters(prev => ({ ...prev, verifiedOnly: false }));
                }
            });
        }

        if (filters.availability) {
            chips.push({
                key: 'availability', label: formatAvailability(filters.availability), onRemove: () => {
                    setFilters(prev => ({ ...prev, availability: null }));
                }
            });
        }

        return chips;
    };

    const formatType = (type) => type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
    const formatAvailability = (av) => {
        const map = { today: 'Available Today', this_week: 'This Week', anytime: 'Anytime' };
        return map[av] || av;
    };

    const activeChips = getActiveFilterChips();
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-4">
                        <ol className="flex items-center text-sm text-primary-200">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li className="mx-2">/</li>
                            <li className="text-white">Professionals</li>
                            {type && (
                                <>
                                    <li className="mx-2">/</li>
                                    <li className="text-white">{formatType(type)}</li>
                                </>
                            )}
                        </ol>
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        {type ? `Find ${formatType(type)}s` : 'Find Your Perfect Wellness Professional'}
                    </h1>
                    <p className="text-primary-100 text-center mb-8 max-w-2xl mx-auto">
                        {totalCount > 0 ? `${totalCount}+ verified professionals ready to help` : 'Connect with verified wellness professionals'}
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            placeholder="Search by name, specialty, or location..."
                            onSearch={handleSearch}
                            initialValue={query}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden flex items-center justify-center gap-2 bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 rounded-lg px-4 py-2 text-sm font-medium text-earth-700 dark:text-earth-200 hover:bg-earth-50 dark:hover:bg-earth-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters {activeChips.length > 0 && `(${activeChips.length})`}
                    </button>

                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearAll={handleClearFilters}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filters Drawer */}
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-earth-800 shadow-xl overflow-y-auto transition-colors">
                                <div className="p-4 border-b border-earth-100 dark:border-earth-700 flex items-center justify-between">
                                    <h3 className="font-semibold text-earth-900 dark:text-white">Filters</h3>
                                    <button onClick={() => setMobileFiltersOpen(false)}>
                                        <svg className="h-6 w-6 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <FilterSidebar
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        onClearAll={handleClearFilters}
                                    />
                                </div>

                                <div className="p-4 border-t border-earth-100 dark:border-earth-700">
                                    <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <main className="flex-1 min-w-0">
                        {/* Active Filters */}
                        {activeChips.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-sm text-earth-500">Active filters:</span>
                                {activeChips.map(chip => (
                                    <span
                                        key={chip.key}
                                        className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {chip.label}
                                        <button
                                            onClick={chip.onRemove}
                                            className="hover:text-primary-900"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={handleClearFilters}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-lg font-semibold text-earth-900 dark:text-white transition-colors">
                                {loading ? 'Loading...' : `${totalCount} Professional${totalCount !== 1 ? 's' : ''} Found`}
                            </h2>
                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="border border-earth-200 dark:border-earth-700 rounded-lg px-3 py-2 text-sm text-earth-600 dark:text-earth-200 bg-white dark:bg-earth-800 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price_low">Lowest Price</option>
                                    <option value="price_high">Highest Price</option>
                                    <option value="reviews">Most Reviews</option>
                                    <option value="experience">Most Experienced</option>
                                </select>

                                {/* View Toggle */}
                                <div className="hidden sm:flex items-center border border-earth-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-earth-400 hover:text-earth-600'}`}
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-earth-400 dark:text-earth-500 hover:text-earth-600 dark:hover:text-earth-300'}`}
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        {loading ? (
                            <ProfessionalCardSkeletonGrid count={6} />
                        ) : professionals.length === 0 ? (
                            <EmptyState
                                title="No professionals found"
                                description="Try adjusting your search or filters to find what you're looking for."
                                icon={
                                    <svg className="h-12 w-12 text-earth-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                            >
                                <div className="mt-4 flex gap-2">
                                    <Button variant="ghost" onClick={handleClearFilters}>Clear Filters</Button>
                                    <Link to="/professionals">
                                        <Button variant="primary">Browse All</Button>
                                    </Link>
                                </div>
                            </EmptyState>
                        ) : (
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                : "flex flex-col gap-4"
                            }>
                                {professionals.map((professional) => (
                                    <ProfessionalCard
                                        key={professional.id}
                                        professional={professional}
                                        layout={viewMode}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && !loading && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-earth-200 rounded-lg text-sm font-medium text-earth-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50"
                                >
                                    ← Previous
                                </button>

                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === pageNum
                                                ? 'bg-primary-600 text-white'
                                                : 'border border-earth-200 text-earth-600 hover:bg-earth-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-earth-200 rounded-lg text-sm font-medium text-earth-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div >
    );
};

// Mock professionals for demo
const mockProfessionals = [
    { id: 1, name: 'Dr. Sarah Johnson', type: 'yoga_therapist', specialization: 'Therapeutic Yoga & Meditation', rating: 4.9, review_count: 127, hourly_rate: 85, location: 'Sydney, Australia', is_verified: true, bio: 'Certified yoga therapist with 15+ years of experience.' },
    { id: 2, name: 'Dr. Michael Chen', type: 'doctor', specialization: 'Integrative Medicine', rating: 4.7, review_count: 89, hourly_rate: 150, location: 'Melbourne, Australia', is_verified: true, bio: 'Board-certified physician specializing in holistic healthcare.' },
    { id: 3, name: 'Emily Rodriguez', type: 'nutritionist', specialization: 'Plant-Based Nutrition', rating: 4.8, review_count: 64, hourly_rate: 75, location: 'Brisbane, Australia', is_verified: true, bio: 'Helping you achieve optimal health through personalized nutrition.' },
    { id: 4, name: 'Dr. James Wilson', type: 'psychologist', specialization: 'Anxiety & Stress', rating: 4.7, review_count: 112, hourly_rate: 120, location: 'Perth, Australia', is_verified: true, bio: 'Clinical psychologist specializing in evidence-based treatments.' },
    { id: 5, name: 'Lisa Park', type: 'nurse', specialization: 'Holistic Health Coaching', rating: 4.8, review_count: 45, hourly_rate: 65, location: 'Adelaide, Australia', is_verified: true, bio: 'Registered nurse with health coaching certification.' },
    { id: 6, name: 'Priya Sharma', type: 'yoga_therapist', specialization: 'Prenatal Yoga', rating: 5.0, review_count: 78, hourly_rate: 90, location: 'Online', is_verified: true, bio: 'Supporting women through pregnancy with therapeutic yoga.' },
];

export default Professionals;
