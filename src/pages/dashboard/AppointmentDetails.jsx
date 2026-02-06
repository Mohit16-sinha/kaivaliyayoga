import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Avatar, Card, Spinner } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';
import appointmentService from '../../services/appointmentService';
import { downloadInvoice } from '../../services/paymentService'; // Import payment service

/**
 * Appointment Details page - View full appointment information.
 */
const AppointmentDetails = () => {
    const { id } = useParams();
    const { formatPrice } = useCurrency();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        setLoading(true);
        try {
            const data = await appointmentService.getById(id);
            setAppointment(data);
        } catch (error) {
            console.error('Failed to fetch appointment:', error);
            // Fallback to mock if API fails (optional, good for dev)
            // setAppointment(mockAppointment); 
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async () => {
        if (!appointment?.payment_id) {
            alert('No payment record found for this appointment.');
            return;
        }

        setDownloading(true);
        try {
            await downloadInvoice(appointment.payment_id);
        } catch (error) {
            console.error('Download failed:', error);
            alert(`Failed to download receipt: ${error.message}`);
        } finally {
            setDownloading(false);
        }
    };

    const handleCalendar = () => {
        alert("Add to Calendar feature is coming soon!");
    };

    const handleReschedule = () => {
        alert("Reschedule feature is currently under maintenance. Please contact support.");
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            alert("Cancellation request sent. (Feature coming soon)");
        }
    };

    const handleSupport = () => {
        window.location.href = "/contact";
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

    // Helper for safe date
    const safeDate = (d) => d ? new Date(d) : new Date();
    const isUpcoming = safeDate(appointment.start_time || appointment.scheduled_at) > new Date();
    const scheduledAt = appointment.start_time || appointment.scheduled_at;

    const isJoinable = () => {
        const date = safeDate(scheduledAt);
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

    // Safe accessors
    const professionalName = appointment.professional?.user?.name || appointment.professional?.name || 'Professional';
    const professionalImage = appointment.professional?.user?.profile_image_url || appointment.professional?.profile_image_url;
    const serviceName = appointment.service?.name || appointment.service_name || 'Yoga Session';

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
                        <span className="text-earth-700">#{appointment.id}</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-earth-900">Appointment Details</h1>
                            {getStatusBadge()}
                        </div>
                        {isUpcoming && appointment.status !== 'cancelled' && (
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={handleReschedule}>Reschedule</Button>
                                <Button variant="ghost" className="text-red-500" onClick={handleCancel}>Cancel</Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Professional Info Card */}
                    <Card>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <Avatar
                                src={professionalImage}
                                name={professionalName}
                                size="xl"
                                verified={appointment.professional?.is_verified}
                                className="w-24 h-24"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-earth-900">{professionalName}</h2>
                                <p className="text-earth-500 mb-2">{appointment.professional?.specialization || 'Yoga Instructor'}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-earth-400">Professional ID: {appointment.professional_id}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/professional/${appointment.professional_id}`}>
                                        <Button variant="ghost" size="sm">View Profile</Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={() => alert('Message feature coming soon')}>Message</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Appointment Details */}
                    <Card title="Appointment Details">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-earth-500 mb-1">Service</p>
                                <p className="font-medium text-earth-900">{serviceName} ({appointment.duration || 60} min)</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Date & Time</p>
                                <p className="font-medium text-earth-900">{scheduledAt ? formatDateTime(scheduledAt) : 'TBD'}</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Location</p>
                                <p className="font-medium text-earth-900">Online (Video Call)</p>
                            </div>
                            <div>
                                <p className="text-earth-500 mb-1">Booking Ref</p>
                                <p className="font-medium text-earth-900">APT-{appointment.id}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Join Meeting Card (if upcoming and joinable) */}
                    {isUpcoming && appointment.status !== 'cancelled' && isJoinable() && (
                        <Card className="border-2 border-primary-200 bg-primary-50">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-earth-900 mb-2">Join Your Video Appointment</h3>
                                <p className="text-earth-600 mb-4">Your meeting is ready. Click below to join.</p>
                                <Button variant="primary" size="lg" onClick={() => window.open(appointment.meeting_link || '#', '_blank')}>
                                    Join Now
                                </Button>
                                <p className="text-sm text-earth-500 mt-2">Meeting opens 10 minutes before scheduled time</p>
                            </div>
                        </Card>
                    )}

                    {/* Payment Information */}
                    <Card title="Payment Information">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-semibold text-earth-900">Total Paid</span>
                                <span className="font-bold text-primary-600">{formatPrice(appointment.payment?.amount || 0)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-earth-400">
                                <span>Status</span>
                                <span className="uppercase">{appointment.payment?.status || 'Unknown'}</span>
                            </div>
                            <div className="pt-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDownloadReceipt}
                                    disabled={downloading || !appointment.payment_id}
                                >
                                    {downloading ? 'Downloading...' : '📄 Download Receipt'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="ghost" onClick={handleCalendar}>📅 Add to Calendar</Button>
                            {isUpcoming && appointment.status !== 'cancelled' && (
                                <>
                                    <Button variant="ghost" onClick={handleReschedule}>Reschedule Appointment</Button>
                                    <Button variant="ghost" className="text-red-500" onClick={handleCancel}>Cancel Appointment</Button>
                                </>
                            )}
                            <Button variant="ghost" onClick={handleSupport}>Contact Support</Button>
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
