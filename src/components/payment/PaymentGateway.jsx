import React from 'react';
import { RazorpayCheckout, RazorpayButton } from './RazorpayCheckout';
import { PayPalCheckout, PayPalButton } from './PayPalCheckout';

/**
 * PaymentGateway - Unified component that routes to appropriate payment provider
 * 
 * Uses Razorpay for Indian customers (INR) and PayPal for international
 * 
 * @param {Object} props
 * @param {number} props.amount - Amount to charge
 * @param {string} props.currency - Currency code (INR, USD, EUR, etc.)
 * @param {string} props.userCountry - User's country code (IN, US, etc.)
 * @param {string} props.description - Payment description
 * @param {Object} props.user - User details { name, email, phone }
 * @param {function} props.onSuccess - Success callback
 * @param {function} props.onError - Error callback
 */
const PaymentGateway = ({
    amount,
    currency = 'USD',
    userCountry,
    description = 'Payment',
    user = {},
    onSuccess,
    onError,
    onCancel,
    title,
}) => {
    // Determine which gateway to use
    const useRazorpay = userCountry === 'IN' || currency === 'INR';

    if (useRazorpay) {
        return (
            <RazorpayCheckout
                amount={amount}
                description={description}
                user={user}
                onSuccess={onSuccess}
                onError={onError}
                title={title || 'Pay with Razorpay'}
            />
        );
    }

    return (
        <PayPalCheckout
            amount={amount}
            currency={currency}
            description={description}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
            title={title || 'Pay with PayPal'}
        />
    );
};

/**
 * PaymentButtons - Shows both payment options side by side
 */
const PaymentButtons = ({
    amount,
    amountINR,
    currency = 'USD',
    description = 'Payment',
    user = {},
    onSuccess,
    onError,
}) => {
    return (
        <div className="space-y-4">
            {/* India - Razorpay */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🇮🇳</span>
                    <span className="font-medium text-gray-800 dark:text-white">Pay in India (INR)</span>
                </div>
                <RazorpayButton
                    amount={amountINR || amount}
                    description={description}
                    user={user}
                    onSuccess={onSuccess}
                    onError={onError}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Pay ₹{(amountINR || amount).toLocaleString('en-IN')} with Razorpay
                </RazorpayButton>
            </div>

            {/* International - PayPal */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🌍</span>
                    <span className="font-medium text-gray-800 dark:text-white">International ({currency})</span>
                </div>
                <PayPalButton
                    amount={amount}
                    currency={currency}
                    description={description}
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </div>
        </div>
    );
};

export { PaymentGateway, PaymentButtons };
export default PaymentGateway;
