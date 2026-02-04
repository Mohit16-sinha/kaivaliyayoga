import React, { useState, useEffect } from 'react';
import { Button, Card, Tabs, Spinner, Badge } from '../../components/ui';
import { Input, TextArea, Select, Toggle } from '../../components/forms';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * User Profile page with tabs for personal info, health, payments, notifications, security, privacy.
 */
const UserProfile = () => {
    const { user } = useAuth();
    const { currency, changeCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        date_of_birth: user?.date_of_birth || '',
        gender: user?.gender || '',
        country: user?.country || 'Australia',
        city: user?.city || '',
        timezone: user?.timezone || 'Australia/Sydney',
        preferred_language: user?.preferred_language || 'English',
        // Health Profile
        medical_conditions: '',
        allergies: '',
        medications: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        blood_type: '',
        insurance_provider: '',
        // Notifications
        appointment_reminders: true,
        message_notifications: true,
        availability_updates: false,
        marketing_emails: false,
        sms_reminders: true,
        push_enabled: true,
    });

    const tabs = [
        { id: 'personal', label: 'Personal Info' },
        { id: 'health', label: 'Health Profile' },
        { id: 'payment', label: 'Payment Methods' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'security', label: 'Security' },
        { id: 'privacy', label: 'Privacy' },
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // TODO: API call to save profile
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 pb-12 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900 dark:text-white">Account Settings</h1>
                    <p className="text-earth-500 dark:text-earth-400 mt-1">Manage your profile and preferences</p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-earth-800 rounded-xl shadow-card overflow-hidden transition-colors">
                    <div className="border-b border-earth-100 dark:border-earth-700 overflow-x-auto">
                        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    </div>

                    <div className="p-6">
                        {/* Personal Info Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        value={formData.full_name}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        required
                                    />
                                    <div>
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                        />
                                        <span className="text-xs text-green-600">✓ Verified</span>
                                    </div>
                                    <Input
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                    <Input
                                        label="Date of Birth"
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                    />
                                    <Select
                                        label="Gender"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        options={[
                                            { value: '', label: 'Select...' },
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'non-binary', label: 'Non-binary' },
                                            { value: 'prefer-not-say', label: 'Prefer not to say' },
                                        ]}
                                    />
                                    <Select
                                        label="Country"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        options={[
                                            { value: 'Australia', label: 'Australia' },
                                            { value: 'United States', label: 'United States' },
                                            { value: 'United Kingdom', label: 'United Kingdom' },
                                            { value: 'India', label: 'India' },
                                            { value: 'Canada', label: 'Canada' },
                                        ]}
                                    />
                                    <Input
                                        label="City"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                    />
                                    <Select
                                        label="Timezone"
                                        value={formData.timezone}
                                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                                        options={[
                                            { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
                                            { value: 'Australia/Melbourne', label: 'Melbourne (AEDT)' },
                                            { value: 'America/New_York', label: 'New York (EST)' },
                                            { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
                                            { value: 'Europe/London', label: 'London (GMT)' },
                                            { value: 'Asia/Kolkata', label: 'India (IST)' },
                                        ]}
                                    />
                                </div>
                                <Button variant="primary" onClick={handleSave} loading={saving}>
                                    Save Changes
                                </Button>
                            </div>
                        )}

                        {/* Health Profile Tab */}
                        {activeTab === 'health' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        🔒 This information helps professionals provide better care. Only shared with professionals you book.
                                    </p>
                                </div>
                                <TextArea
                                    label="Medical Conditions"
                                    placeholder="Diabetes, hypertension, etc."
                                    value={formData.medical_conditions}
                                    onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                                    rows={3}
                                />
                                <TextArea
                                    label="Allergies"
                                    placeholder="Medications, food, environmental..."
                                    value={formData.allergies}
                                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                                    rows={2}
                                />
                                <TextArea
                                    label="Current Medications"
                                    placeholder="List any medications you're currently taking"
                                    value={formData.medications}
                                    onChange={(e) => handleInputChange('medications', e.target.value)}
                                    rows={2}
                                />
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Emergency Contact Name"
                                        value={formData.emergency_contact_name}
                                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                                    />
                                    <Input
                                        label="Emergency Contact Phone"
                                        value={formData.emergency_contact_phone}
                                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                                    />
                                    <Select
                                        label="Blood Type"
                                        value={formData.blood_type}
                                        onChange={(e) => handleInputChange('blood_type', e.target.value)}
                                        options={[
                                            { value: '', label: 'Select...' },
                                            { value: 'A+', label: 'A+' },
                                            { value: 'A-', label: 'A-' },
                                            { value: 'B+', label: 'B+' },
                                            { value: 'B-', label: 'B-' },
                                            { value: 'AB+', label: 'AB+' },
                                            { value: 'AB-', label: 'AB-' },
                                            { value: 'O+', label: 'O+' },
                                            { value: 'O-', label: 'O-' },
                                            { value: 'unknown', label: 'Unknown' },
                                        ]}
                                    />
                                    <Input
                                        label="Insurance Provider"
                                        placeholder="Optional"
                                        value={formData.insurance_provider}
                                        onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
                                    />
                                </div>
                                <Button variant="primary" onClick={handleSave} loading={saving}>
                                    Save Health Profile
                                </Button>
                            </div>
                        )}

                        {/* Payment Methods Tab */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-earth-900 dark:text-white">Saved Payment Methods</h3>

                                {/* Saved Cards */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-earth-200 dark:border-earth-600 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                                VISA
                                            </div>
                                            <div>
                                                <p className="font-medium text-earth-900 dark:text-white">Visa ending in 1234</p>
                                                <p className="text-sm text-earth-500 dark:text-earth-400">Expires 12/2026</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="success">Default</Badge>
                                            <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-earth-200 dark:border-earth-600 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                                MC
                                            </div>
                                            <div>
                                                <p className="font-medium text-earth-900 dark:text-white">Mastercard ending in 5678</p>
                                                <p className="text-sm text-earth-500 dark:text-earth-400">Expires 08/2025</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">Set as Default</Button>
                                            <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="primary">
                                    + Add New Card
                                </Button>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Email Notifications</h3>
                                    <div className="space-y-4">
                                        <Toggle
                                            label="Appointment reminders"
                                            description="Receive email reminders before your appointments"
                                            checked={formData.appointment_reminders}
                                            onChange={(checked) => handleInputChange('appointment_reminders', checked)}
                                        />
                                        <Toggle
                                            label="New message notifications"
                                            description="Get notified when you receive new messages"
                                            checked={formData.message_notifications}
                                            onChange={(checked) => handleInputChange('message_notifications', checked)}
                                        />
                                        <Toggle
                                            label="Professional availability updates"
                                            description="Get notified when favorited professionals have new slots"
                                            checked={formData.availability_updates}
                                            onChange={(checked) => handleInputChange('availability_updates', checked)}
                                        />
                                        <Toggle
                                            label="Marketing emails"
                                            description="Receive tips, promotions, and platform updates"
                                            checked={formData.marketing_emails}
                                            onChange={(checked) => handleInputChange('marketing_emails', checked)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">SMS Notifications</h3>
                                    <Toggle
                                        label="Appointment reminders via SMS"
                                        description="Receive text message reminders"
                                        checked={formData.sms_reminders}
                                        onChange={(checked) => handleInputChange('sms_reminders', checked)}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Push Notifications</h3>
                                    <Toggle
                                        label="Enable push notifications"
                                        description="Receive real-time notifications in your browser"
                                        checked={formData.push_enabled}
                                        onChange={(checked) => handleInputChange('push_enabled', checked)}
                                    />
                                </div>

                                <Button variant="primary" onClick={handleSave} loading={saving}>
                                    Save Preferences
                                </Button>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Change Password</h3>
                                    <div className="max-w-md space-y-4">
                                        <Input
                                            type="password"
                                            label="Current Password"
                                            placeholder="Enter current password"
                                        />
                                        <Input
                                            type="password"
                                            label="New Password"
                                            placeholder="Enter new password"
                                        />
                                        <Input
                                            type="password"
                                            label="Confirm New Password"
                                            placeholder="Confirm new password"
                                        />
                                        <Button variant="primary">Update Password</Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                                    <p className="text-earth-500 dark:text-earth-400 mb-4">Add an extra layer of security to your account</p>
                                    <Button variant="ghost">Enable 2FA</Button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Active Sessions</h3>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-earth-700 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">💻</span>
                                                <div>
                                                    <p className="font-medium text-earth-900 dark:text-white">Chrome on Windows</p>
                                                    <p className="text-sm text-earth-500 dark:text-earth-400">Current session</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-earth-700 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">📱</span>
                                                <div>
                                                    <p className="font-medium text-earth-900 dark:text-white">Safari on iPhone</p>
                                                    <p className="text-sm text-earth-500 dark:text-earth-400">Last active: 2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-red-500">Log Out All Other Sessions</Button>
                                </div>
                            </div>
                        )}

                        {/* Privacy Tab */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-4">Currency Preference</h3>
                                    <Select
                                        value={currency}
                                        onChange={(e) => changeCurrency(e.target.value)}
                                        options={[
                                            { value: 'AUD', label: 'AUD - Australian Dollar' },
                                            { value: 'USD', label: 'USD - US Dollar' },
                                            { value: 'GBP', label: 'GBP - British Pound' },
                                            { value: 'EUR', label: 'EUR - Euro' },
                                            { value: 'INR', label: 'INR - Indian Rupee' },
                                            { value: 'CAD', label: 'CAD - Canadian Dollar' },
                                        ]}
                                        className="max-w-xs"
                                    />
                                    <p className="text-sm text-earth-500 dark:text-earth-400 mt-2">Prices will be displayed in {currency}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-earth-900 dark:text-white mb-2">Data & Privacy</h3>
                                    <p className="text-earth-500 dark:text-earth-400 mb-4">Get a copy of all your data (GDPR compliance)</p>
                                    <Button variant="ghost">Download My Data</Button>
                                </div>

                                <div className="border-t border-earth-200 dark:border-earth-700 pt-8">
                                    <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                                    <p className="text-earth-500 dark:text-earth-400 mb-4">Permanently delete your account and all data</p>
                                    <Button variant="ghost" className="text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        Delete My Account
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
