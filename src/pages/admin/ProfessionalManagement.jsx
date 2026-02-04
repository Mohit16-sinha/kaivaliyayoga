import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner, Badge, Avatar, Tabs } from '../../components/ui';
import { DataTable, ActionDropdown, ActionItem, ConfirmModal, ExportButton } from '../../components/admin';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Professional Management page - Manage all professionals on the platform.
 */
const ProfessionalManagement = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [professionals, setProfessionals] = useState([]);
    const [filters, setFilters] = useState({ profession: '', status: '', rating: '' });
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setProfessionals(mockProfessionals);
        } catch (error) {
            console.error('Failed to fetch professionals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfessionals(professionals.map(p =>
                p.id === selectedProfessional.id ? { ...p, status: p.status === 'suspended' ? 'active' : 'suspended' } : p
            ));
            setShowSuspendModal(false);
            setSelectedProfessional(null);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfessionals(professionals.filter(p => p.id !== selectedProfessional.id));
            setShowDeleteModal(false);
            setSelectedProfessional(null);
        } finally {
            setProcessing(false);
        }
    };

    const filteredProfessionals = professionals.filter(p => {
        if (filters.profession && p.profession !== filters.profession) return false;
        if (filters.status && p.status !== filters.status) return false;
        if (filters.rating && p.rating < parseFloat(filters.rating)) return false;
        return true;
    });

    const columns = [
        {
            accessor: 'name',
            header: 'Professional',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={row.name} src={row.avatar} size="sm" />
                    <div>
                        <p className="font-medium text-earth-900">{row.name}</p>
                        <p className="text-xs text-earth-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { accessor: 'profession', header: 'Profession', sortable: true },
        {
            accessor: 'rating',
            header: 'Rating',
            sortable: true,
            render: (rating) => (
                <span className="flex items-center gap-1">
                    ⭐ {rating?.toFixed(1)} <span className="text-earth-400">({Math.floor(Math.random() * 50) + 10})</span>
                </span>
            ),
        },
        { accessor: 'total_sessions', header: 'Sessions', sortable: true },
        {
            accessor: 'total_earnings',
            header: 'Earnings',
            sortable: true,
            render: (val) => formatPrice(val),
        },
        {
            accessor: 'status',
            header: 'Status',
            render: (status) => (
                <Badge variant={status === 'active' ? 'success' : status === 'suspended' ? 'danger' : 'warning'}>
                    {status}
                </Badge>
            ),
        },
        { accessor: 'joined_date', header: 'Joined', sortable: true },
    ];

    const exportColumns = [
        { accessor: 'name', header: 'Name' },
        { accessor: 'email', header: 'Email' },
        { accessor: 'profession', header: 'Profession' },
        { accessor: 'rating', header: 'Rating' },
        { accessor: 'total_sessions', header: 'Sessions' },
        { accessor: 'total_earnings', header: 'Earnings' },
        { accessor: 'status', header: 'Status' },
        { accessor: 'joined_date', header: 'Joined' },
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
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Professional Management</h1>
                        <p className="text-earth-500 mt-1">{professionals.length} professionals registered</p>
                    </div>
                    <ExportButton data={filteredProfessionals} columns={exportColumns} filename="professionals" />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.profession}
                            onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">All Professions</option>
                            <option value="Yoga Therapist">Yoga Therapist</option>
                            <option value="Nutritionist">Nutritionist</option>
                            <option value="Meditation Coach">Meditation Coach</option>
                            <option value="Fitness Coach">Fitness Coach</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            value={filters.rating}
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">Any Rating</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                        </select>
                        {(filters.profession || filters.status || filters.rating) && (
                            <Button variant="ghost" size="sm" onClick={() => setFilters({ profession: '', status: '', rating: '' })}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    data={filteredProfessionals}
                    columns={columns}
                    searchPlaceholder="Search professionals..."
                    emptyMessage="No professionals found"
                    actions={(row) => (
                        <ActionDropdown>
                            <ActionItem icon="👤" onClick={() => navigate(`/professional/${row.id}`)}>
                                View Profile
                            </ActionItem>
                            <ActionItem icon="📅" onClick={() => navigate(`/admin/appointments?professional=${row.id}`)}>
                                View Appointments
                            </ActionItem>
                            <ActionItem icon="💰" onClick={() => navigate(`/admin/payments?professional=${row.id}`)}>
                                View Earnings
                            </ActionItem>
                            <ActionItem
                                icon={row.status === 'suspended' ? '✓' : '⏸'}
                                onClick={() => { setSelectedProfessional(row); setShowSuspendModal(true); }}
                            >
                                {row.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                            </ActionItem>
                            <ActionItem icon="🗑" variant="danger" onClick={() => { setSelectedProfessional(row); setShowDeleteModal(true); }}>
                                Delete
                            </ActionItem>
                        </ActionDropdown>
                    )}
                />
            </div>

            {/* Suspend Modal */}
            <ConfirmModal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                onConfirm={handleSuspend}
                title={selectedProfessional?.status === 'suspended' ? 'Unsuspend Professional' : 'Suspend Professional'}
                message={selectedProfessional?.status === 'suspended'
                    ? `Are you sure you want to unsuspend ${selectedProfessional?.name}? They will be able to accept new bookings.`
                    : `Are you sure you want to suspend ${selectedProfessional?.name}? They will not be able to accept new bookings.`}
                confirmText={selectedProfessional?.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                variant={selectedProfessional?.status === 'suspended' ? 'primary' : 'warning'}
                loading={processing}
            />

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Professional"
                message={`Are you sure you want to permanently delete ${selectedProfessional?.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                loading={processing}
            />
        </div>
    );
};

// Mock Data
const mockProfessionals = [
    { id: 1, name: 'Dr. Sarah Williams', email: 'sarah@example.com', profession: 'Yoga Therapist', rating: 4.9, total_sessions: 248, total_earnings: 31250, status: 'active', joined_date: 'Jun 2024' },
    { id: 2, name: 'Dr. Michael Chen', email: 'michael@example.com', profession: 'Nutritionist', rating: 4.7, total_sessions: 156, total_earnings: 19500, status: 'active', joined_date: 'Aug 2024' },
    { id: 3, name: 'Dr. Emily Roberts', email: 'emily@example.com', profession: 'Meditation Coach', rating: 4.8, total_sessions: 189, total_earnings: 14175, status: 'active', joined_date: 'Sep 2024' },
    { id: 4, name: 'Dr. James Wilson', email: 'james@example.com', profession: 'Fitness Coach', rating: 4.5, total_sessions: 92, total_earnings: 8280, status: 'suspended', joined_date: 'Oct 2024' },
    { id: 5, name: 'Dr. Lisa Anderson', email: 'lisa@example.com', profession: 'Yoga Therapist', rating: 4.6, total_sessions: 134, total_earnings: 16750, status: 'active', joined_date: 'Nov 2024' },
];

export default ProfessionalManagement;
