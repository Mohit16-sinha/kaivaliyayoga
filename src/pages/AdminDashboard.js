import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsOverview from '../components/admin/StatsOverview';
import RevenueReport from '../components/admin/RevenueReport';
import BookingsManager from '../components/admin/BookingsManager';
import UsersManager from '../components/admin/UsersManager';
import ContactManager from '../components/admin/ContactManager';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Basic Auth Check (Should ideally be a protected route wrapper)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        return (
            <div className="container mx-auto p-10 text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p>You must be an admin to view this page.</p>
                <button
                    onClick={() => navigate('/signin')}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Sign In as Admin
                </button>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <StatsOverview />;
            case 'revenue': return <RevenueReport />;
            case 'bookings': return <BookingsManager />;
            case 'users': return <UsersManager />;
            case 'contact': return <ContactManager />;
            default: return <StatsOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-indigo-800 text-white py-4 px-6 mb-6 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="flex space-x-4">
                        <button onClick={() => navigate('/admin/classes')} className="hover:text-indigo-200">Manage Classes</button>
                        <button onClick={() => navigate('/')} className="hover:text-indigo-200">Back to Site</button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar / Tabs */}
                    <div className="lg:w-1/5">
                        <div className="bg-white rounded-lg shadow p-4 space-y-2">
                            <TabButton id="overview" label="Overview" active={activeTab} set={setActiveTab} />
                            <TabButton id="revenue" label="Revenue Reports" active={activeTab} set={setActiveTab} />
                            <TabButton id="bookings" label="Bookings" active={activeTab} set={setActiveTab} />
                            <TabButton id="users" label="Users" active={activeTab} set={setActiveTab} />
                            <TabButton id="contact" label="Messages" active={activeTab} set={setActiveTab} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-4/5">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ id, label, active, set }) => (
    <button
        onClick={() => set(id)}
        className={`w-full text-left px-4 py-2 rounded transition-colors ${active === id
            ? 'bg-indigo-100 text-indigo-700 font-semibold border-l-4 border-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
    >
        {label}
    </button>
);

export default AdminDashboard;
