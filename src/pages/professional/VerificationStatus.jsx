import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Spinner, Badge } from '../../components/ui';

/**
 * Professional Verification Status page.
 */
const VerificationStatus = () => {
    const [loading, setLoading] = useState(true);
    const [verification, setVerification] = useState(null);

    useEffect(() => {
        fetchVerificationStatus();
    }, []);

    const fetchVerificationStatus = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setVerification(mockVerification);
        } catch (error) {
            console.error('Failed to fetch verification:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStepStatus = (step) => {
        if (step.status === 'completed') return { icon: '✓', color: 'bg-green-500', text: 'text-green-600' };
        if (step.status === 'pending') return { icon: '⏳', color: 'bg-yellow-500', text: 'text-yellow-600' };
        if (step.status === 'rejected') return { icon: '✕', color: 'bg-red-500', text: 'text-red-600' };
        return { icon: '○', color: 'bg-earth-200', text: 'text-earth-400' };
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const completedSteps = verification?.steps.filter(s => s.status === 'completed').length || 0;
    const totalSteps = verification?.steps.length || 0;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Verification Status</h1>
                    <p className="text-earth-500 mt-1">Complete verification to unlock all features</p>
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-earth-900">Overall Progress</h2>
                        <Badge variant={verification?.is_verified ? 'success' : 'warning'}>
                            {verification?.is_verified ? '✓ Verified' : 'In Progress'}
                        </Badge>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-earth-500">{completedSteps} of {totalSteps} steps completed</span>
                            <span className="font-medium text-primary-600">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-3 bg-earth-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {verification?.is_verified ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            🎉 Congratulations! Your profile is fully verified. You have access to all features.
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                            💡 Complete all steps to get the verified badge and increase your visibility.
                        </div>
                    )}
                </div>

                {/* Steps */}
                <div className="bg-white rounded-xl shadow-card">
                    <div className="p-6 border-b border-earth-100">
                        <h2 className="text-lg font-semibold text-earth-900">Verification Steps</h2>
                    </div>
                    <div className="divide-y divide-earth-100">
                        {verification?.steps.map((step, index) => {
                            const status = getStepStatus(step);
                            return (
                                <div key={step.id} className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${status.color}`}>
                                            {status.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-earth-900">{step.title}</h3>
                                                <Badge
                                                    variant={
                                                        step.status === 'completed' ? 'success' :
                                                            step.status === 'pending' ? 'warning' :
                                                                step.status === 'rejected' ? 'danger' : 'default'
                                                    }
                                                    size="sm"
                                                >
                                                    {step.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-earth-500 mb-3">{step.description}</p>

                                            {step.status === 'not_started' && (
                                                <Button variant="primary" size="sm">
                                                    {step.action_label || 'Start'}
                                                </Button>
                                            )}

                                            {step.status === 'pending' && (
                                                <p className="text-sm text-yellow-600">
                                                    ⏳ Under review. Usually takes 1-2 business days.
                                                </p>
                                            )}

                                            {step.status === 'rejected' && (
                                                <div className="p-3 bg-red-50 rounded-lg">
                                                    <p className="text-sm text-red-700 mb-2">
                                                        <strong>Reason:</strong> {step.rejection_reason}
                                                    </p>
                                                    <Button variant="primary" size="sm">
                                                        Resubmit
                                                    </Button>
                                                </div>
                                            )}

                                            {step.status === 'completed' && step.completed_at && (
                                                <p className="text-xs text-earth-400">
                                                    Completed on {step.completed_at}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-earth-500">
                    Need help? <a href="#" className="text-primary-600 hover:text-primary-700">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

const mockVerification = {
    is_verified: false,
    steps: [
        { id: 1, title: 'Email Verification', description: 'Verify your email address.', status: 'completed', completed_at: 'Dec 15, 2025' },
        { id: 2, title: 'Phone Verification', description: 'Verify your phone number via SMS.', status: 'completed', completed_at: 'Dec 15, 2025' },
        { id: 3, title: 'Identity Verification', description: 'Upload a government-issued ID for identity verification.', status: 'completed', completed_at: 'Dec 18, 2025' },
        { id: 4, title: 'Credential Verification', description: 'Upload your certifications for verification.', status: 'pending' },
        { id: 5, title: 'Background Check', description: 'Complete a background check for client safety.', status: 'not_started', action_label: 'Start Check' },
    ],
};

export default VerificationStatus;
