import React from 'react';
import { ProfessionalCardSkeleton } from '../ui/Skeleton';

/**
 * Professional Card Skeleton for loading states.
 * Re-exports the skeleton from ui for convenience.
 */
export { ProfessionalCardSkeleton };

/**
 * Grid of skeleton cards for loading state.
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to show
 */
export const ProfessionalCardSkeletonGrid = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProfessionalCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default ProfessionalCardSkeleton;
