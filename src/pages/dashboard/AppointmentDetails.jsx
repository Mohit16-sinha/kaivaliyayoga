import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Avatar, Card, Spinner } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Appointment Details page - View full appointment information.
 */
const AppointmentDetails = () => {
    const { id } = useParams();
    const { formatPrice } = useCurrency();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setAppointment(mockAppointment);
        } catch (error) {
            console.error('Failed to fetch appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-earth-900 mb-2">Appointment Not Found</h2>
                    <Link to="/appointments">
                        <Button variant="primary">Back to Appointments</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
        });
    };

    const isUpcoming = new Date(appointment.scheduled_at) > new Date();
    const isJoinable = () => {
        const date = new Date(appointment.scheduled_at);
        const now = new Date();
        const diffMs = date - now;
        const diffMinutes = diffMs / (1000 * 60);
        return diffMinutes <= 15 && diffMinutes >= -30;
    };

    const getStatusBadge = () => {
        if (appointment.status === 'cancelled') return <Badge variant="danger" size="lg">Cancelled</Badge>;
        if (appointment.status === 'completed') return <Badge variant="success" size="lg">Completed ✓</Badge>;
        return <Badge variant="success" size="lg">Confirmed ✓</Badge>;
    };

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb & Header */}
                <div className="mb-6">
                    <nav className="text-sm text-earth-500 mb-2">
                        <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
                        <span className="mx-2">/</span>
                        <Link to="/appointments" className="hover:text-primary-600">Appointments</Link>
                        <span className="mx-2">/</span>
                        <span className="text-earth-700">#{appointment.confirmation_number || `APT-${id}`}</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-earth-900">Appointment Details</h1>
                            {getStatusBadge()}
                        </div>
                        {isUpcoming && appointment.status !== 'cancelled' && (
                            <div className="flex gap-2">
                                <Button variant="ghost">Reschedule</Button>
                                <Button variant="ghost" className="text-red-500">Cancel</Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Professional Info Card */}
                    <Card>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <Avatar
                                src={appointment.professional?.profile_image_url}
                                name={appointment.professional?.name}
                                size="xl"
                                verified={appointment.professional?.is_verified}
                                className="w-24 h-24"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-earth-900">{appointment.professional?.name}</h2>
                                <p className="text-earth-500 mb-2">{appointment.professional?.specialization}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-medium">{appointment.professional?.rating || 4.9}</span>
                                    <span className="text-earth-400">({appointment.professional?.review_count || 127} reviews)</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/professional/${appointment.professional?.id}`}>
                                        <Button variant="ghost" size="sm">View Profile</Button>
                                    </Link>
                                    <Button variant="ghost" size="sm">Message</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Appointment Details */}
                    <Card title="Appointment Details">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-earth-500 mb-1">Service</p>
                                <p className="font-medium text-earth-900">{appointment.service?.name} ({appointment.duration} min)</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Date & Time</p>
                                <p className="font-medium text-earth-900">{formatDateTime(appointment.scheduled_at)}</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Location</p>
                                <p className="font-medium text-earth-900">{appointment.location_type === 'online' ? '📹 Online (Video Call)' : appointment.location}</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Appointment ID</p>
                                <p className="font-medium text-earth-900">{appointment.confirmation_number || `APT-2026-${id}`}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Join Meeting Card (if upcoming and joinable) */}
                    {isUpcoming && appointment.status !== 'cancelled' && isJoinable() && (
                        <Card className="border-2 border-primary-200 bg-primary-50">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-earth-900 mb-2">Join Your Video Appointment</h3>
                                <p className="text-earth-600 mb-4">Your meeting is ready. Click below to join.</p>
                                <Button variant="primary" size="lg">
                                    Join Now
                                </Button>
                                <p className="text-sm text-earth-500 mt-2">Meeting opens 10 minutes before scheduled time</p>
                            </div>
                        </Card>
                    )}

                    {/* Your Notes */}
                    {appointment.client_notes && (
                        <Card title="Your Notes">
                            <div className="space-y-3">
                                {appointment.client_notes.reason && (
                                    <div>
                                        <p className="text-sm text-earth-500 mb-1">Reason for consultation</p>
                                        <p className="text-earth-700">{appointment.client_notes.reason}</p>
                                    </div>
                                )}
                                {appointment.client_notes.concerns && (
                                    <div>
                                        <p className="text-sm text-earth-500 mb-1">Concerns</p>
                                        <p className="text-earth-700">{appointment.client_notes.concerns}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Session Notes (if completed) */}
                    {appointment.status === 'completed' && appointment.session_notes && (
                        <Card title="Session Notes from Professional">
                            <div className="prose prose-earth max-w-none">
                                <p className="text-earth-700">{appointment.session_notes.summary}</p>
                                {appointment.session_notes.recommendations && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-earth-900">Recommendations</h4>
                                        <p className="text-earth-700">{appointment.session_notes.recommendations}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Payment Information */}
                    <Card title="Payment Information">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-earth-500">Service fee</span>
                                <span className="text-earth-900">{formatPrice(appointment.service_fee || 89)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-earth-500">Platform fee</span>
                                <span className="text-earth-900">{formatPrice(appointment.platform_fee || 5)}</span>
                            </div>
                            <div className="border-t border-earth-100 pt-3 flex justify-between">
                                <span className="font-semibold text-earth-900">Total Paid</span>
                                <span className="font-bold text-primary-600">{formatPrice(appointment.total_price || 94)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-earth-400">
                                <span>Payment method</span>
                                <span>Visa **** {appointment.payment_last4 || '1234'}</span>
                            </div>
                            <div className="pt-3">
                                <Button variant="ghost" size="sm">
                                    📄 Download Receipt
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="ghost">📅 Add to Calendar</Button>
                            {isUpcoming && appointment.status !== 'cancelled' && (
                                <>
                                    <Button variant="ghost">Reschedule Appointment</Button>
                                    <Button variant="ghost" className="text-red-500">Cancel Appointment</Button>
                                </>
                            )}
                            {appointment.status === 'completed' && !appointment.has_review && (
                                <Button variant="primary">⭐ Leave a Review</Button>
                            )}
                            {appointment.status === 'completed' && (
                                <Button variant="ghost">Rebook with {appointment.professional?.name?.split(' ')[0]}</Button>
                            )}
                            <Button variant="ghost">Contact Support</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Mock data
const mockAppointment = {
    id: 1,
    confirmation_number: 'APT-2026-001234',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    location_type: 'online',
    status: 'confirmed',
    service_fee: 89,
    platform_fee: 5,
    total_price: 94,
    payment_last4: '1234',
    professional: {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'Therapeutic Yoga & Meditation',
        rating: 4.9,
        review_count: 127,
        is_verified: true,
    },
    service: {
        name: '1-on-1 Yoga Therapy Session',
    },
    client_notes: {
        reason: 'Looking for help with chronic back pain and stress management through yoga therapy.',
        concerns: 'Previous back injury from 2 years ago. Currently on no medications.',
    },
};

export default AppointmentDetails;
