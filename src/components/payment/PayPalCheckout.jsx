import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import apiClient from '../../services/api';

/**
 * PayPal Checkout Component for International Payments
 */

// Get PayPal configuration from backend
const getPayPalConfig = async () => {
    const response = await apiClient.get('/api/payments/paypal/config');
    return response.data;
};

// Create PayPal order
const createPayPalOrder = async (amount, currency = 'USD', description = 'Payment') => {
    const response = await apiClient.post('/api/payments/paypal/create', {
        amount,
        currency,
        description,
    });
    return response.data;
};

// Capture PayPal order
const capturePayPalOrder = async (orderId) => {
    const response = await apiClient.post(`/api/payments/paypal/capture/${orderId}`);
    return response.data;
};

/**
 * PayPalCheckout - Full PayPal checkout component
 * 
 * @param {Object} props
 * @param {number} props.amount - Amount to charge
 * @param {string} props.currency - Currency code (USD, EUR, GBP, etc.)
 * @param {string} props.description - Payment description
 * @param {function} props.onSuccess - Success callback
 * @param {function} props.onError - Error callback
 * @param {function} props.onCancel - Cancel callback
 */
const PayPalCheckout = ({
    amount,
    currency = 'USD',
    description = 'Payment',
    onSuccess,
    onError,
    onCancel,
    title = 'Complete Payment',
}) => {
    const [clientId, setClientId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        loadPayPalConfig();
    }, []);

    const loadPayPalConfig = async () => {
        try {
            const config = await getPayPalConfig();
            setClientId(config.client_id);
            setLoading(false);
        } catch (err) {
            setError('Failed to load PayPal');
            setLoading(false);
            console.error('PayPal config error:', err);
        }
    };

    const handleCreateOrder = async () => {
        try {
            const data = await createPayPalOrder(amount, currency, description);
            return data.order_id;
        } catch (err) {
            console.error('Failed to create PayPal order:', err);
            if (onError) onError(err);
            throw err;
        }
    };

    const handleApprove = async (data) => {
        try {
            const result = await capturePayPalOrder(data.orderID);
            setPaymentStatus('success');
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('Failed to capture payment:', err);
            setError('Payment capture failed');
            if (onError) onError(err);
        }
    };

    const handleCancel = () => {
        console.log('Payment cancelled');
        if (onCancel) onCancel();
    };

    const handleError = (err) => {
        console.error('PayPal error:', err);
        setError('Payment failed');
        if (onError) onError(err);
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading PayPal...</p>
            </div>
        );
    }

    // Error state
    if (error && !clientId) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Success state
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
                    Your payment of {currency} {amount.toFixed(2)} has been processed.
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
                        {currency} {amount.toFixed(2)}
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}. Please try again.
                </div>
            )}

            <PayPalScriptProvider options={{
                "client-id": clientId,
                currency: currency,
                intent: "capture"
            }}>
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal',
                    }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onCancel={handleCancel}
                    onError={handleError}
                />
            </PayPalScriptProvider>

            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                🌍 Secured by PayPal for international payments
            </p>
        </div>
    );
};

/**
 * PayPalButton - Simple PayPal button without full checkout UI
 */
const PayPalButton = ({
    amount,
    currency = 'USD',
    description = 'Payment',
    onSuccess,
    onError,
    onCancel,
}) => {
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        getPayPalConfig().then(config => setClientId(config.client_id));
    }, []);

    if (!clientId) return null;

    return (
        <PayPalScriptProvider options={{ "client-id": clientId, currency }}>
            <PayPalButtons
                style={{ layout: 'horizontal', tagline: false }}
                createOrder={async () => {
                    const data = await createPayPalOrder(amount, currency, description);
                    return data.order_id;
                }}
                onApprove={async (data) => {
                    const result = await capturePayPalOrder(data.orderID);
                    if (onSuccess) onSuccess(result);
                }}
                onCancel={onCancel}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
};

export { PayPalCheckout, PayPalButton, getPayPalConfig, createPayPalOrder, capturePayPalOrder };
export default PayPalCheckout;
