import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProfessionalCard, ProfessionalCardSkeletonGrid } from '../../components/professional';
import { Button, EmptyState, Spinner } from '../../components/ui';

/**
 * Favorites page - Quick access to saved professionals.
 */
const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setFavorites(mockFavorites);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (professionalId) => {
        try {
            setFavorites(prev => prev.filter(p => p.id !== professionalId));
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Favorite Professionals</h1>
                    <p className="text-earth-500 mt-1">Quick access to professionals you've saved</p>
                </div>

                {/* Content */}
                {loading ? (
                    <ProfessionalCardSkeletonGrid count={6} />
                ) : favorites.length === 0 ? (
                    <EmptyState
                        icon={
                            <svg className="h-16 w-16 text-red-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        }
                        title="No Favorites Yet"
                        description="Start exploring professionals and save your favorites here for quick access"
                    >
                        <Link to="/professionals">
                            <Button variant="primary">Browse Professionals</Button>
                        </Link>
                    </EmptyState>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((professional) => (
                            <ProfessionalCard
                                key={professional.id}
                                professional={professional}
                                isFavorite={true}
                                onFavoriteToggle={() => handleRemoveFavorite(professional.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Mock data
const mockFavorites = [
    { id: 1, name: 'Dr. Sarah Johnson', type: 'yoga_therapist', specialization: 'Therapeutic Yoga', rating: 4.9, review_count: 127, hourly_rate: 85, is_verified: true },
    { id: 2, name: 'Dr. Michael Chen', type: 'doctor', specialization: 'Integrative Medicine', rating: 4.7, review_count: 89, hourly_rate: 150, is_verified: true },
    { id: 3, name: 'Emily Rodriguez', type: 'nutritionist', specialization: 'Plant-Based Nutrition', rating: 4.8, review_count: 64, hourly_rate: 75, is_verified: true },
];

export default Favorites;
