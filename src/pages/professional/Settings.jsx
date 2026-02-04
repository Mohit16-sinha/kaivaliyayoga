import React, { useState, useEffect } from 'react';
import { Button, Spinner, Badge, Tabs } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Professional Settings page.
 */
const Settings = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
    const [settings, setSettings] = useState({
        email: '',
        timezone: '',
        language: 'en',
        notifications: {
            new_booking: true,
            booking_reminder: true,
            booking_cancelled: true,
            new_message: true,
            payout_completed: true,
            marketing: false,
        },
        privacy: {
            show_profile: true,
            show_ratings: true,
            allow_messages: true,
        },
        integrations: {
            google_calendar: false,
            zoom: false,
        },
    });

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'privacy', label: 'Privacy' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'danger', label: 'Danger Zone' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setSettings(prev => ({ ...prev, email: user?.email || 'doctor@example.com' }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved settings:', settings);
        } finally {
            setSaving(false);
        }
    };

    const updateNotification = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value },
        }));
    };

    const updatePrivacy = (key, value) => {
        setSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: value },
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Settings</h1>
                    <p className="text-earth-500 mt-1">Manage your account preferences</p>
                </div>

                <div className="bg-white rounded-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="p-6">
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full max-w-md px-4 py-2 border border-earth-200 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Timezone</label>
                                    <select
                                        value={settings.timezone}
                                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                        className="w-full max-w-md px-4 py-2 border border-earth-200 rounded-lg"
                                    >
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        <option value="America/Denver">Mountain Time (MT)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="Asia/Kolkata">India Standard Time</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Language</label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                        className="w-full max-w-md px-4 py-2 border border-earth-200 rounded-lg"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-earth-100">
                                    <h3 className="font-medium text-earth-900 mb-2">Password</h3>
                                    <Button variant="ghost">Change Password</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                <p className="text-earth-500 mb-4">Choose how you want to receive notifications</p>

                                {[
                                    { key: 'new_booking', label: 'New booking requests', desc: 'When a client books an appointment' },
                                    { key: 'booking_reminder', label: 'Appointment reminders', desc: '24h and 1h before appointments' },
                                    { key: 'booking_cancelled', label: 'Cancellations', desc: 'When a booking is cancelled' },
                                    { key: 'new_message', label: 'New messages', desc: 'When clients send messages' },
                                    { key: 'payout_completed', label: 'Payout updates', desc: 'When payouts are processed' },
                                    { key: 'marketing', label: 'Marketing emails', desc: 'Tips, updates, and promotions' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-earth-50">
                                        <div>
                                            <p className="font-medium text-earth-900">{item.label}</p>
                                            <p className="text-sm text-earth-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => updateNotification(item.key, !settings.notifications[item.key])}
                                            className={`w-12 h-6 rounded-full transition-colors ${settings.notifications[item.key] ? 'bg-primary-600' : 'bg-earth-200'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-4">
                                {[
                                    { key: 'show_profile', label: 'Show public profile', desc: 'Allow clients to find you' },
                                    { key: 'show_ratings', label: 'Display ratings', desc: 'Show reviews on your profile' },
                                    { key: 'allow_messages', label: 'Allow messages', desc: 'Let clients message you' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-earth-50">
                                        <div>
                                            <p className="font-medium text-earth-900">{item.label}</p>
                                            <p className="text-sm text-earth-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => updatePrivacy(item.key, !settings.privacy[item.key])}
                                            className={`w-12 h-6 rounded-full transition-colors ${settings.privacy[item.key] ? 'bg-primary-600' : 'bg-earth-200'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.privacy[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-earth-200 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                                            📅
                                        </div>
                                        <div>
                                            <p className="font-medium text-earth-900">Google Calendar</p>
                                            <p className="text-sm text-earth-500">Sync your appointments</p>
                                        </div>
                                    </div>
                                    <Button variant={settings.integrations.google_calendar ? 'ghost' : 'primary'}>
                                        {settings.integrations.google_calendar ? 'Disconnect' : 'Connect'}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-earth-200 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl text-white">
                                            📹
                                        </div>
                                        <div>
                                            <p className="font-medium text-earth-900">Zoom</p>
                                            <p className="text-sm text-earth-500">Auto-create meeting links</p>
                                        </div>
                                    </div>
                                    <Button variant={settings.integrations.zoom ? 'ghost' : 'primary'}>
                                        {settings.integrations.zoom ? 'Disconnect' : 'Connect'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'danger' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h3 className="font-medium text-yellow-800 mb-2">Deactivate Account</h3>
                                    <p className="text-sm text-yellow-700 mb-3">
                                        Temporarily hide your profile. You can reactivate anytime.
                                    </p>
                                    <Button variant="ghost" className="text-yellow-600">Deactivate</Button>
                                </div>

                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                                    <p className="text-sm text-red-700 mb-3">
                                        Permanently delete your account and all data. This cannot be undone.
                                    </p>
                                    <Button variant="ghost" className="text-red-600">Delete Account</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {activeTab !== 'danger' && activeTab !== 'integrations' && (
                        <div className="p-6 border-t border-earth-100 flex justify-end">
                            <Button variant="primary" onClick={handleSave} loading={saving}>
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
