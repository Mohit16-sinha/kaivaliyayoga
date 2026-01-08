import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:8080/classes', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                console.log("Classes Data:", data);
                setClasses(data);
            } else {
                setError('Failed to load classes');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (classId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        setIsProcessing(true);
        setBookingMessage('Checking membership status...');

        try {
            // 1. Validate Membership
            const validateResponse = await fetch('http://localhost:8080/api/memberships/validate', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const validateData = await validateResponse.json();

            if (validateData.valid && validateData.can_book) {
                // 2a. Direct Booking (Membership/Credits)
                setBookingMessage('Booking using active plan...');
                const bookingResponse = await fetch('http://localhost:8080/user/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ class_id: classId }) // No payment_id needed
                });

                if (bookingResponse.ok) {
                    setBookingMessage(`Booking Confirmed! (${validateData.type === 'drop_in' ? '1 Credit Used' : 'Unlimited Plan'})`);
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                    const err = await bookingResponse.json();
                    throw new Error(err.error || 'Booking failed');
                }

            } else {
                // 2b. Payment Flow (Drop-in)
                await initiatePayment(classId, token);
            }

        } catch (err) {
            setBookingMessage(`Error: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const initiatePayment = async (classId, token) => {
        setBookingMessage('Initializing Payment...');
        try {
            // Create Order
            const orderResponse = await fetch('http://localhost:8080/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: 500, currency: "INR" })
            });

            if (!orderResponse.ok) throw new Error('Failed to create order');
            const orderData = await orderResponse.json();

            // Open Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Kaivaliya Yoga",
                description: "Class Booking",
                order_id: orderData.order_id,
                handler: async function (response) {
                    try {
                        setBookingMessage('Verifying Payment...');
                        const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                order_id: orderData.order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (!verifyResponse.ok) throw new Error('Payment verification failed');
                        const verifyData = await verifyResponse.json();

                        setBookingMessage('Confirming Booking...');
                        const bookingResponse = await fetch('http://localhost:8080/user/bookings', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                class_id: classId,
                                payment_id: verifyData.payment_id
                            })
                        });

                        if (bookingResponse.ok) {
                            setBookingMessage('Booking Confirmed! See you in class.');
                            setTimeout(() => navigate('/dashboard'), 2000);
                        } else {
                            throw new Error('Booking failed after payment');
                        }

                    } catch (err) {
                        setBookingMessage(`Error: ${err.message}`);
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            setBookingMessage(`Error: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center py-10">Loading classes...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Classes</h2>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {bookingMessage && (
                <div className={`text-center mb-4 p-2 rounded ${bookingMessage.includes('Confirmed') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {bookingMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(classes) ? classes : []).map((cls) => (
                    <div key={cls.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                        <h3 className="text-xl font-semibold mb-2 text-indigo-600">{cls.name}</h3>
                        <p className="text-gray-600 mb-4">{cls.description || 'Join us for a rejuvenating session.'}</p>

                        <div className="space-y-2 mb-6 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>Teacher:</span>
                                <span className="font-medium text-gray-700">{cls.teacher}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>When:</span>
                                <span className="font-medium text-gray-700">{cls.day} at {cls.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium text-gray-700">{cls.duration} mins</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Level:</span>
                                <span className="font-medium text-gray-700">{cls.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Capacity:</span>
                                {(() => {
                                    const spotsLeft = cls.capacity - (cls.slots_booked || 0);
                                    return (
                                        <span className={`font-medium ${spotsLeft === 0 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                                            {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span>Price:</span>
                                <span className="font-bold text-green-700">₹500</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleBooking(cls.id)}
                            disabled={isProcessing || cls.is_full}
                            className={`w-full py-2 rounded transition-colors duration-200 font-medium text-white ${isProcessing || cls.is_full
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isProcessing ? 'Processing...' : (cls.is_full ? 'Class Full' : 'Book Now (₹500)')}
                        </button>
                    </div>
                ))}
            </div>

            {classes.length === 0 && !error && (
                <div className="text-center text-gray-500">No classes scheduled at the moment.</div>
            )}
        </div>
    );
};

export default Classes;
