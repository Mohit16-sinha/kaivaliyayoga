import apiClient from './api';

/**
 * Payment Service - Handles Razorpay payment operations
 */

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

// Get Razorpay configuration (public key)
export const getRazorpayConfig = async () => {
    const response = await apiClient.get('/api/payments/config');
    return response.data;
};

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR') => {
    const response = await apiClient.post('/api/payments/razorpay/create', {
        amount,
        currency,
    });
    return response.data;
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData) => {
    const response = await apiClient.post('/api/payments/razorpay/verify', {
        order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
    });
    return response.data;
};

// Get payment history
export const getPaymentHistory = async () => {
    const response = await apiClient.get('/api/payments/history');
    return response.data;
};

// Download Invoice
export const downloadInvoice = async (paymentId) => {
    try {
        const response = await apiClient.get(`/api/payments/${paymentId}/invoice`, {
            responseType: 'blob',
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${paymentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download invoice:", error);
        throw error;
    }
};

/**
 * Main function to initiate Razorpay payment
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in INR (not paise)
 * @param {string} options.name - Customer name
 * @param {string} options.email - Customer email
 * @param {string} options.phone - Customer phone
 * @param {string} options.description - Payment description
 * @param {function} options.onSuccess - Callback on successful payment
 * @param {function} options.onError - Callback on payment error
 */
export const initiateRazorpayPayment = async (options) => {
    try {
        // 1. Load Razorpay script
        await loadRazorpayScript();

        // 2. Get Razorpay config (key_id)
        const config = await getRazorpayConfig();

        // 3. Create order on backend
        const orderData = await createRazorpayOrder(options.amount, 'INR');

        // 4. Configure Razorpay checkout
        const razorpayOptions = {
            key: config.key_id,
            amount: orderData.amount, // Already in paise from backend
            currency: 'INR',
            name: 'Kaivalya Yoga',
            description: options.description || 'Payment',
            order_id: orderData.order_id,
            prefill: options.prefill || {
                name: options.name || '',
                email: options.email || '',
                contact: options.phone || '',
            },
            theme: {
                color: '#4A5568', // Matches your yoga theme
            },
            handler: async (response) => {
                try {
                    // 5. Verify payment on backend
                    const verifyResult = await verifyRazorpayPayment(response);

                    if (options.onSuccess) {
                        options.onSuccess({
                            ...verifyResult,
                            razorpay_payment_id: response.razorpay_payment_id,
                        });
                    }
                } catch (error) {
                    console.error('Payment verification failed:', error);
                    if (options.onError) {
                        options.onError(error);
                    }
                }
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment modal closed');
                    if (options.onDismiss) {
                        options.onDismiss();
                    }
                },
            },
        };

        // 6. Open Razorpay checkout
        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();

        razorpay.on('payment.failed', (response) => {
            console.error('Payment failed:', response.error);
            if (options.onError) {
                options.onError(response.error);
            }
        });

    } catch (error) {
        console.error('Failed to initiate payment:', error);
        if (options.onError) {
            options.onError(error);
        }
        throw error;
    }
};

// PayPal Exports
export const getPayPalConfig = async () => {
    const response = await apiClient.get('/api/payments/paypal/config');
    return response.data;
};

export const createPayPalOrder = async (amount, currency, description) => {
    const response = await apiClient.post('/api/payments/paypal/create', {
        amount,
        currency,
        description
    });
    return response.data; // { order_id, payment_id }
};

export const capturePayPalOrder = async (orderId) => {
    const response = await apiClient.post(`/api/payments/paypal/capture/${orderId}`);
    return response.data; // { status, payment_id }
};

export default {
    loadRazorpayScript,
    getRazorpayConfig,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentHistory,
    initiateRazorpayPayment,
    downloadInvoice,
    getPayPalConfig,
    createPayPalOrder,
    capturePayPalOrder,
};
