import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge } from '../ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Enhanced Professional Card with beautiful animations and visual effects.
 * Features: gradient borders, photo glow, animated availability, gold stars.
 */
const ProfessionalCard = ({ professional }) => {
    const { formatPrice } = useCurrency();
    const {
        id,
        name,
        profile_image_url,
        specialization,
        type,
        rating,
        review_count,
        hourly_rate,
        currency = 'AUD',
        location,
        is_verified,
        bio,
        is_available_today = true, // Mock availability
    } = professional;

    // Professional type configuration with colors and icons
    const typeConfig = {
        yoga_therapist: {
            variant: 'yoga',
            icon: '🧘',
            gradient: 'from-yoga-100 to-yoga-50',
            shadow: 'shadow-yoga',
            border: 'border-yoga-200',
        },
        doctor: {
            variant: 'doctor',
            icon: '👨‍⚕️',
            gradient: 'from-doctor-100 to-doctor-50',
            shadow: 'shadow-doctor',
            border: 'border-doctor-200',
        },
        nutritionist: {
            variant: 'nutrition',
            icon: '🍎',
            gradient: 'from-nutrition-100 to-nutrition-50',
            shadow: 'shadow-nutrition',
            border: 'border-nutrition-200',
        },
        psychologist: {
            variant: 'psychology',
            icon: '🧠',
            gradient: 'from-psychology-100 to-psychology-50',
            shadow: 'shadow-psychology',
            border: 'border-psychology-200',
        },
        nurse: {
            variant: 'nurse',
            icon: '👩‍⚕️',
            gradient: 'from-nurse-100 to-nurse-50',
            shadow: 'shadow-nurse',
            border: 'border-nurse-200',
        },
    };

    const config = typeConfig[type] || typeConfig.doctor;

    // Format professional type for display
    const formatType = (type) => {
        return type
            ?.replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Professional';
    };

    // Render star rating with gold stars
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Full star
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                // Half star
                stars.push(
                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${id}-${i}`}>
                                <stop offset="50%" stopColor="#FACC15" />
                                <stop offset="50%" stopColor="#E5E7EB" />
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${id}-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else {
                // Empty star
                stars.push(
                    <svg key={i} className="w-4 h-4 text-earth-200 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <Link
            to={`/professional/${id}`}
            className={`
                group block relative
                bg-gradient-to-br ${config.gradient}
                rounded-2xl overflow-hidden
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-xl
                border ${config.border}
            `}
        >
            {/* Animated gradient border on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-2px] bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-2xl animate-gradient-shift opacity-50 blur-sm" />
            </div>

            {/* Card content with white background */}
            <div className="relative bg-white/90 backdrop-blur-sm m-[1px] rounded-2xl p-5">
                {/* Type icon badge - floating top right */}
                <div className="absolute -top-2 -right-2 text-2xl filter drop-shadow-lg">
                    {config.icon}
                </div>

                {/* Header with Avatar and Basic Info */}
                <div className="flex items-start space-x-4">
                    {/* Enhanced Avatar with glow */}
                    <div className="relative group/avatar">
                        <div className={`absolute inset-0 bg-gradient-to-r from-${config.variant}-400 to-${config.variant}-600 rounded-full blur-md opacity-0 group-hover/avatar:opacity-50 transition-opacity duration-300`} />
                        <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                            <Avatar
                                src={profile_image_url}
                                name={name}
                                size="lg"
                                verified={is_verified}
                                className="ring-2 ring-white shadow-lg"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-earth-900 group-hover:text-primary-600 transition-colors truncate">
                            {name}
                        </h3>
                        <p className="text-sm text-earth-600 truncate font-medium">
                            {specialization || formatType(type)}
                        </p>
                        {location && (
                            <p className="text-xs text-earth-400 mt-1 flex items-center">
                                <svg className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{location}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Availability Badge */}
                {is_available_today && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-success-50 text-success-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                        </span>
                        Available Today
                    </div>
                )}

                {/* Bio */}
                {bio && (
                    <p className="mt-3 text-sm text-earth-600 line-clamp-2 leading-relaxed">
                        {bio}
                    </p>
                )}

                {/* Rating and Type Badges */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                    <Badge variant={config.variant} size="sm" className="font-medium">
                        {config.icon} {formatType(type)}
                    </Badge>

                    {rating > 0 && (
                        <div className="flex items-center gap-1">
                            <div className={`flex items-center ${rating >= 5 ? 'animate-pulse' : ''}`}>
                                {renderStars(rating)}
                            </div>
                            <span className="text-sm font-bold text-earth-900 ml-1">{rating.toFixed(1)}</span>
                            <span className="text-xs text-earth-400">({review_count})</span>
                        </div>
                    )}
                </div>

                {/* Price with gradient background */}
                {hourly_rate > 0 && (
                    <div className="mt-4 pt-4 border-t border-earth-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-earth-500">Starting from</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                                    {formatPrice(hourly_rate)}
                                </span>
                                <span className="text-sm text-earth-400">/session</span>
                            </div>
                        </div>

                        {/* Book Now button on hover */}
                        <div className="mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <div className="w-full py-2 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all">
                                View & Book →
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProfessionalCard;
