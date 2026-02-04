import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner, Badge, Avatar } from '../../components/ui';
import { DataTable, ActionDropdown, ActionItem, ConfirmModal, ExportButton } from '../../components/admin';

/**
 * User Management page - Manage all users on the platform.
 */
const UserManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ status: '', activity: '' });
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(mockUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUsers(users.map(u =>
                u.id === selectedUser.id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
            ));
            setShowSuspendModal(false);
            setSelectedUser(null);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        } finally {
            setProcessing(false);
        }
    };

    const filteredUsers = users.filter(u => {
        if (filters.status && u.status !== filters.status) return false;
        if (filters.activity === 'active' && u.last_active_days > 7) return false;
        if (filters.activity === 'inactive' && u.last_active_days <= 30) return false;
        return true;
    });

    const columns = [
        {
            accessor: 'name',
            header: 'User',
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
        { accessor: 'joined_date', header: 'Joined', sortable: true },
        { accessor: 'total_bookings', header: 'Bookings', sortable: true },
        {
            accessor: 'total_spent',
            header: 'Total Spent',
            sortable: true,
            render: (val) => `$${val?.toLocaleString()}`,
        },
        {
            accessor: 'last_active',
            header: 'Last Active',
            sortable: true,
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
    ];

    const exportColumns = [
        { accessor: 'name', header: 'Name' },
        { accessor: 'email', header: 'Email' },
        { accessor: 'joined_date', header: 'Joined' },
        { accessor: 'total_bookings', header: 'Bookings' },
        { accessor: 'total_spent', header: 'Total Spent' },
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
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">User Management</h1>
                        <p className="text-earth-500 mt-1">{users.length} users registered</p>
                    </div>
                    <ExportButton data={filteredUsers} columns={exportColumns} filename="users" />
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
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <select
                            value={filters.activity}
                            onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
                            className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                        >
                            <option value="">Activity Level</option>
                            <option value="active">Active (7 days)</option>
                            <option value="inactive">Inactive (30+ days)</option>
                        </select>
                        {(filters.status || filters.activity) && (
                            <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', activity: '' })}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    searchPlaceholder="Search users..."
                    emptyMessage="No users found"
                    actions={(row) => (
                        <ActionDropdown>
                            <ActionItem icon="👤" onClick={() => navigate(`/admin/users/${row.id}`)}>
                                View Profile
                            </ActionItem>
                            <ActionItem icon="📅" onClick={() => navigate(`/admin/appointments?user=${row.id}`)}>
                                Booking History
                            </ActionItem>
                            <ActionItem icon="📧" onClick={() => console.log('Send email to', row.email)}>
                                Send Email
                            </ActionItem>
                            <ActionItem icon="🔑" onClick={() => console.log('Reset password for', row.email)}>
                                Reset Password
                            </ActionItem>
                            <ActionItem
                                icon={row.status === 'suspended' ? '✓' : '⏸'}
                                onClick={() => { setSelectedUser(row); setShowSuspendModal(true); }}
                            >
                                {row.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                            </ActionItem>
                            <ActionItem icon="🗑" variant="danger" onClick={() => { setSelectedUser(row); setShowDeleteModal(true); }}>
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
                title={selectedUser?.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                message={selectedUser?.status === 'suspended'
                    ? `Are you sure you want to unsuspend ${selectedUser?.name}?`
                    : `Are you sure you want to suspend ${selectedUser?.name}? They will not be able to book sessions.`}
                confirmText={selectedUser?.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                variant={selectedUser?.status === 'suspended' ? 'primary' : 'warning'}
                loading={processing}
            />

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                loading={processing}
            />
        </div>
    );
};

// Mock Data
const mockUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', joined_date: 'Jun 2024', total_bookings: 24, total_spent: 2850, last_active: '2 hours ago', last_active_days: 0, status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', joined_date: 'Jul 2024', total_bookings: 18, total_spent: 2160, last_active: '1 day ago', last_active_days: 1, status: 'active' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', joined_date: 'Aug 2024', total_bookings: 12, total_spent: 1440, last_active: '5 days ago', last_active_days: 5, status: 'active' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', joined_date: 'Sep 2024', total_bookings: 8, total_spent: 960, last_active: '2 weeks ago', last_active_days: 14, status: 'active' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', joined_date: 'Oct 2024', total_bookings: 3, total_spent: 360, last_active: '1 month ago', last_active_days: 35, status: 'suspended' },
];

export default UserManagement;
