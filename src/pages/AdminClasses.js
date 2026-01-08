import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', teacher: '', day: '', time: '', duration: '', capacity: '', level: 'Beginner'
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:8080/classes');
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        const payload = {
            ...formData,
            duration: parseInt(formData.duration),
            capacity: parseInt(formData.capacity)
        };

        try {
            const response = await fetch('http://localhost:8080/admin/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Class created successfully!' });
                setFormData({ name: '', description: '', teacher: '', day: '', time: '', duration: '', capacity: '', level: 'Beginner' });
                fetchClasses();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Failed to create class' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this class?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/admin/classes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchClasses();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin: Manage Classes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Create Form */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Class</h2>
                    {message.text && (
                        <div className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="name" placeholder="Class Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="teacher" placeholder="Teacher" value={formData.teacher} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <select name="level" value={formData.level} onChange={handleChange} className="w-full p-2 border rounded">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>All Levels</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="day" placeholder="Day (e.g. Monday)" value={formData.day} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <input type="text" name="time" placeholder="Time (e.g. 08:00 AM)" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" name="duration" placeholder="Duration (mins)" value={formData.duration} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Create Class</button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Classes</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {classes.map(cls => (
                            <div key={cls.id} className="p-4 border rounded flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <h3 className="font-bold text-indigo-700">{cls.name}</h3>
                                    <p className="text-sm text-gray-500">{cls.day} {cls.time} - {cls.teacher}</p>
                                </div>
                                <button onClick={() => handleDelete(cls.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClasses;
