import React from 'react';

/**
 * Enhanced Skeleton loading placeholder with shimmer animation.
 * @param {Object} props
 * @param {'text'|'avatar'|'card'|'rectangle'|'circle'} props.variant
 * @param {string} props.width - Custom width
 * @param {string} props.height - Custom height
 */
const Skeleton = ({
    variant = 'text',
    width,
    height,
    className = '',
}) => {
    const baseStyles = 'relative overflow-hidden bg-gradient-to-r from-earth-100 via-earth-200 to-earth-100 bg-[length:200%_100%] animate-shimmer rounded';

    const variants = {
        text: 'h-4 w-full rounded',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-xl',
        rectangle: 'rounded-lg',
        circle: 'rounded-full',
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};

/**
 * Enhanced Skeleton group for professional card loading state.
 * Features shimmer effect and realistic card structure.
 */
export const ProfessionalCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-soft border border-earth-100 overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <div className="flex items-start space-x-4">
            {/* Avatar */}
            <Skeleton variant="circle" className="h-16 w-16 flex-shrink-0" />

            {/* Info */}
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" height="20px" />
                <Skeleton variant="text" width="50%" height="16px" />
                <Skeleton variant="text" width="40%" height="14px" />
            </div>
        </div>

        {/* Availability badge skeleton */}
        <div className="mt-3">
            <Skeleton variant="rectangle" width="110px" height="28px" className="rounded-full" />
        </div>

        {/* Bio skeleton */}
        <div className="mt-3 space-y-2">
            <Skeleton variant="text" width="100%" height="14px" />
            <Skeleton variant="text" width="80%" height="14px" />
        </div>

        {/* Badges */}
        <div className="mt-4 flex items-center justify-between">
            <Skeleton variant="rectangle" width="100px" height="26px" className="rounded-full" />
            <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} variant="circle" width="16px" height="16px" />
                ))}
            </div>
        </div>

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-earth-100 flex items-center justify-between">
            <Skeleton variant="text" width="80px" height="16px" />
            <Skeleton variant="text" width="60px" height="24px" />
        </div>
    </div>
);

/**
 * Dashboard stat card skeleton
 */
export const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-earth-100">
        <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
                <Skeleton variant="text" width="60%" height="14px" />
                <Skeleton variant="text" width="40%" height="32px" />
                <Skeleton variant="text" width="50%" height="12px" />
            </div>
            <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
        </div>
    </div>
);

/**
 * Profile page skeleton
 */
export const ProfileSkeleton = () => (
    <div className="space-y-6">
        {/* Hero banner */}
        <Skeleton variant="rectangle" width="100%" height="200px" className="rounded-2xl" />

        {/* Profile info */}
        <div className="flex items-start gap-6 -mt-16 relative z-10 px-6">
            <Skeleton variant="circle" className="w-32 h-32 ring-4 ring-white" />
            <div className="space-y-2 pt-16">
                <Skeleton variant="text" width="200px" height="28px" />
                <Skeleton variant="text" width="150px" height="18px" />
                <div className="flex gap-2 mt-2">
                    <Skeleton variant="rectangle" width="80px" height="24px" className="rounded-full" />
                    <Skeleton variant="rectangle" width="100px" height="24px" className="rounded-full" />
                </div>
            </div>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-2 space-y-4">
                <Skeleton variant="rectangle" width="100%" height="200px" className="rounded-xl" />
                <Skeleton variant="rectangle" width="100%" height="150px" className="rounded-xl" />
            </div>
            <div className="space-y-4">
                <Skeleton variant="rectangle" width="100%" height="180px" className="rounded-xl" />
                <Skeleton variant="rectangle" width="100%" height="120px" className="rounded-xl" />
            </div>
        </div>
    </div>
);

/**
 * Table row skeleton
 */
export const TableRowSkeleton = ({ columns = 5 }) => (
    <tr className="border-b border-earth-100">
        {[...Array(columns)].map((_, i) => (
            <td key={i} className="px-4 py-4">
                <Skeleton
                    variant="text"
                    width={i === 0 ? '150px' : `${60 + Math.random() * 40}%`}
                    height="16px"
                />
            </td>
        ))}
    </tr>
);

export default Skeleton;
