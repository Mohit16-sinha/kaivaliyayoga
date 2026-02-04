import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Avatar, Badge, Tabs } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Client Detail page - Full client profile for professionals.
 */
const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        fetchClientDetail();
    }, [id]);

    const fetchClientDetail = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setClient(mockClientDetail);
        } catch (error) {
            console.error('Failed to fetch client:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'history', label: 'Appointment History' },
        { id: 'notes', label: 'Session Notes' },
        { id: 'health', label: 'Health Profile' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <p className="text-earth-500">Client not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/professional/clients" className="text-primary-600 hover:text-primary-700 text-sm">
                        ← Back to Clients
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <Avatar name={client.name} src={client.profile_image_url} size="xl" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-earth-900">{client.name}</h1>
                                {client.total_sessions >= 10 && <Badge variant="success">Loyal Client</Badge>}
                                <Badge variant={client.status === 'active' ? 'info' : 'warning'}>
                                    {client.status}
                                </Badge>
                            </div>
                            <p className="text-earth-600">{client.email}</p>
                            {client.phone && <p className="text-earth-600">{client.phone}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/professional/messages?client=${client.id}`)}
                            >
                                Message Client
                            </Button>
                            <Button variant="ghost">Book Appointment</Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-card p-4 text-center">
                        <p className="text-2xl font-bold text-earth-900">{client.total_sessions}</p>
                        <p className="text-sm text-earth-500">Total Sessions</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4 text-center">
                        <p className="text-2xl font-bold text-earth-900">{formatPrice(client.total_spent)}</p>
                        <p className="text-sm text-earth-500">Total Spent</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4 text-center">
                        <p className="text-2xl font-bold text-earth-900">{client.member_since}</p>
                        <p className="text-sm text-earth-500">Member Since</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-card p-4 text-center">
                        <p className="text-2xl font-bold text-earth-900">{client.last_seen}</p>
                        <p className="text-sm text-earth-500">Last Seen</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="p-6">
                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {client.appointments?.length === 0 ? (
                                    <p className="text-center text-earth-500 py-8">No appointment history</p>
                                ) : (
                                    client.appointments?.map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${apt.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`} />
                                                <div>
                                                    <p className="font-medium text-earth-900">{apt.service}</p>
                                                    <p className="text-sm text-earth-500">{apt.date} • {apt.duration} min</p>
                                                </div>
                                            </div>
                                            <Badge variant={apt.status === 'completed' ? 'success' : 'default'}>
                                                {apt.status}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-earth-900">Your Session Notes</h3>
                                    <Button variant="ghost" size="sm">+ Add Note</Button>
                                </div>
                                {client.session_notes?.length === 0 ? (
                                    <p className="text-center text-earth-500 py-8">
                                        No session notes yet. Add notes to track progress.
                                    </p>
                                ) : (
                                    client.session_notes?.map((note) => (
                                        <div key={note.id} className="p-4 border border-earth-200 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm text-earth-500">{note.date} • {note.session}</p>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </div>
                                            <p className="text-earth-900">{note.summary}</p>
                                            {note.recommendations && (
                                                <p className="text-sm text-earth-600 mt-2">
                                                    <strong>Recommendations:</strong> {note.recommendations}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'health' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ This health information was provided by the client. Always verify during consultations.
                                    </p>
                                </div>

                                {client.health_profile ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-earth-900 mb-2">Medical Conditions</h4>
                                            <p className="text-earth-600">{client.health_profile.medical_conditions || 'None specified'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-earth-900 mb-2">Allergies</h4>
                                            <p className="text-earth-600">{client.health_profile.allergies || 'None specified'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-earth-900 mb-2">Current Medications</h4>
                                            <p className="text-earth-600">{client.health_profile.medications || 'None specified'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-earth-900 mb-2">Emergency Contact</h4>
                                            <p className="text-earth-600">{client.health_profile.emergency_contact || 'Not provided'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-earth-500 py-8">
                                        Client has not provided health information yet.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock data
const mockClientDetail = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    total_sessions: 15,
    total_spent: 1875,
    member_since: 'Jun 2025',
    last_seen: '3 days ago',
    appointments: [
        { id: 1, service: '1-on-1 Yoga Therapy', date: 'Jan 10, 2026', duration: 60, status: 'completed' },
        { id: 2, service: 'Follow-up Session', date: 'Jan 3, 2026', duration: 45, status: 'completed' },
        { id: 3, service: '1-on-1 Yoga Therapy', date: 'Dec 27, 2025', duration: 60, status: 'completed' },
    ],
    session_notes: [
        {
            id: 1,
            date: 'Jan 10, 2026',
            session: '1-on-1 Yoga Therapy',
            summary: 'Good progress on lower back flexibility. Client reported 50% reduction in daily discomfort.',
            recommendations: 'Continue daily stretching routine. Add core strengthening exercises.',
        },
        {
            id: 2,
            date: 'Jan 3, 2026',
            session: 'Follow-up Session',
            summary: 'Reviewed home practice routine. Adjusted breathing techniques.',
        },
    ],
    health_profile: {
        medical_conditions: 'Chronic lower back pain',
        allergies: 'None',
        medications: 'Ibuprofen (as needed)',
        emergency_contact: 'Jane Smith - +1 (555) 987-6543',
    },
};

export default ClientDetail;
