import React, { useState } from 'react';
import { Badge } from '../ui';

/**
 * Enhanced Filter Sidebar component for professional search.
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {function} props.onFilterChange - Filter change callback
 * @param {function} props.onClearAll - Clear all filters callback
 */
const FilterSidebar = ({
    filters = {},
    onFilterChange,
    onClearAll,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState({
        types: true,
        rating: true,
        price: true,
        availability: true,
        languages: true,
        experience: false,
        location: false,
    });

    const professionalTypes = [
        { value: 'yoga_therapist', label: 'Yoga Therapist', icon: '🧘' },
        { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
        { value: 'nutritionist', label: 'Nutritionist', icon: '🍎' },
        { value: 'psychologist', label: 'Psychologist', icon: '🧠' },
        { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    ];

    const ratingOptions = [
        { value: 5, label: '5 Stars Only' },
        { value: 4, label: '4+ Stars' },
        { value: 3, label: '3+ Stars' },
    ];

    const priceRanges = [
        { value: '0-50', label: 'Under $50/hr', min: 0, max: 50 },
        { value: '50-100', label: '$50 - $100/hr', min: 50, max: 100 },
        { value: '100-200', label: '$100 - $200/hr', min: 100, max: 200 },
        { value: '200+', label: '$200+/hr', min: 200, max: 999 },
    ];

    const availabilityOptions = [
        { value: 'today', label: 'Available Today' },
        { value: 'this_week', label: 'This Week' },
        { value: 'anytime', label: 'Anytime' },
    ];

    const languageOptions = [
        { value: 'english', label: 'English', flag: '🇬🇧' },
        { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
        { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
        { value: 'mandarin', label: 'Mandarin', flag: '🇨🇳' },
        { value: 'french', label: 'French', flag: '🇫🇷' },
        { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
    ];

    const experienceOptions = [
        { value: '0-2', label: '0-2 years' },
        { value: '3-5', label: '3-5 years' },
        { value: '5-10', label: '5-10 years' },
        { value: '10+', label: '10+ years' },
    ];

    const hasFilters = Object.entries(filters).some(([key, val]) => {
        if (Array.isArray(val)) return val.length > 0;
        return val !== null && val !== undefined && val !== false && val !== '';
    });

    const activeFilterCount = Object.entries(filters).reduce((count, [key, val]) => {
        if (Array.isArray(val)) return count + val.length;
        if (val !== null && val !== undefined && val !== false && val !== '') return count + 1;
        return count;
    }, 0);

    const toggleSection = (section) => {
        setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const FilterSection = ({ id, title, defaultExpanded = true, children }) => (
        <div className="border-b border-earth-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between text-sm font-medium text-earth-700 mb-3 hover:text-earth-900"
            >
                {title}
                <svg
                    className={`h-4 w-4 transition-transform ${isExpanded[id] ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isExpanded[id] && children}
        </div>
    );

    return (
        <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-earth-900">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {hasFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Professional Type */}
            <FilterSection id="types" title="Professional Type">
                <div className="space-y-2">
                    {professionalTypes.map((type) => (
                        <label key={type.value} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.types?.includes(type.value) || false}
                                onChange={(e) => {
                                    const newTypes = e.target.checked
                                        ? [...(filters.types || []), type.value]
                                        : (filters.types || []).filter(t => t !== type.value);
                                    onFilterChange({ ...filters, types: newTypes });
                                }}
                                className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center gap-2">
                                <span>{type.icon}</span>
                                {type.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Availability */}
            <FilterSection id="availability" title="Availability">
                <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="availability"
                                checked={filters.availability === option.value}
                                onChange={() => onFilterChange({ ...filters, availability: option.value })}
                                className="h-4 w-4 border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection id="rating" title="Minimum Rating">
                <div className="space-y-2">
                    {ratingOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === option.value}
                                onChange={() => onFilterChange({ ...filters, minRating: option.value })}
                                className="h-4 w-4 border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center">
                                {option.label}
                                <span className="ml-1 flex">
                                    {[...Array(option.value)].map((_, i) => (
                                        <svg key={i} className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </span>
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection id="price" title="Price Range">
                <div className="space-y-2">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.priceRanges?.includes(range.value) || false}
                                onChange={(e) => {
                                    const newRanges = e.target.checked
                                        ? [...(filters.priceRanges || []), range.value]
                                        : (filters.priceRanges || []).filter(r => r !== range.value);
                                    onFilterChange({ ...filters, priceRanges: newRanges });
                                }}
                                className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900">
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Languages */}
            <FilterSection id="languages" title="Languages">
                <div className="space-y-2">
                    {languageOptions.map((lang) => (
                        <label key={lang.value} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.languages?.includes(lang.value) || false}
                                onChange={(e) => {
                                    const newLangs = e.target.checked
                                        ? [...(filters.languages || []), lang.value]
                                        : (filters.languages || []).filter(l => l !== lang.value);
                                    onFilterChange({ ...filters, languages: newLangs });
                                }}
                                className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center gap-2">
                                <span>{lang.flag}</span>
                                {lang.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Experience */}
            <FilterSection id="experience" title="Years of Experience">
                <div className="space-y-2">
                    {experienceOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="experience"
                                checked={filters.experience === option.value}
                                onChange={() => onFilterChange({ ...filters, experience: option.value })}
                                className="h-4 w-4 border-earth-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Session Type */}
            <FilterSection id="location" title="Session Type">
                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={filters.onlineOnly || false}
                            onChange={(e) => onFilterChange({ ...filters, onlineOnly: e.target.checked })}
                            className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center gap-2">
                            🌐 Online Sessions Only
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={filters.inPersonOnly || false}
                            onChange={(e) => onFilterChange({ ...filters, inPersonOnly: e.target.checked })}
                            className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center gap-2">
                            📍 In-Person Only
                        </span>
                    </label>
                </div>
            </FilterSection>

            {/* Verified Only */}
            <div className="pt-4 mt-4 border-t border-earth-100">
                <label className="flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.verifiedOnly || false}
                        onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
                        className="h-4 w-4 rounded border-earth-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-earth-600 group-hover:text-earth-900 flex items-center">
                        Verified Professionals Only
                        <svg className="h-4 w-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default FilterSidebar;
