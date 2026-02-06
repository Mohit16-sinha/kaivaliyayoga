import React, { useState, useEffect } from 'react';
import { Button, Badge, Spinner, Card } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';
import { getPaymentHistory, downloadInvoice } from '../../services/paymentService';

/**
 * Payment History page - Track all transactions and invoices.
 */
const PaymentHistory = () => {
    const { formatPrice } = useCurrency();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null); // Track downloading state
    const [dateRange, setDateRange] = useState('30');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchPayments();
    }, [dateRange, statusFilter]);

    const handleDownloadInvoice = async (paymentId, e) => {
        if (e) e.stopPropagation();
        alert('Debug: Button Clicked for ID ' + paymentId);
        setDownloadingId(paymentId);
        try {
            await downloadInvoice(paymentId);
        } catch (error) {
            console.error('Failed to download invoice:', error);
            alert(`Download failed: ${error.message || 'Unknown error'}`);
        } finally {
            setDownloadingId(null);
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getPaymentHistory();
            // Map backend data to frontend format
            const formattedPayments = data.map(p => ({
                id: p.id,
                date: p.created_at,
                professional_name: p.description || 'Kaivalya Yoga',
                service_name: p.method || 'Payment',
                amount: p.amount,
                status: p.status === 'success' ? 'paid' : p.status,
                transaction_id: p.razorpay_payment_id || p.order_id || `TXN-${p.id}`,
                card_last4: '****',
                service_fee: p.amount,
                platform_fee: 0,
            }));
            setPayments(formattedPayments);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };


    const filteredPayments = payments.filter(payment => {
        if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
        return true;
    });

    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const getStatusBadge = (status) => {
        const variants = {
            paid: 'success',
            refunded: 'warning',
            pending: 'default',
            failed: 'danger',
        };
        const labels = {
            paid: 'Paid ✓',
            refunded: 'Refunded',
            pending: 'Pending',
            failed: 'Failed',
        };
        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleExportCSV = () => {
        // TODO: Implement CSV export
        console.log('Exporting CSV...');
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Payment History</h1>
                        <p className="text-earth-500 mt-1">Track all your transactions and download invoices</p>
                    </div>
                    <Button variant="ghost" onClick={handleExportCSV}>
                        📄 Export CSV
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="180">Last 6 months</option>
                            <option value="365">Last year</option>
                            <option value="all">All time</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-card p-12 text-center">
                        <p className="text-earth-500">No transactions found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-card overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-earth-50 border-b border-earth-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Professional</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-earth-100">
                                    {paginatedPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="hover:bg-earth-50 cursor-pointer"
                                            onClick={() => setSelectedPayment(payment)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-900">
                                                {formatDate(payment.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium text-earth-900">{payment.professional_name}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-600">
                                                {payment.service_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-earth-900">
                                                {formatPrice(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleDownloadInvoice(payment.id, e)}
                                                    disabled={downloadingId === payment.id}
                                                >
                                                    {downloadingId === payment.id ? 'Loading...' : '📄 PDF'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-earth-100">
                            {paginatedPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="p-4 hover:bg-earth-50"
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-earth-900">{payment.professional_name}</p>
                                            <p className="text-sm text-earth-500">{payment.service_name}</p>
                                        </div>
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-earth-500">{formatDate(payment.date)}</span>
                                        <span className="font-medium text-earth-900">{formatPrice(payment.amount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            ← Previous
                        </button>
                        <span className="text-sm text-earth-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Payment Detail Modal */}
                {selectedPayment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayment(null)}>
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-earth-900">Transaction Details</h3>
                                <button onClick={() => setSelectedPayment(null)} className="text-earth-400 hover:text-earth-600">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Transaction ID</span>
                                    <span className="text-earth-900 font-mono">{selectedPayment.transaction_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Date</span>
                                    <span className="text-earth-900">{formatDate(selectedPayment.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Professional</span>
                                    <span className="text-earth-900">{selectedPayment.professional_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Service</span>
                                    <span className="text-earth-900">{selectedPayment.service_name}</span>
                                </div>
                                <div className="border-t border-earth-100 pt-3 flex justify-between">
                                    <span className="text-earth-500">Service Fee</span>
                                    <span className="text-earth-900">{formatPrice(selectedPayment.service_fee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Platform Fee</span>
                                    <span className="text-earth-900">{formatPrice(selectedPayment.platform_fee)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span className="text-earth-900">Total</span>
                                    <span className="text-primary-600">{formatPrice(selectedPayment.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Payment Method</span>
                                    <span className="text-earth-900">**** {selectedPayment.card_last4}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth-500">Status</span>
                                    {getStatusBadge(selectedPayment.status)}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={(e) => handleDownloadInvoice(selectedPayment.id, e)}
                                    disabled={downloadingId === selectedPayment.id}
                                >
                                    {downloadingId === selectedPayment.id ? 'Generating...' : 'Download Invoice'}
                                </Button>
                                <Button variant="ghost" onClick={() => setSelectedPayment(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;

