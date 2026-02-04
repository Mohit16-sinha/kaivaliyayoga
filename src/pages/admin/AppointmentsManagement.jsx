import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner, Badge, Avatar } from '../../components/ui';
import { DataTable, ActionDropdown, ActionItem, ConfirmModal, ExportButton } from '../../components/admin';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Appointments Management page - View and manage all platform appointments.
 */
const AppointmentsManagement = () => {
    const [searchParams] = useSearchParams();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        profession: '',
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAppointments(mockAppointments);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAppointments(appointments.map(a =>
                a.id === selectedAppointment.id ? { ...a, status: 'refunded' } : a
            ));
            setShowRefundModal(false);
            setSelectedAppointment(null);
        } finally {
            setProcessing(false);
        }
    };

    const filteredAppointments = appointments.filter(a => {
        if (filters.status && a.status !== filters.status) return false;
        if (filters.profession && a.profession !== filters.profession) return false;
        return true;
    });

    const columns = [
        { accessor: 'date', header: 'Date & Time', sortable: true },
        {
            accessor: 'client',
            header: 'Client',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Avatar name={row.client} size="sm" />
                    <span className="text-sm">{row.client}</span>
                </div>
            ),
        },
        {
            accessor: 'professional',
            header: 'Professional',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Avatar name={row.professional} size="sm" />
                    <div>
                        <p className="text-sm font-medium">{row.professional}</p>
                        <p className="text-xs text-earth-500">{row.profession}</p>
                    </div>
                </div>
            ),
        },
        { accessor: 'service', header: 'Service' },
        {
            accessor: 'amount',
            header: 'Amount',
            sortable: true,
            render: (val) => formatPrice(val),
        },
        {
            accessor: 'status',
            header: 'Status',
            render: (status) => {
                const variants = {
                    completed: 'success',
                    confirmed: 'info',
                    pending: 'warning',
                    cancelled: 'default',
                    refunded: 'danger',
                };
                return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
            },
        },
    ];

    const exportColumns = [
        { accessor: 'date', header: 'Date' },
        { accessor: 'client', header: 'Client' },
        { accessor: 'professional', header: 'Professional' },
        { accessor: 'profession', header: 'Profession' },
        { accessor: 'service', header: 'Service' },
        { accessor: 'amount', header: 'Amount' },
        { accessor: 'status', header: 'Status' },
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Appointments</h1>
                        <p className="text-earth-500 mt-1">{appointments.length} total appointments</p>
                    </div>
                    <ExportButton data={filteredAppointments} columns={exportColumns} filename="appointments" />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <select
                            value={filters.profession}
                            onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">All Professions</option>
                            <option value="Yoga Therapist">Yoga Therapist</option>
                            <option value="Nutritionist">Nutritionist</option>
                            <option value="Meditation Coach">Meditation Coach</option>
                        </select>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            placeholder="To"
                        />
                        {(filters.status || filters.profession || filters.dateFrom || filters.dateTo) && (
                            <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', profession: '', dateFrom: '', dateTo: '' })}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    data={filteredAppointments}
                    columns={columns}
                    searchPlaceholder="Search by client or professional..."
                    emptyMessage="No appointments found"
                    onRowClick={setSelectedAppointment}
                    actions={(row) => (
                        <ActionDropdown>
                            <ActionItem icon="👁" onClick={() => setSelectedAppointment(row)}>
                                View Details
                            </ActionItem>
                            {(row.status === 'completed' || row.status === 'confirmed') && (
                                <ActionItem icon="💸" variant="danger" onClick={() => { setSelectedAppointment(row); setShowRefundModal(true); }}>
                                    Issue Refund
                                </ActionItem>
                            )}
                        </ActionDropdown>
                    )}
                />
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && !showRefundModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAppointment(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-earth-900">Appointment Details</h3>
                            <button onClick={() => setSelectedAppointment(null)} className="text-earth-400 hover:text-earth-600">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-earth-500 text-sm">Date & Time</p>
                                    <p className="font-medium">{selectedAppointment.date}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500 text-sm">Status</p>
                                    <Badge variant={selectedAppointment.status === 'completed' ? 'success' : 'info'}>
                                        {selectedAppointment.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-earth-500 text-sm">Client</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Avatar name={selectedAppointment.client} size="sm" />
                                        <span className="font-medium">{selectedAppointment.client}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-earth-500 text-sm">Professional</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Avatar name={selectedAppointment.professional} size="sm" />
                                        <span className="font-medium">{selectedAppointment.professional}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-earth-500 text-sm">Service</p>
                                <p className="font-medium">{selectedAppointment.service}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-earth-100">
                                <div>
                                    <p className="text-earth-500 text-sm">Amount</p>
                                    <p className="text-xl font-bold text-primary-600">{formatPrice(selectedAppointment.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500 text-sm">Platform Fee (20%)</p>
                                    <p className="font-medium">{formatPrice(selectedAppointment.amount * 0.2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-earth-100">
                            <Button variant="ghost" className="flex-1" onClick={() => setSelectedAppointment(null)}>Close</Button>
                            {(selectedAppointment.status === 'completed' || selectedAppointment.status === 'confirmed') && (
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-red-600"
                                    onClick={() => setShowRefundModal(true)}
                                >
                                    Issue Refund
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            <ConfirmModal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                onConfirm={handleRefund}
                title="Issue Refund"
                message={`Are you sure you want to issue a full refund of ${formatPrice(selectedAppointment?.amount)} to ${selectedAppointment?.client}? This will also reverse the professional's payment.`}
                confirmText="Issue Refund"
                variant="danger"
                loading={processing}
            />
        </div>
    );
};

// Mock Data
const mockAppointments = [
    { id: 1, date: 'Jan 15, 2026 2:00 PM', client: 'John Smith', professional: 'Dr. Sarah Williams', profession: 'Yoga Therapist', service: '1-on-1 Yoga Therapy', amount: 125, status: 'confirmed' },
    { id: 2, date: 'Jan 14, 2026 10:00 AM', client: 'Sarah Johnson', professional: 'Dr. Michael Chen', profession: 'Nutritionist', service: 'Nutrition Consultation', amount: 95, status: 'completed' },
    { id: 3, date: 'Jan 13, 2026 3:30 PM', client: 'Michael Brown', professional: 'Dr. Emily Roberts', profession: 'Meditation Coach', service: 'Guided Meditation', amount: 75, status: 'completed' },
    { id: 4, date: 'Jan 12, 2026 11:00 AM', client: 'Emily Davis', professional: 'Dr. Sarah Williams', profession: 'Yoga Therapist', service: 'Follow-up Session', amount: 80, status: 'cancelled' },
    { id: 5, date: 'Jan 11, 2026 4:00 PM', client: 'David Wilson', professional: 'Dr. Lisa Anderson', profession: 'Yoga Therapist', service: '1-on-1 Yoga Therapy', amount: 125, status: 'refunded' },
];

export default AppointmentsManagement;
