import React, { useState, useEffect } from 'react';
import { Button, Spinner, Badge, EmptyState } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Professional Services Management page.
 */
const Services = () => {
    const { formatPrice, currency } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 60,
        price: '',
        is_active: true,
        session_type: 'online',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setServices(mockServices);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrEdit = async () => {
        console.log('Save service:', formData);
        setShowAddModal(false);
        setEditingService(null);
        setFormData({ name: '', description: '', duration: 60, price: '', is_active: true, session_type: 'online' });
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price.toString(),
            is_active: service.is_active,
            session_type: service.session_type,
        });
        setShowAddModal(true);
    };

    const handleToggleActive = (serviceId) => {
        setServices(services.map(s =>
            s.id === serviceId ? { ...s, is_active: !s.is_active } : s
        ));
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">My Services</h1>
                        <p className="text-earth-500 mt-1">Manage your offered services and pricing</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        + Add Service
                    </Button>
                </div>

                {services.length === 0 ? (
                    <EmptyState
                        title="No Services Yet"
                        description="Add your first service to start accepting bookings."
                    >
                        <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Add Service</Button>
                    </EmptyState>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`bg-white rounded-xl shadow-card p-6 ${!service.is_active ? 'opacity-60' : ''}`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-earth-900">{service.name}</h3>
                                            <Badge variant={service.is_active ? 'success' : 'default'}>
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <Badge variant="info" size="sm">
                                                {service.session_type === 'online' ? '📹 Online' : '📍 In-person'}
                                            </Badge>
                                        </div>
                                        <p className="text-earth-600 text-sm mb-3">{service.description}</p>
                                        <div className="flex items-center gap-6 text-sm">
                                            <span className="text-earth-500">
                                                ⏱️ {service.duration} minutes
                                            </span>
                                            <span className="font-semibold text-primary-600">
                                                {formatPrice(service.price)}
                                            </span>
                                            <span className="text-earth-400">
                                                {service.bookings_count || 0} bookings
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleActive(service.id)}
                                        >
                                            {service.is_active ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Service Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-earth-100">
                            <h2 className="text-xl font-semibold text-earth-900">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Service Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., 1-on-1 Yoga Therapy"
                                    className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="Describe what clients can expect..."
                                    className="w-full px-4 py-2 border border-earth-200 rounded-lg resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Duration (mins)</label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                    >
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>60 minutes</option>
                                        <option value={90}>90 minutes</option>
                                        <option value={120}>120 minutes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Price ({currency})</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Session Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="session_type"
                                            value="online"
                                            checked={formData.session_type === 'online'}
                                            onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                                        />
                                        <span>Online</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="session_type"
                                            value="in_person"
                                            checked={formData.session_type === 'in_person'}
                                            onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                                        />
                                        <span>In-person</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="session_type"
                                            value="both"
                                            checked={formData.session_type === 'both'}
                                            onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                                        />
                                        <span>Both</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-earth-100 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => { setShowAddModal(false); setEditingService(null); }}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAddOrEdit}>
                                {editingService ? 'Save Changes' : 'Add Service'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const mockServices = [
    { id: 1, name: '1-on-1 Yoga Therapy', description: 'Personalized yoga sessions for your specific health goals.', duration: 60, price: 125, is_active: true, session_type: 'online', bookings_count: 48 },
    { id: 2, name: 'Initial Consultation', description: 'Comprehensive assessment and personalized plan creation.', duration: 45, price: 75, is_active: true, session_type: 'online', bookings_count: 23 },
    { id: 3, name: 'Follow-up Session', description: 'Check progress and adjust your practice plan.', duration: 30, price: 50, is_active: true, session_type: 'online', bookings_count: 67 },
    { id: 4, name: 'Group Session', description: 'Small group yoga class (max 5 participants).', duration: 60, price: 35, is_active: false, session_type: 'online', bookings_count: 12 },
];

export default Services;
