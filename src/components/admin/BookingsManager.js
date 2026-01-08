import React, { useState, useEffect } from 'react';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const statusParam = filter === 'all' ? '' : `&status=${filter}`;
            const response = await fetch(`http://localhost:8080/admin/bookings?limit=50${statusParam}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBookings(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Bookings</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3">ID</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Class</th>
                                <th className="p-3">Time</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Booked At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.ID} className="border-b hover:bg-gray-50">
                                    <td className="p-3">#{b.ID}</td>
                                    <td className="p-3 font-medium">{b.User?.name}</td>
                                    <td className="p-3">{b.Class?.name}</td>
                                    <td className="p-3">{b.Class?.day} {b.Class?.time}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${b.Status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {b.Status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-500">{new Date(b.CreatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingsManager;
