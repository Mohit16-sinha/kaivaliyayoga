import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Avatar, Card, Tabs, Spinner, EmptyState } from '../../components/ui';
import professionalService from '../../services/professionalService';
import appointmentService from '../../services/appointmentService';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { initiateRazorpayPayment, getPayPalConfig, createPayPalOrder, capturePayPalOrder } from '../../services/paymentService';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';

// Fully Functional Booking Modal Component
const BookingModal = ({ isOpen, onClose, professional, service, services = [] }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState(service?.id || '');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'paypal'
    const [paypalClientId, setPaypalClientId] = useState(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedDate('');
            setSelectedTime('');
            setSelectedServiceId(service?.id || (services[0]?.id || ''));
            setNotes('');
            setError('');
            setSuccess(false);
            setPaymentMethod('razorpay');

            // Fetch PayPal Config
            getPayPalConfig().then(config => {
                if (config?.client_id) setPaypalClientId(config.client_id);
            }).catch(err => console.error("Failed to load PayPal config", err));
        }
    }, [isOpen, service, services]);

    if (!isOpen) return null;

    // Common appointment data builder
    const buildAppointmentData = () => {
        const selectedSvc = services.find(s => String(s.id) === String(selectedServiceId)) || service;
        const durationMinutes = selectedSvc?.duration_minutes || selectedSvc?.duration || 60;
        const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

        return {
            professional_id: String(professional?.id),
            service_id: String(selectedServiceId),
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            client_notes: notes,
            // Helper for payment amount
            priceInPaise: (selectedSvc?.price_cents || selectedSvc?.price * 100 || 5000),
            price: (selectedSvc?.price_cents / 100 || selectedSvc?.price || 50),
            currency: selectedSvc?.currency || 'USD',
            serviceName: selectedSvc?.name || 'Service'
        };
    };

    const handleRazorpaySubmit = async (e) => {
        e?.preventDefault();
        setError('');

        if (!user) {
            setError('Please sign in to book an appointment');
            setTimeout(() => {
                onClose();
                navigate('/signin', { state: { from: `/professional/${professional?.id}` } });
            }, 1500);
            return;
        }

        if (!selectedDate || !selectedTime || !selectedServiceId) {
            setError('Please fill in all required fields');
            return;
        }

        const data = buildAppointmentData();
        setIsSubmitting(true);

        try {
            // Step 1: Initiate Payment via Razorpay
            await initiateRazorpayPayment({
                amount: data.priceInPaise, // Amount in paise
                description: `Appointment with ${professional?.name || professional?.user?.name || 'Professional'} - ${data.serviceName}`,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || '',
                },
                onSuccess: async (paymentData) => {
                    try {
                        // Step 2: After payment success, create the appointment
                        const finalAppointmentData = {
                            professional_id: data.professional_id,
                            service_id: data.service_id,
                            start_time: data.start_time,
                            end_time: data.end_time,
                            client_notes: data.client_notes,
                            payment_id: paymentData.payment_id
                        };
                        await appointmentService.create(finalAppointmentData);
                        setSuccess(true);
                        setTimeout(() => {
                            onClose();
                            navigate('/dashboard/appointments');
                        }, 2000);
                    } catch (aptErr) {
                        console.error('Appointment creation error:', aptErr);
                        setError('Payment successful but booking failed. Please contact support with payment ID: ' + paymentData.razorpay_payment_id);
                        setIsSubmitting(false);
                    }
                },
                onError: (error) => {
                    console.error('Payment error:', error);
                    setError(error.message || 'Payment failed. Please try again.');
                    setIsSubmitting(false);
                },
            });
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.error || err.message || 'Failed to initiate payment. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-earth-900">Book Appointment</h3>
                    <button onClick={onClose} className="text-earth-400 hover:text-earth-600" disabled={isSubmitting}>
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-earth-900 mb-2">Booking Confirmed!</h4>
                        <p className="text-earth-500">Redirecting to your appointments...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Professional Info */}
                        <div className="flex items-center gap-4 p-4 bg-earth-50 rounded-lg">
                            <Avatar src={professional?.user?.profile_image_url || professional?.profile_image_url} name={professional?.user?.name || professional?.name} size="md" />
                            <div>
                                <p className="font-semibold text-earth-900">{professional?.user?.name || professional?.name || 'Professional'}</p>
                                <p className="text-sm text-earth-500">{professional?.title || professional?.specialization}</p>
                            </div>
                        </div>

                        {/* Service Selection */}
                        {services.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Select Service</label>
                                <select
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="w-full bg-white text-earth-900 border border-earth-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    required
                                >
                                    {services.map((svc) => (
                                        <option key={svc.id} value={svc.id}>
                                            {svc.name} - {formatPrice(svc.price_cents / 100)} ({svc.duration_minutes} min)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-white text-earth-900 border border-earth-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>

                        {/* Time Selection */}
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Select Time</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full bg-white text-earth-900 border border-earth-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                            >
                                <option value="">Choose a time slot...</option>
                                <option value="09:00">09:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="17:00">05:00 PM</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-white text-earth-900 border border-earth-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows="3"
                                placeholder="Anything you want the professional to know?"
                            />
                        </div>

                        {/* Payment Method Selection */}
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('razorpay')}
                                    className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === 'razorpay'
                                        ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium ring-1 ring-primary-600'
                                        : 'border-earth-200 text-earth-600 hover:border-earth-300'
                                        }`}
                                >
                                    Razorpay (Card/UPI)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === 'paypal'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-600'
                                        : 'border-earth-200 text-earth-600 hover:border-earth-300'
                                        }`}
                                >
                                    PayPal
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 flex gap-3 flex-col sm:flex-row">
                            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>

                            {paymentMethod === 'razorpay' ? (
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="flex-1"
                                    disabled={isSubmitting}
                                    onClick={handleRazorpaySubmit}
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm & Pay (Razorpay)'}
                                </Button>
                            ) : (
                                <div className="flex-1">
                                    {paypalClientId ? (
                                        <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
                                            <PayPalButtons
                                                style={{ layout: "horizontal", height: 44 }}
                                                forceReRender={[selectedServiceId, selectedDate, selectedTime]}
                                                createOrder={async (data, actions) => {
                                                    // Validation
                                                    if (!selectedDate || !selectedTime) {
                                                        setError('Please select date and time');
                                                        return Promise.reject(new Error('Missing fields'));
                                                    }
                                                    const apptData = buildAppointmentData();
                                                    try {
                                                        // Call backend to create order
                                                        const order = await createPayPalOrder(
                                                            apptData.price,
                                                            apptData.currency,
                                                            `Appointment: ${apptData.serviceName}`
                                                        );
                                                        return order.order_id; // Backend must return 'order_id'
                                                    } catch (err) {
                                                        console.error("PayPal Create Order Error", err);
                                                        setError("Failed to initialize PayPal.");
                                                        throw err;
                                                    }
                                                }}
                                                onApprove={async (data, actions) => {
                                                    try {
                                                        const apptData = buildAppointmentData();
                                                        // Backend capture
                                                        const captureResult = await capturePayPalOrder(data.orderID);

                                                        if (captureResult.status === 'success') {
                                                            // Create Appointment
                                                            const finalAppointmentData = {
                                                                professional_id: apptData.professional_id,
                                                                service_id: apptData.service_id,
                                                                start_time: apptData.start_time,
                                                                end_time: apptData.end_time,
                                                                client_notes: apptData.client_notes,
                                                                payment_id: captureResult.payment_id
                                                            };
                                                            await appointmentService.create(finalAppointmentData);
                                                            setSuccess(true);
                                                            setTimeout(() => {
                                                                onClose();
                                                                navigate('/dashboard/appointments');
                                                            }, 2000);
                                                        }
                                                    } catch (err) {
                                                        console.error("PayPal Capture Error", err);
                                                        // Show detailed error from backend if available
                                                        const errorDetails = err.response?.data?.details || err.response?.data?.error || "Payment failed during capture.";
                                                        setError(`Capture Failed: ${errorDetails}`);
                                                    }
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    ) : (
                                        <div className="text-center text-sm text-gray-500 py-2">Loading PayPal...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Professional Profile Page - Full profile with services, reviews, and booking.
 */
const ProfessionalProfile = () => {
    const { id } = useParams();
    const { formatPrice } = useCurrency();
    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchProfessional();
    }, [id]);

    const fetchProfessional = async () => {
        setLoading(true);
        try {
            const response = await professionalService.getById(id);
            setProfessional(response);
        } catch (err) {
            // Use mock data for demo
            setProfessional(mockProfessional);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'about', label: 'About' },
        { id: 'services', label: 'Services' },
        { id: 'availability', label: 'Availability' },
        { id: 'reviews', label: 'Reviews', count: professional?.review_count || 0 },
        { id: 'credentials', label: 'Credentials' },
    ];

    const handleBookService = (service) => {
        setSelectedService(service);
        setShowBookingModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!professional) {
        return (
            <div className="min-h-screen pt-20">
                <EmptyState
                    title="Professional not found"
                    description="The professional you're looking for doesn't exist or has been removed."
                />
            </div>
        );
    }

    // Map professional types to badge variants
    const typeVariants = {
        yoga_therapist: 'yoga',
        doctor: 'doctor',
        nutritionist: 'nutrition',
        psychologist: 'psychology',
        nurse: 'nurse',
    };

    const formatType = (type) => {
        return type?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Professional';
    };

    // Get professional name from nested User object or fallback
    const professionalName = professional.user?.name || professional.name || 'Professional';
    const professionalImageUrl = professional.user?.profile_image_url || professional.profile_image_url;

    return (
        <div className="min-h-screen bg-earth-50">
            {/* ===================== HERO BANNER ===================== */}
            <section className="relative h-48 md:h-64 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
                </div>

                {/* Floating wellness icons */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-8 left-[15%] text-3xl opacity-20 animate-float">🧘</div>
                    <div className="absolute top-12 right-[20%] text-2xl opacity-15 animate-float-slow">✨</div>
                    <div className="absolute bottom-8 left-[10%] text-2xl opacity-20 animate-float-delayed">🌿</div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-earth-50">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
                    </svg>
                </div>
            </section>

            {/* ===================== PROFILE HEADER ===================== */}
            <section className="relative -mt-20 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Enhanced Photo with Glow */}
                        <div className="flex-shrink-0 relative">
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-${typeVariants[professional.type] || 'primary'}-400 to-${typeVariants[professional.type] || 'primary'}-600 rounded-full blur-xl opacity-40 scale-110`} />

                            {/* Profile photo container */}
                            <div className="relative">
                                <Avatar
                                    src={professionalImageUrl}
                                    name={professionalName}
                                    size="xl"
                                    verified={false}
                                    className="w-36 h-36 lg:w-48 lg:h-48 ring-4 ring-white shadow-2xl"
                                />

                                {/* Animated Verified Badge */}
                                {professional.is_verified && (
                                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-lg border border-success-200">
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="absolute inset-0 animate-ping">
                                                <svg className="w-5 h-5 text-success-500 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                        <span className="text-xs font-semibold text-success-600">Verified</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Info with Enhanced Styling */}
                        <div className="flex-1 bg-white rounded-2xl shadow-soft p-6 lg:p-8">
                            <div className="flex flex-wrap items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-earth-900 mb-1">
                                        {professionalName}
                                    </h1>
                                    <p className="text-lg text-earth-600 font-medium">
                                        {professional.specialization || formatType(professional.type)}
                                    </p>
                                </div>
                            </div>

                            {/* Credentials as colorful pills */}
                            {professional.credentials && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {professional.credentials.map((cred, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            <span className="text-amber-500">🏅</span>
                                            {cred}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Rating with gold stars */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(professional.rating) ? 'text-yellow-400' : 'text-earth-200'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 font-bold text-earth-900">{professional.rating?.toFixed(1)}</span>
                                    <span className="text-earth-500">({professional.review_count} reviews)</span>
                                </div>
                                <Badge variant={typeVariants[professional.type] || 'default'} size="md">
                                    {formatType(professional.type)}
                                </Badge>
                            </div>

                            {/* Location & Languages with icons */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-earth-600 mb-4">
                                {professional.location && (
                                    <span className="flex items-center gap-1.5 bg-earth-50 px-3 py-1.5 rounded-full">
                                        <svg className="h-4 w-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {professional.location}
                                    </span>
                                )}
                                {professional.offers_online && (
                                    <span className="flex items-center gap-1.5 bg-success-50 text-success-600 px-3 py-1.5 rounded-full">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Online Available
                                    </span>
                                )}
                                {professional.years_experience && (
                                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full">
                                        ⭐ {professional.years_experience} years experience
                                    </span>
                                )}
                            </div>

                            {/* Languages */}
                            {professional.languages && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {professional.languages.map((lang, i) => (
                                        <span key={i} className="text-sm text-earth-500 bg-earth-100 px-2 py-1 rounded">🌐 {lang}</span>
                                    ))}
                                </div>
                            )}

                            {/* Response time */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="inline-flex items-center gap-1 text-primary-600 font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                    </span>
                                    Usually responds in &lt; 1 hour
                                </span>
                            </div>
                        </div>

                        {/* Desktop CTA Card */}
                        <div className="hidden lg:block flex-shrink-0 w-80">
                            <Card className="sticky top-24 shadow-xl border-2 border-primary-100">
                                <div className="text-center">
                                    {/* Price highlight */}
                                    <div className="bg-gradient-to-r from-primary-50 to-purple-50 -mx-6 -mt-6 mb-6 p-6 rounded-t-2xl">
                                        <p className="text-sm text-earth-500 mb-1">Starting from</p>
                                        <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                            {formatPrice(professional.hourly_rate || 49)}
                                        </p>
                                        <p className="text-sm text-earth-500 mt-1">per session</p>
                                    </div>

                                    {/* Availability indicator */}
                                    <div className="flex items-center justify-center gap-2 mb-6 text-success-600">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                                        </span>
                                        <span className="font-medium">Available Today at 3:00 PM</span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full mb-3 shadow-lg shadow-primary-500/30"
                                        onClick={() => setShowBookingModal(true)}
                                    >
                                        Book Now →
                                    </Button>
                                    <Button variant="ghost" size="md" className="w-full">
                                        💬 Message Professional
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== QUICK STATS ===================== */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center shadow-soft border border-earth-100 hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">{professional.total_sessions || 156}</p>
                            <p className="text-sm text-earth-500">Total Sessions</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-soft border border-earth-100 hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-yellow-500">{professional.rating?.toFixed(1) || '4.9'}/5</p>
                            <p className="text-sm text-earth-500">Average Rating</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-soft border border-earth-100 hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-success-500">{professional.response_rate || 98}%</p>
                            <p className="text-sm text-earth-500">Response Rate</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-soft border border-earth-100 hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-pink-500">{professional.return_rate || 85}%</p>
                            <p className="text-sm text-earth-500">Clients Return</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== TABS NAVIGATION ===================== */}
            <div className="bg-white border-b border-earth-200 sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>
            </div>

            {/* ===================== TAB CONTENT ===================== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2">
                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-8">
                                <Card title="About">
                                    <div className="prose prose-earth max-w-none">
                                        <p className="text-earth-700 leading-relaxed">
                                            {professional.bio || 'No bio available.'}
                                        </p>
                                    </div>
                                    {professional.specializations && (
                                        <div className="mt-6">
                                            <h4 className="font-semibold text-earth-900 mb-3">Specializations</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {professional.specializations.map((spec, i) => (
                                                    <Badge key={i} variant="default">{spec}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-earth-900 mb-4">Services Offered</h3>
                                {(professional.services || mockServices).map((service) => (
                                    <Card key={service.id} className="hover:shadow-card-hover transition-shadow">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-earth-900 mb-1">
                                                    {service.name}
                                                </h4>
                                                <p className="text-sm text-earth-500 mb-2">
                                                    {service.duration_minutes || service.duration} minutes
                                                </p>
                                                <p className="text-earth-600">
                                                    {service.description}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-2xl font-bold text-primary-600 mb-2">
                                                    {formatPrice(service.price_cents ? service.price_cents / 100 : service.price)}
                                                </p>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleBookService(service)}
                                                >
                                                    Book Now →
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Availability Tab */}
                        {activeTab === 'availability' && (
                            <Card title="Available Times">
                                <div className="text-center py-12">
                                    <p className="text-earth-500 mb-4">
                                        Interactive calendar coming soon!
                                    </p>
                                    <Button variant="primary" onClick={() => setShowBookingModal(true)}>
                                        View Available Slots
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <Card title={`Client Reviews (${professional.review_count || 0})`}>
                                    {/* Rating breakdown */}
                                    <div className="mb-6 p-4 bg-earth-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-earth-900">{professional.rating?.toFixed(1)}</p>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-sm text-earth-500 w-3">{star}</span>
                                                        <div className="flex-1 bg-earth-200 rounded-full h-2">
                                                            <div
                                                                className="bg-yellow-400 h-2 rounded-full"
                                                                style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews list */}
                                    <div className="space-y-4">
                                        {mockReviews.map((review) => (
                                            <div key={review.id} className="border-b border-earth-100 pb-4 last:border-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Avatar name={review.author} size="sm" />
                                                    <div>
                                                        <p className="font-medium text-earth-900">{review.author}</p>
                                                        <p className="text-xs text-earth-500">{review.date}</p>
                                                    </div>
                                                    <div className="ml-auto flex items-center">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-earth-700">{review.text}</p>
                                                {review.verified && (
                                                    <span className="inline-flex items-center text-xs text-green-600 mt-2">
                                                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Verified Client
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Credentials Tab */}
                        {activeTab === 'credentials' && (
                            <div className="space-y-6">
                                <Card title="Education & Certifications">
                                    <div className="space-y-4">
                                        {(professional.education || mockEducation).map((edu, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                                    🎓
                                                </div>
                                                <div>
                                                    <p className="font-medium text-earth-900">{edu.degree}</p>
                                                    <p className="text-sm text-earth-500">{edu.institution} • {edu.year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card title="Certifications">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {(professional.certifications || mockCertifications).map((cert, i) => (
                                            <div key={i} className="p-4 bg-earth-50 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium text-earth-900">{cert.name}</p>
                                                        <p className="text-sm text-earth-500">{cert.issuer}</p>
                                                        <p className="text-xs text-earth-400">{cert.year}</p>
                                                    </div>
                                                    <Badge variant="success" size="sm">✓ Verified</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Desktop) */}
                    <div className="hidden lg:block">
                        {/* This space is for the sticky sidebar that's already in the header */}
                    </div>
                </div>
            </div>

            {/* ===================== MOBILE FLOATING CTA ===================== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 p-4 z-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-earth-500">From</p>
                        <p className="text-xl font-bold text-primary-600">{formatPrice(professional.hourly_rate || 49)}</p>
                    </div>
                    <Button variant="primary" size="lg" onClick={() => setShowBookingModal(true)}>
                        Book Now
                    </Button>
                </div>
            </div>

            {/* Add padding at bottom for mobile CTA */}
            <div className="lg:hidden h-24" />

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                professional={professional}
                service={selectedService}
                services={professional?.services || mockServices}
            />
        </div>
    );
};

// Mock data
const mockProfessional = {
    id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456789',
    name: 'Dr. Sarah Johnson',
    type: 'yoga_therapist',
    specialization: 'Therapeutic Yoga & Meditation',
    rating: 4.9,
    review_count: 127,
    hourly_rate: 85,
    location: 'Sydney, Australia',
    is_verified: true,
    offers_online: true,
    years_experience: 15,
    languages: ['English', 'Spanish'],
    credentials: ['RYT-500', 'C-IAYT', 'Board Certified'],
    bio: 'I am a certified yoga therapist with over 15 years of experience helping clients achieve physical and mental wellness through personalized yoga practices. My approach combines ancient yoga wisdom with modern therapeutic techniques to address chronic pain, stress, anxiety, and other health challenges. I believe in creating a safe, supportive environment where each client can explore their unique path to healing.',
    specializations: ['Therapeutic Yoga', 'Sports Rehabilitation', 'Stress Management', 'Chronic Pain', 'Anxiety Relief'],
    total_sessions: 156,
    response_rate: 98,
    return_rate: 85,
};

const mockServices = [
    { id: 'b1c2d3e4-f5a6-4789-bcde-f01234567890', name: 'Initial Yoga Therapy Consultation', duration_minutes: 30, price_cents: 4900, description: 'Perfect for first-time clients. We will discuss your health goals and create a personalized plan.' },
    { id: 'c2d3e4f5-a6b7-4890-cdef-012345678901', name: '1-on-1 Therapeutic Yoga Session', duration_minutes: 60, price_cents: 8900, description: 'Personalized session tailored to your specific needs and goals.' },
    { id: 'd3e4f5a6-b7c8-4901-def0-123456789012', name: '8-Week Transformation Program', duration_minutes: 480, price_cents: 65000, description: 'Comprehensive wellness program with 8 sessions (60 min each). Save $62!' },
];

const mockReviews = [
    { id: 1, author: 'Emma Thompson', rating: 5, date: '2 weeks ago', text: 'Sarah is absolutely wonderful! She has helped me manage my chronic back pain through gentle yoga practices.', verified: true },
    { id: 2, author: 'Michael Chen', rating: 5, date: '1 month ago', text: 'Highly recommend! The personalized approach made all the difference.', verified: true },
    { id: 3, author: 'Lisa Park', rating: 4, date: '2 months ago', text: 'Great sessions, very knowledgeable about therapeutic applications of yoga.', verified: true },
];

const mockEducation = [
    { degree: 'Bachelor of Physiotherapy', institution: 'University of Sydney', year: '2010' },
    { degree: 'RYT-500 Yoga Teacher Training', institution: 'Yoga Alliance', year: '2012' },
    { degree: 'Certified Yoga Therapist (C-IAYT)', institution: 'IAYT', year: '2015' },
];

const mockCertifications = [
    { name: 'RYT-500', issuer: 'Yoga Alliance', year: '2012' },
    { name: 'C-IAYT', issuer: 'International Association of Yoga Therapists', year: '2015' },
    { name: 'Sports Yoga Certification', issuer: 'Sports Yoga Institute', year: '2018' },
];

export default ProfessionalProfile;
