import React, { useState } from 'react';
import { initiateRazorpayPayment } from '../../services/paymentService';

/**
 * RazorpayButton - A reusable payment button component
 * 
 * @param {Object} props
 * @param {number} props.amount - Amount in INR
 * @param {string} props.description - Payment description
 * @param {Object} props.user - User details { name, email, phone }
 * @param {function} props.onSuccess - Success callback
 * @param {function} props.onError - Error callback
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.disabled - Disable button
 */
const RazorpayButton = ({
    amount,
    description = 'Payment',
    user = {},
    onSuccess,
    onError,
    onDismiss,
    className = '',
    children,
    disabled = false,
}) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (disabled || loading) return;

        setLoading(true);

        try {
            await initiateRazorpayPayment({
                amount,
                description,
                name: user.name || user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                onSuccess: (data) => {
                    setLoading(false);
                    if (onSuccess) onSuccess(data);
                },
                onError: (error) => {
                    setLoading(false);
                    if (onError) onError(error);
                },
                onDismiss: () => {
                    setLoading(false);
                    if (onDismiss) onDismiss();
                },
            });
        } catch (error) {
            setLoading(false);
            if (onError) onError(error);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={disabled || loading}
            className={`razorpay-button ${className} ${loading ? 'loading' : ''}`}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Processing...
                </span>
            ) : (
                children || `Pay ₹${amount}`
            )}
        </button>
    );
};

/**
 * RazorpayCheckout - Full checkout component with amount display
 */
const RazorpayCheckout = ({
    amount,
    description,
    user,
    onSuccess,
    onError,
    title = 'Complete Payment',
}) => {
    const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccess = (data) => {
        setPaymentStatus('success');
        if (onSuccess) onSuccess(data);
    };

    const handleError = (error) => {
        setPaymentStatus('error');
        setErrorMessage(error?.description || error?.message || 'Payment failed');
        if (onError) onError(error);
    };

    if (paymentStatus === 'success') {
        return (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                    Payment Successful!
                </h3>
                <p className="text-green-600 dark:text-green-400">
                    Your payment of ₹{amount} has been processed successfully.
                </p>
            </div>
        );
    }

    return (
        <div className="payment-checkout p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {title}
            </h3>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{description}</span>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        ₹{amount.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>

            {paymentStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {errorMessage}. Please try again.
                </div>
            )}

            <RazorpayButton
                amount={amount}
                description={description}
                user={user}
                onSuccess={handleSuccess}
                onError={handleError}
                className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay ₹{amount.toLocaleString('en-IN')}
            </RazorpayButton>

            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                Secured by Razorpay. Your payment info is encrypted.
            </p>
        </div>
    );
};

export { RazorpayButton, RazorpayCheckout };
export default RazorpayCheckout;
