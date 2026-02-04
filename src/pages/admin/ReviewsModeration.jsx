import React, { useState, useEffect } from 'react';
import { Button, Spinner, Badge, Avatar, Tabs } from '../../components/ui';
import { DataTable, ConfirmModal } from '../../components/admin';

/**
 * Reviews Moderation page - Manage flagged/reported reviews.
 */
const ReviewsModeration = () => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const tabs = [
        { id: 'pending', label: 'Pending', count: reviews.filter(r => r.moderation_status === 'pending').length },
        { id: 'resolved', label: 'Resolved', count: reviews.filter(r => r.moderation_status !== 'pending').length },
    ];

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setReviews(mockReviews);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (review) => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReviews(reviews.map(r =>
                r.id === review.id ? { ...r, moderation_status: 'approved' } : r
            ));
            setSelectedReview(null);
        } finally {
            setProcessing(false);
        }
    };

    const handleRemove = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReviews(reviews.map(r =>
                r.id === selectedReview.id ? { ...r, moderation_status: 'removed' } : r
            ));
            setShowRemoveModal(false);
            setSelectedReview(null);
        } finally {
            setProcessing(false);
        }
    };

    const filteredReviews = reviews.filter(r =>
        activeTab === 'pending' ? r.moderation_status === 'pending' : r.moderation_status !== 'pending'
    );

    const columns = [
        {
            accessor: 'reviewer',
            header: 'Reviewer',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Avatar name={row.reviewer} size="sm" />
                    <span>{row.reviewer}</span>
                </div>
            ),
        },
        {
            accessor: 'professional',
            header: 'Professional',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Avatar name={row.professional} size="sm" />
                    <span>{row.professional}</span>
                </div>
            ),
        },
        {
            accessor: 'rating',
            header: 'Rating',
            render: (rating) => (
                <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
            ),
        },
        {
            accessor: 'report_reason',
            header: 'Report Reason',
            render: (reason) => <Badge variant="warning">{reason}</Badge>,
        },
        { accessor: 'reported_at', header: 'Reported', sortable: true },
        {
            accessor: 'moderation_status',
            header: 'Status',
            render: (status) => {
                const variants = { pending: 'warning', approved: 'success', removed: 'danger' };
                return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
            },
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Reviews Moderation</h1>
                    <p className="text-earth-500 mt-1">Review and moderate flagged reviews</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-t-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                {/* Split View */}
                <div className="flex gap-6">
                    {/* Table */}
                    <div className={`${selectedReview ? 'w-1/2' : 'w-full'} transition-all`}>
                        <DataTable
                            data={filteredReviews}
                            columns={columns}
                            onRowClick={setSelectedReview}
                            emptyMessage={`No ${activeTab} reviews`}
                            searchPlaceholder="Search reviews..."
                        />
                    </div>

                    {/* Detail Panel */}
                    {selectedReview && (
                        <div className="w-1/2 bg-white rounded-xl shadow-card p-6 h-fit sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-earth-900">Review Details</h3>
                                <button onClick={() => setSelectedReview(null)} className="text-earth-400 hover:text-earth-600">
                                    ✕
                                </button>
                            </div>

                            {/* Reviewer Info */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-earth-100">
                                <Avatar name={selectedReview.reviewer} size="md" />
                                <div>
                                    <p className="font-medium text-earth-900">{selectedReview.reviewer}</p>
                                    <p className="text-sm text-earth-500">Reviewing: {selectedReview.professional}</p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-4">
                                <p className="text-earth-500 text-sm mb-1">Rating</p>
                                <span className="text-2xl text-yellow-500">
                                    {'★'.repeat(selectedReview.rating)}{'☆'.repeat(5 - selectedReview.rating)}
                                </span>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4 p-4 bg-earth-50 rounded-lg">
                                <p className="text-earth-700">{selectedReview.content}</p>
                            </div>

                            {/* Report Reason */}
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-sm font-medium text-red-700 mb-1">Report Reason:</p>
                                <p className="text-red-600">{selectedReview.report_reason}</p>
                                <p className="text-sm text-red-500 mt-2">Reporter: {selectedReview.reporter}</p>
                            </div>

                            {/* Actions */}
                            {selectedReview.moderation_status === 'pending' && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="primary"
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(selectedReview)}
                                        loading={processing}
                                    >
                                        ✓ Keep Review
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => setShowRemoveModal(true)}
                                    >
                                        🗑 Remove
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => console.log('Contact user:', selectedReview.reviewer)}
                                    >
                                        📧 Contact
                                    </Button>
                                </div>
                            )}

                            {selectedReview.moderation_status !== 'pending' && (
                                <div className={`p-3 rounded-lg ${selectedReview.moderation_status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    <p className="font-medium">
                                        {selectedReview.moderation_status === 'approved' ? '✓ Review kept' : '✕ Review removed'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Remove Modal */}
            <ConfirmModal
                isOpen={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                onConfirm={handleRemove}
                title="Remove Review"
                message="Are you sure you want to remove this review? This action cannot be undone and the reviewer will be notified."
                confirmText="Remove Review"
                variant="danger"
                loading={processing}
            />
        </div>
    );
};

// Mock Data
const mockReviews = [
    {
        id: 1, reviewer: 'Anonymous User', professional: 'Dr. Sarah Williams', rating: 1,
        content: 'Terrible experience. The session was very unsatisfying and unprofessional.',
        report_reason: 'Inappropriate content', reporter: 'Dr. Sarah Williams', reported_at: 'Jan 12, 2026',
        moderation_status: 'pending',
    },
    {
        id: 2, reviewer: 'John Smith', professional: 'Dr. Michael Chen', rating: 2,
        content: 'Not worth the money. Did not meet my expectations at all.',
        report_reason: 'Spam or fake review', reporter: 'Dr. Michael Chen', reported_at: 'Jan 11, 2026',
        moderation_status: 'pending',
    },
    {
        id: 3, reviewer: 'Emily Davis', professional: 'Dr. Emily Roberts', rating: 3,
        content: 'Average service. Nothing special.',
        report_reason: 'Harassment', reporter: 'Dr. Emily Roberts', reported_at: 'Jan 10, 2026',
        moderation_status: 'approved',
    },
    {
        id: 4, reviewer: 'David Wilson', professional: 'Dr. Lisa Anderson', rating: 1,
        content: 'Complete waste of time and money. Do not book!',
        report_reason: 'False information', reporter: 'Dr. Lisa Anderson', reported_at: 'Jan 8, 2026',
        moderation_status: 'removed',
    },
];

export default ReviewsModeration;
