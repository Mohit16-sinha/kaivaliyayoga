import React, { useState } from 'react';
import { Modal, Button, Spinner, Badge } from '../ui';
import { Input, TextArea } from '../forms';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * Multi-step Booking Modal for scheduling appointments.
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {function} props.onClose - Close handler
 * @param {Object} props.professional - Professional data
 * @param {Array} props.services - Available services
 * @param {Object} props.preSelectedService - Pre-selected service (optional)
 * @param {function} props.onSuccess - Success callback with appointment data
 */
const BookingModal = ({
    isOpen,
    onClose,
    professional,
    services = [],
    preSelectedService = null,
    onSuccess,
}) => {
    const { formatPrice } = useCurrency();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: preSelectedService?.id || null,
        selectedDate: null,
        selectedTime: null,
        reason: '',
        concerns: '',
        specialRequests: '',
        agreeToTerms: false,
    });

    // Mock available dates and times
    const availableDates = generateAvailableDates();
    const availableTimes = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

    const selectedService = services.find(s => s.id === formData.serviceId) || preSelectedService;
    const platformFee = 5;
    const total = (selectedService?.price || 0) + platformFee;

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep(5); // Go to confirmation
            if (onSuccess) {
                onSuccess({
                    confirmationNumber: `APT-${Date.now()}`,
                    ...formData,
                    professional,
                    service: selectedService,
                });
            }
        } catch (error) {
            console.error('Booking failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFormData({
            serviceId: preSelectedService?.id || null,
            selectedDate: null,
            selectedTime: null,
            reason: '',
            concerns: '',
            specialRequests: '',
            agreeToTerms: false,
        });
        onClose();
    };

    // Validation
    const isStep1Valid = formData.serviceId !== null;
    const isStep2Valid = formData.selectedDate && formData.selectedTime;
    const isStep3Valid = formData.reason.length >= 10;
    const isStep4Valid = formData.agreeToTerms;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" title={step < 5 ? `Book with ${professional?.name || 'Professional'}` : null}>
            {/* Progress Bar - Enhanced */}
            {step < 5 && (
                <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        {[
                            { num: 1, icon: '🎯', label: 'Service' },
                            { num: 2, icon: '📅', label: 'Schedule' },
                            { num: 3, icon: '📝', label: 'Details' },
                            { num: 4, icon: '💳', label: 'Confirm' },
                        ].map((s, index) => (
                            <div key={s.num} className="flex items-center">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${s.num < step
                                            ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/30'
                                            : s.num === step
                                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 animate-pulse-slow'
                                                : 'bg-earth-100 dark:bg-earth-700 text-earth-400 dark:text-earth-500'
                                            }`}
                                    >
                                        {s.num < step ? '✓' : s.icon}
                                    </div>
                                    <span className={`text-xs mt-1 font-medium ${s.num <= step ? 'text-primary-600 dark:text-primary-400' : 'text-earth-400 dark:text-earth-500'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {/* Connector Line */}
                                {index < 3 && (
                                    <div className={`w-8 sm:w-12 h-1 mx-1 rounded-full transition-all duration-500 ${s.num < step
                                        ? 'bg-gradient-to-r from-success-500 to-success-400'
                                        : 'bg-earth-200 dark:bg-earth-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 1: Select Service */}
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Select a Service</h3>
                    {services.length === 0 ? (
                        <p className="text-earth-500 dark:text-earth-400">No services available.</p>
                    ) : (
                        <div className="space-y-3">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => setFormData({ ...formData, serviceId: service.id })}
                                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.serviceId === service.id
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-earth-200 dark:border-earth-600 hover:border-primary-300 dark:hover:border-primary-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-earth-900 dark:text-white">{service.name}</h4>
                                            <p className="text-sm text-earth-500 dark:text-earth-400">{service.duration} minutes</p>
                                            <p className="text-sm text-earth-600 dark:text-earth-300 mt-1">{service.description}</p>
                                        </div>
                                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(service.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Choose Date & Time */}
            {step === 2 && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Choose a Date</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {availableDates.map((date) => (
                                <button
                                    key={date.dateStr}
                                    onClick={() => setFormData({ ...formData, selectedDate: date.dateStr })}
                                    disabled={!date.available}
                                    className={`p-3 rounded-lg text-center transition-all ${formData.selectedDate === date.dateStr
                                        ? 'bg-primary-600 text-white'
                                        : date.available
                                            ? 'bg-earth-50 dark:bg-earth-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-earth-900 dark:text-white'
                                            : 'bg-earth-100 dark:bg-earth-800 text-earth-300 dark:text-earth-600 cursor-not-allowed'
                                        }`}
                                >
                                    <p className="text-xs">{date.day}</p>
                                    <p className="text-lg font-semibold">{date.date}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.selectedDate && (
                        <div>
                            <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Choose a Time</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setFormData({ ...formData, selectedTime: time })}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${formData.selectedTime === time
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-earth-50 dark:bg-earth-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-earth-700 dark:text-earth-200'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-earth-500 dark:text-earth-400">
                                Times shown in your local timezone
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Add Details */}
            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Tell Us About Yourself</h3>

                    <TextArea
                        label="What brings you here today?"
                        required
                        rows={3}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Describe your goals or what you hope to achieve..."
                        error={formData.reason.length > 0 && formData.reason.length < 10 ? 'Please provide at least 10 characters' : ''}
                    />

                    <TextArea
                        label="Any specific concerns or health conditions? (Optional)"
                        rows={3}
                        value={formData.concerns}
                        onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                        placeholder="E.g., injuries, medical conditions, allergies..."
                    />

                    <TextArea
                        label="Special requests or questions? (Optional)"
                        rows={2}
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        placeholder="Anything else you'd like the professional to know..."
                    />

                    <p className="text-sm text-earth-500 dark:text-earth-400 flex items-center gap-2">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        This information is only shared with {professional?.name || 'the professional'}
                    </p>
                </div>
            )}

            {/* Step 4: Review & Pay */}
            {step === 4 && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Review Your Booking</h3>

                    {/* Booking Summary */}
                    <div className="bg-earth-50 dark:bg-earth-700 rounded-xl p-4 space-y-3 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                                {professional?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <p className="font-semibold text-earth-900 dark:text-white">{professional?.name}</p>
                                <p className="text-sm text-earth-500 dark:text-earth-400">{selectedService?.name}</p>
                            </div>
                        </div>
                        <div className="border-t border-earth-200 dark:border-earth-600 pt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-earth-500 dark:text-earth-400">Date & Time</span>
                                <span className="font-medium text-earth-900 dark:text-white">{formData.selectedDate} at {formData.selectedTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-earth-500 dark:text-earth-400">Duration</span>
                                <span className="font-medium text-earth-900 dark:text-white">{selectedService?.duration} minutes</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-earth-500 dark:text-earth-400">Location</span>
                                <span className="font-medium text-earth-900 dark:text-white">Online (Video Call)</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-600 rounded-xl p-4 space-y-2 transition-colors">
                        <div className="flex justify-between text-sm">
                            <span className="text-earth-600 dark:text-earth-400">Service fee</span>
                            <span className="text-earth-900 dark:text-white">{formatPrice(selectedService?.price || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-earth-600 dark:text-earth-400">Platform fee</span>
                            <span className="text-earth-900 dark:text-white">{formatPrice(platformFee)}</span>
                        </div>
                        <div className="border-t border-earth-200 dark:border-earth-600 pt-2 flex justify-between">
                            <span className="font-semibold text-earth-900 dark:text-white">Total</span>
                            <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">{formatPrice(total)}</span>
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="mt-1 h-4 w-4 rounded border-earth-300 dark:border-earth-600 text-primary-600 focus:ring-primary-500 bg-white dark:bg-earth-700"
                        />
                        <span className="text-sm text-earth-600 dark:text-earth-300">
                            I agree to the <a href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a> and{' '}
                            <a href="/refund" className="text-primary-600 dark:text-primary-400 hover:underline">Refund Policy</a>
                        </span>
                    </label>

                    {/* Cancellation Policy */}
                    <p className="text-sm text-earth-500 dark:text-earth-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        ℹ️ Free cancellation up to 24 hours before your appointment
                    </p>
                </div>
            )}

            {/* Step 5: Confirmation with Confetti */}
            {step === 5 && (
                <div className="text-center py-8 relative overflow-hidden">
                    {/* Confetti Animation */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-2xl"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `-20px`,
                                    animation: `confettiDrop ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`,
                                }}
                            >
                                {['🎉', '✨', '🎊', '💫', '⭐'][Math.floor(Math.random() * 5)]}
                            </div>
                        ))}
                    </div>

                    {/* Success Icon with Ring */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-success-100 rounded-full animate-ping opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center shadow-xl shadow-success-500/30">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-earth-900 dark:text-white mb-2">🎉 Booking Confirmed!</h2>
                    <p className="text-earth-600 dark:text-earth-300 mb-2">Your wellness journey begins soon!</p>
                    <p className="text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-mono px-4 py-2 rounded-lg inline-block mb-6">
                        Confirmation #: APT-{Date.now().toString().slice(-8)}
                    </p>

                    {/* What's Next Card */}
                    <div className="bg-gradient-to-br from-earth-50 to-primary-50 dark:from-earth-700 dark:to-primary-900/30 rounded-2xl p-6 text-left mb-6 border border-primary-100 dark:border-primary-800 transition-colors">
                        <h4 className="font-semibold text-earth-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-lg">📬</span> What Happens Next?
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">1</span>
                                <span className="text-sm text-earth-600 dark:text-earth-300">Check your email for confirmation details</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">2</span>
                                <span className="text-sm text-earth-600 dark:text-earth-300">Video meeting link arrives 15 min before</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">3</span>
                                <span className="text-sm text-earth-600 dark:text-earth-300">{professional?.name} will review your details</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button variant="primary" onClick={handleClose} className="shadow-lg">
                            📅 View Appointment
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>
                            Back to Dashboard
                        </Button>
                    </div>

                    {/* Add confetti animation keyframes */}
                    <style>{`
                        @keyframes confettiDrop {
                            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                        }
                    `}</style>
                </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
                <div className="flex justify-between mt-8 pt-4 border-t border-earth-100 dark:border-earth-700">
                    <Button
                        variant="ghost"
                        onClick={step === 1 ? handleClose : handleBack}
                    >
                        {step === 1 ? 'Cancel' : '← Back'}
                    </Button>

                    {step < 4 ? (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !isStep1Valid) ||
                                (step === 2 && !isStep2Valid) ||
                                (step === 3 && !isStep3Valid)
                            }
                        >
                            Next →
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleConfirmBooking}
                            disabled={!isStep4Valid}
                            loading={loading}
                        >
                            Confirm & Pay {formatPrice(total)}
                        </Button>
                    )}
                </div>
            )}
        </Modal>
    );
};

// Helper function to generate available dates
function generateAvailableDates() {
    const dates = [];
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            date: date.getDate(),
            day: days[date.getDay()],
            dateStr: date.toISOString().split('T')[0],
            available: Math.random() > 0.3, // Random availability for demo
        });
    }

    return dates;
}

export default BookingModal;
