import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner, EmptyState, Avatar, Badge } from '../../components/ui';
import ClientCard from '../../components/professional/ClientCard';

/**
 * Professional Clients page - CRM for managing clients.
 */
const Clients = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setClients(mockClients);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients
        .filter(client => {
            if (statusFilter === 'active') return client.status === 'active';
            if (statusFilter === 'inactive') return client.status === 'inactive';
            return true;
        })
        .filter(client => {
            if (!searchQuery) return true;
            return (
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'sessions':
                    return b.total_sessions - a.total_sessions;
                case 'recent':
                default:
                    return new Date(b.last_session) - new Date(a.last_session);
            }
        });

    const handleMessage = (client) => {
        navigate(`/professional/messages?client=${client.id}`);
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">My Clients</h1>
                        <p className="text-earth-500 mt-1">{clients.length} total clients</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search clients by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            >
                                <option value="all">All Clients</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-earth-200 rounded-lg text-sm"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="name">Name A-Z</option>
                                <option value="sessions">Most Sessions</option>
                            </select>
                            <div className="flex gap-1 border border-earth-200 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-earth-500'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-earth-500'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : filteredClients.length === 0 ? (
                    <EmptyState
                        title="No Clients Yet"
                        description="Your clients will appear here after you complete your first session."
                    />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onMessage={handleMessage}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-earth-50 border-b border-earth-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Sessions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Last Session</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Next Appointment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-100">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-earth-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={client.name} size="sm" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-earth-900">{client.name}</p>
                                                        {client.total_sessions >= 10 && <Badge variant="success" size="sm">Loyal</Badge>}
                                                    </div>
                                                    <p className="text-sm text-earth-500">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-earth-900">{client.total_sessions}</td>
                                        <td className="px-6 py-4 text-earth-600">
                                            {client.last_session ? new Date(client.last_session).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-earth-600">
                                            {client.next_appointment || 'None scheduled'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={client.status === 'active' ? 'success' : 'warning'}>
                                                {client.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/professional/clients/${client.id}`}>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleMessage(client)}>Message</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mock data
const mockClients = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        total_sessions: 15,
        status: 'active',
        last_session: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        next_appointment: 'Jan 15, 2:00 PM',
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        total_sessions: 8,
        status: 'active',
        last_session: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        name: 'Michael Brown',
        email: 'michael@example.com',
        total_sessions: 3,
        status: 'active',
        last_session: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        total_sessions: 12,
        status: 'inactive',
        last_session: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        name: 'David Wilson',
        email: 'david@example.com',
        total_sessions: 6,
        status: 'active',
        last_session: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        next_appointment: 'Jan 18, 10:00 AM',
    },
];

export default Clients;
