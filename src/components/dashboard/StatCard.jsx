import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * Enhanced StatCard with animated counter, colored icons, and gradient accents.
 */
const StatCard = ({
    icon,
    label,
    value,
    change,
    changeType = 'neutral',
    link,
    color = 'primary', // primary, secondary, accent, success, warning
    className = '',
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    // Color configurations
    const colorConfig = {
        primary: {
            bg: 'bg-primary-100',
            text: 'text-primary-600',
            gradient: 'from-primary-500/10 to-transparent',
            border: 'border-primary-200',
        },
        secondary: {
            bg: 'bg-secondary-100',
            text: 'text-secondary-600',
            gradient: 'from-secondary-500/10 to-transparent',
            border: 'border-secondary-200',
        },
        accent: {
            bg: 'bg-accent-100',
            text: 'text-accent-600',
            gradient: 'from-accent-500/10 to-transparent',
            border: 'border-accent-200',
        },
        success: {
            bg: 'bg-success-50',
            text: 'text-success-600',
            gradient: 'from-success-500/10 to-transparent',
            border: 'border-success-200',
        },
        warning: {
            bg: 'bg-warning-50',
            text: 'text-warning-600',
            gradient: 'from-warning-500/10 to-transparent',
            border: 'border-warning-200',
        },
        yoga: {
            bg: 'bg-yoga-100',
            text: 'text-yoga-600',
            gradient: 'from-yoga-500/10 to-transparent',
            border: 'border-yoga-200',
        },
    };

    const config = colorConfig[color] || colorConfig.primary;

    const changeColors = {
        positive: 'text-success-600 bg-success-50',
        negative: 'text-error-500 bg-error-50',
        neutral: 'text-earth-500 bg-earth-100',
    };

    // Animate number on scroll into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    // Animate counter
    useEffect(() => {
        if (!isVisible) return;

        const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
        if (isNaN(numericValue)) {
            setDisplayValue(value);
            return;
        }

        const duration = 1000;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.floor(startValue + (numericValue - startValue) * easeProgress);
            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(numericValue);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, value]);

    // Format displayed value
    const formatDisplayValue = () => {
        if (typeof value === 'string' && value.includes('$')) {
            return `$${displayValue}`;
        }
        return displayValue;
    };

    const CardContent = () => (
        <div
            ref={cardRef}
            className={`
                relative overflow-hidden
                bg-white rounded-xl p-6 
                shadow-soft hover:shadow-lg
                transition-all duration-300
                hover:-translate-y-0.5
                border border-earth-100 hover:${config.border}
                ${className}
            `}
        >
            {/* Gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-earth-500 mb-1">{label}</p>
                    <p className={`text-2xl md:text-3xl font-bold text-earth-900 ${isVisible ? 'animate-fade-in' : ''}`}>
                        {typeof value === 'number' ? formatDisplayValue() : value}
                    </p>
                    {change && (
                        <span className={`inline-flex items-center mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${changeColors[changeType]}`}>
                            {changeType === 'positive' && (
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            )}
                            {changeType === 'negative' && (
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            {change}
                        </span>
                    )}
                </div>
                {icon && (
                    <div className={`
                        flex-shrink-0 w-12 h-12 
                        ${config.bg} ${config.text}
                        rounded-xl flex items-center justify-center
                        transition-transform duration-300
                        group-hover:scale-110
                    `}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );

    if (link) {
        return (
            <Link to={link} className="block group">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
};

export default StatCard;
