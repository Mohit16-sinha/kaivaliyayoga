import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Button, Spinner, Badge, Avatar, Tabs } from '../../components/ui';
import { DataTable, AdminStatCard, ConfirmModal, ExportButton } from '../../components/admin';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Payments & Payouts page - Platform revenue and professional payouts.
 */
const PaymentsManagement = () => {
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('revenue');
    const [revenueData, setRevenueData] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [selectedPayouts, setSelectedPayouts] = useState([]);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const tabs = [
        { id: 'revenue', label: 'Platform Revenue' },
        { id: 'payouts', label: 'Professional Payouts', count: payouts.filter(p => p.status === 'pending').length },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRevenueData(mockRevenueData);
            setPayouts(mockPayouts);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPayouts(payouts.map(p =>
                selectedPayouts.includes(p.id) ? { ...p, status: 'processing' } : p
            ));
            setSelectedPayouts([]);
            setShowApproveModal(false);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPayouts(payouts.map(p =>
                selectedPayouts.includes(p.id) ? { ...p, status: 'rejected' } : p
            ));
            setSelectedPayouts([]);
            setShowRejectModal(false);
        } finally {
            setProcessing(false);
        }
    };

    const pendingPayouts = payouts.filter(p => p.status === 'pending');
    const processedPayouts = payouts.filter(p => p.status !== 'pending');

    const payoutColumns = [
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
        { accessor: 'requested_at', header: 'Requested', sortable: true },
        {
            accessor: 'amount',
            header: 'Amount',
            sortable: true,
            render: (val) => formatPrice(val),
        },
        { accessor: 'method', header: 'Method' },
        {
            accessor: 'status',
            header: 'Status',
            render: (status) => {
                const variants = { pending: 'warning', processing: 'info', completed: 'success', rejected: 'danger' };
                return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
            },
        },
    ];

    const transactionColumns = [
        { accessor: 'date', header: 'Date', sortable: true },
        { accessor: 'client', header: 'Client' },
        { accessor: 'professional', header: 'Professional' },
        { accessor: 'amount', header: 'Amount', sortable: true, render: (val) => formatPrice(val) },
        { accessor: 'commission', header: 'Commission', sortable: true, render: (val) => formatPrice(val) },
        { accessor: 'status', header: 'Status', render: (s) => <Badge variant={s === 'completed' ? 'success' : 'warning'}>{s}</Badge> },
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
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Payments & Payouts</h1>
                    <p className="text-earth-500 mt-1">Manage platform revenue and professional payouts</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-t-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                {activeTab === 'revenue' && (
                    <>
                        {/* Revenue Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
                            <AdminStatCard
                                icon="💰"
                                label="Total Revenue"
                                value={formatPrice(revenueData?.total_revenue)}
                                change="+22% from last month"
                                changeType="positive"
                            />
                            <AdminStatCard
                                icon="🏦"
                                label="Commission Earned"
                                value={formatPrice(revenueData?.total_commission)}
                                change="+18% from last month"
                                changeType="positive"
                            />
                            <AdminStatCard
                                icon="📈"
                                label="This Month"
                                value={formatPrice(revenueData?.this_month)}
                            />
                            <AdminStatCard
                                icon="📊"
                                label="Avg Transaction"
                                value={formatPrice(revenueData?.avg_transaction)}
                            />
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                            <h3 className="font-semibold text-earth-900 mb-4">Revenue Over Time</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData?.chart}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <Tooltip formatter={(value) => formatPrice(value)} />
                                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" />
                                        <Line type="monotone" dataKey="commission" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-earth-900">Recent Transactions</h3>
                            <ExportButton data={revenueData?.transactions} columns={transactionColumns} filename="transactions" />
                        </div>
                        <DataTable
                            data={revenueData?.transactions || []}
                            columns={transactionColumns}
                            searchPlaceholder="Search transactions..."
                        />
                    </>
                )}

                {activeTab === 'payouts' && (
                    <>
                        {/* Pending Payouts */}
                        <div className="mt-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-earth-900">Pending Payout Requests ({pendingPayouts.length})</h3>
                                {selectedPayouts.length > 0 && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setShowApproveModal(true)}
                                        >
                                            Approve ({selectedPayouts.length})
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600"
                                            onClick={() => setShowRejectModal(true)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <DataTable
                                data={pendingPayouts}
                                columns={payoutColumns}
                                emptyMessage="No pending payout requests"
                                selectedRows={selectedPayouts}
                                onSelectionChange={setSelectedPayouts}
                            />
                        </div>

                        {/* Payout History */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-earth-900">Payout History</h3>
                            <ExportButton data={processedPayouts} columns={payoutColumns} filename="payout_history" />
                        </div>
                        <DataTable
                            data={processedPayouts}
                            columns={payoutColumns}
                            searchPlaceholder="Search payout history..."
                            emptyMessage="No payout history"
                        />
                    </>
                )}
            </div>

            {/* Approve Modal */}
            <ConfirmModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Approve Payouts"
                message={`Are you sure you want to approve ${selectedPayouts.length} payout request(s)? This will process the payments.`}
                confirmText="Approve All"
                variant="primary"
                loading={processing}
            />

            {/* Reject Modal */}
            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Reject Payouts"
                message={`Are you sure you want to reject ${selectedPayouts.length} payout request(s)?`}
                confirmText="Reject All"
                variant="danger"
                loading={processing}
            />
        </div>
    );
};

// Mock Data
const mockRevenueData = {
    total_revenue: 248650,
    total_commission: 49730,
    this_month: 48650,
    avg_transaction: 95,
    chart: [
        { month: 'Aug', revenue: 22000, commission: 4400 },
        { month: 'Sep', revenue: 27500, commission: 5500 },
        { month: 'Oct', revenue: 33000, commission: 6600 },
        { month: 'Nov', revenue: 38500, commission: 7700 },
        { month: 'Dec', revenue: 42000, commission: 8400 },
        { month: 'Jan', revenue: 48650, commission: 9730 },
    ],
    transactions: [
        { id: 1, date: 'Jan 13, 2026', client: 'John Smith', professional: 'Dr. Sarah Williams', amount: 125, commission: 25, status: 'completed' },
        { id: 2, date: 'Jan 13, 2026', client: 'Sarah Johnson', professional: 'Dr. Michael Chen', amount: 95, commission: 19, status: 'completed' },
        { id: 3, date: 'Jan 12, 2026', client: 'Michael Brown', professional: 'Dr. Emily Roberts', amount: 75, commission: 15, status: 'completed' },
    ],
};

const mockPayouts = [
    { id: 1, professional: 'Dr. Sarah Williams', requested_at: 'Jan 12, 2026', amount: 2450, method: 'Bank Transfer', status: 'pending' },
    { id: 2, professional: 'Dr. Michael Chen', requested_at: 'Jan 11, 2026', amount: 1890, method: 'PayPal', status: 'pending' },
    { id: 3, professional: 'Dr. Emily Roberts', requested_at: 'Jan 10, 2026', amount: 1250, method: 'Bank Transfer', status: 'processing' },
    { id: 4, professional: 'Dr. Lisa Anderson', requested_at: 'Jan 8, 2026', amount: 980, method: 'PayPal', status: 'completed' },
    { id: 5, professional: 'Dr. James Wilson', requested_at: 'Jan 5, 2026', amount: 750, method: 'Bank Transfer', status: 'rejected' },
];

export default PaymentsManagement;
