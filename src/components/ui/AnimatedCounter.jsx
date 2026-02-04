import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated counter that counts up from 0 to target value.
 * @param {Object} props
 * @param {number} props.target - Target number to count to
 * @param {string} props.suffix - Suffix (e.g., "+", "K", "%")
 * @param {string} props.prefix - Prefix (e.g., "$")
 * @param {number} props.duration - Animation duration in ms
 * @param {number} props.decimals - Number of decimal places
 */
const AnimatedCounter = ({
    target,
    suffix = '',
    prefix = '',
    duration = 2000,
    decimals = 0,
    className = '',
}) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(easeOut * target);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [isVisible, target, duration]);

    const formattedCount = decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString();

    return (
        <span ref={ref} className={className}>
            {prefix}{formattedCount}{suffix}
        </span>
    );
};

export default AnimatedCounter;
