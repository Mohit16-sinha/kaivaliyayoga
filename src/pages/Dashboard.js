import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', phone: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [bookings, setBookings] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

            try {
                // Fetch Profile
                const profileResponse = await fetch('http://localhost:8080/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (profileResponse.ok) {
                    const data = await profileResponse.json();
                    setUser({
                        name: data.name,
                        phone: data.phone || '',
                        email: data.email
                    });
                } else {
                    if (profileResponse.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/signin');
                    }
                }

                // Fetch Bookings & Memberships & Enrollments
                fetchBookings(token);
                fetchMemberships(token);
                fetchEnrollments(token);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const fetchBookings = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/user/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchMemberships = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/memberships/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMemberships(data);
            }
        } catch (error) {
            console.error('Error fetching memberships:', error);
        }
    };

    const fetchEnrollments = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/programs/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/user/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
                fetchBookings(token); // Refresh list
            } else {
                setMessage({ type: 'error', text: 'Failed to cancel booking.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error connecting to server.' });
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8083/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: user.name, phone: user.phone })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    if (loading) {
        return <div className="text-center mt-20 text-xl font-semibold text-gray-600">Loading your dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Membership Status */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-accent">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Memberships</h2>
                    {memberships.length === 0 ? (
                        <p className="text-gray-500">No active memberships. <a href="/services" className="text-accent hover:underline">Buy a plan</a></p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {memberships.map((mem) => (
                                <div key={mem.id} className={`p-4 rounded-lg border ${mem.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg capitalize">{mem.type.replace('_', ' ')} Plan</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${mem.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                            {mem.status}
                                        </span>
                                    </div>
                                    <div className="text-sm space-y-1 text-gray-600">
                                        <p><strong>Credits Remaining:</strong> {mem.credits === -1 ? 'Unlimited' : mem.credits}</p>
                                        <p><strong>Valid Until:</strong> {new Date(mem.end_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enrolled Programs */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Enrolled Programs</h2>
                    {enrollments.length === 0 ? (
                        <p className="text-gray-500">You have no upcoming courses. <a href="/services" className="text-indigo-600 hover:underline">Explore programs</a></p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {enrollments.map((enr) => (
                                <div key={enr.ID} className="p-4 rounded-lg border bg-indigo-50 border-indigo-100">
                                    <h3 className="font-bold text-lg text-indigo-900">{enr.program.name}</h3>
                                    <div className="text-sm space-y-1 text-indigo-700 mt-2">
                                        <p><strong>Start Date:</strong> {new Date(enr.program.start_date).toLocaleDateString()}</p>
                                        <p><strong>Duration:</strong> {enr.program.duration}</p>
                                        <p><strong>Status:</strong> <span className='text-green-700 font-bold'>Confirmed</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Profile Details</h2>

                        {message.text && (
                            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>

                    {/* Bookings Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">My Bookings</h2>

                        {bookings.length === 0 ? (
                            <p className="text-gray-500">You have no upcoming bookings.</p>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="border rounded-md p-4 bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-indigo-700">{booking.class.name}</h3>
                                            <p className="text-sm text-gray-600">{booking.class.day} at {booking.class.time}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.payment && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                        Paid: ₹{booking.payment.amount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
