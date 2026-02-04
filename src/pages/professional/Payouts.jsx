import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Spinner, Badge, EmptyState } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Professional Payouts page - Payout history tracking.
 */
const Payouts = () => {
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedPayout, setSelectedPayout] = useState(null);

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setPayouts(mockPayouts);
            setStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            completed: 'success',
            processing: 'info',
            pending: 'warning',
            failed: 'danger',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Payout History</h1>
                        <p className="text-earth-500 mt-1">Track your payout requests</p>
                    </div>
                    <Link to="/professional/payouts/request">
                        <Button variant="primary">Request Payout</Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Total Paid Out</p>
                        <p className="text-2xl font-bold text-earth-900">{formatPrice(stats.total_paid_out || 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Average Payout</p>
                        <p className="text-2xl font-bold text-earth-900">{formatPrice(stats.avg_payout || 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4">
                        <p className="text-earth-500 text-sm">Next Scheduled</p>
                        <p className="text-2xl font-bold text-earth-900">{stats.next_scheduled || 'None'}</p>
                    </div>
                </div>

                {/* Payouts Table */}
                {payouts.length === 0 ? (
                    <EmptyState
                        title="No Payouts Yet"
                        description="Request your first payout when you have at least $50 available."
                    >
                        <Link to="/professional/payouts/request">
                            <Button variant="primary">Request Payout</Button>
                        </Link>
                    </EmptyState>
                ) : (
                    <div className="bg-white rounded-xl shadow-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-earth-50 border-b border-earth-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Request Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Method</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-earth-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Processed</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-100">
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-earth-50">
                                        <td className="px-6 py-4 text-sm text-earth-600">{payout.request_date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-earth-900">{formatPrice(payout.amount)}</td>
                                        <td className="px-6 py-4 text-sm text-earth-600">{payout.method}</td>
                                        <td className="px-6 py-4 text-center">{getStatusBadge(payout.status)}</td>
                                        <td className="px-6 py-4 text-sm text-earth-600">{payout.processed_date || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedPayout(payout)}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payout Detail Modal */}
            {selectedPayout && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayout(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-earth-900">Payout Details</h3>
                            <button onClick={() => setSelectedPayout(null)} className="text-earth-400 hover:text-earth-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-earth-500">Payout ID</p>
                                    <p className="font-medium text-earth-900">{selectedPayout.id}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Status</p>
                                    {getStatusBadge(selectedPayout.status)}
                                </div>
                                <div>
                                    <p className="text-earth-500">Request Date</p>
                                    <p className="font-medium text-earth-900">{selectedPayout.request_date}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Processed Date</p>
                                    <p className="font-medium text-earth-900">{selectedPayout.processed_date || 'Pending'}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Amount</p>
                                    <p className="font-medium text-earth-900">{formatPrice(selectedPayout.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Processing Fee</p>
                                    <p className="font-medium text-earth-900">{formatPrice(selectedPayout.processing_fee || 0)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-earth-500">Net Amount</p>
                                    <p className="text-xl font-bold text-primary-600">
                                        {formatPrice(selectedPayout.amount - (selectedPayout.processing_fee || 0))}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-earth-500">Payment Method</p>
                                    <p className="font-medium text-earth-900">{selectedPayout.method}</p>
                                </div>
                            </div>

                            {selectedPayout.status === 'failed' && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <strong>Failure Reason:</strong> {selectedPayout.failure_reason || 'Unknown error'}
                                    </p>
                                    <Button variant="primary" size="sm" className="mt-2">Retry Payout</Button>
                                </div>
                            )}

                            {selectedPayout.status === 'processing' && (
                                <p className="text-sm text-earth-500 text-center">
                                    Estimated arrival: 3-5 business days
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock data
const mockStats = {
    total_paid_out: 12890,
    avg_payout: 645,
    next_scheduled: 'Jan 20',
};

const mockPayouts = [
    { id: 'PO-2024-001', request_date: 'Jan 10, 2026', amount: 850, method: 'Bank Transfer', status: 'completed', processed_date: 'Jan 13, 2026', processing_fee: 0 },
    { id: 'PO-2024-002', request_date: 'Dec 28, 2025', amount: 620, method: 'PayPal', status: 'completed', processed_date: 'Dec 31, 2025', processing_fee: 5 },
    { id: 'PO-2024-003', request_date: 'Dec 15, 2025', amount: 1200, method: 'Bank Transfer', status: 'completed', processed_date: 'Dec 18, 2025', processing_fee: 0 },
    { id: 'PO-2024-004', request_date: 'Jan 12, 2026', amount: 480, method: 'Bank Transfer', status: 'processing', processing_fee: 0 },
];

export default Payouts;
