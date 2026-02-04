import React, { useState, useEffect } from 'react';
import { Button, Spinner, Badge } from '../../components/ui';

/**
 * Professional Availability Settings page.
 */
const Availability = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [bufferTime, setBufferTime] = useState(15);
    const [advanceBooking, setAdvanceBooking] = useState(30);
    const [minNotice, setMinNotice] = useState(24);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setWeeklySchedule(mockSchedule);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved:', { weeklySchedule, bufferTime, advanceBooking, minNotice });
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (day) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                is_available: !prev[day]?.is_available,
            },
        }));
    };

    const updateSlot = (day, index, field, value) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.map((slot, i) =>
                    i === index ? { ...slot, [field]: value } : slot
                ),
            },
        }));
    };

    const addSlot = (day) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [...(prev[day]?.slots || []), { start: '09:00', end: '17:00' }],
            },
        }));
    };

    const removeSlot = (day, index) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.filter((_, i) => i !== index),
            },
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
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Availability Settings</h1>
                    <p className="text-earth-500 mt-1">Set your working hours for client bookings</p>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-earth-900 mb-4">Weekly Schedule</h2>
                    <div className="space-y-4">
                        {days.map((day) => {
                            const dayData = weeklySchedule[day] || { is_available: false, slots: [] };
                            return (
                                <div key={day} className="border border-earth-100 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleDay(day)}
                                                className={`w-12 h-6 rounded-full transition-colors ${dayData.is_available ? 'bg-primary-600' : 'bg-earth-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${dayData.is_available ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                            </button>
                                            <span className="font-medium text-earth-900">{dayLabels[day]}</span>
                                        </div>
                                        {dayData.is_available && (
                                            <Badge variant="success">Available</Badge>
                                        )}
                                    </div>

                                    {dayData.is_available && (
                                        <div className="space-y-2 ml-14">
                                            {dayData.slots.map((slot, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(e) => updateSlot(day, index, 'start', e.target.value)}
                                                        className="px-3 py-1.5 border border-earth-200 rounded-lg text-sm"
                                                    />
                                                    <span className="text-earth-400">to</span>
                                                    <input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(e) => updateSlot(day, index, 'end', e.target.value)}
                                                        className="px-3 py-1.5 border border-earth-200 rounded-lg text-sm"
                                                    />
                                                    {dayData.slots.length > 1 && (
                                                        <button
                                                            onClick={() => removeSlot(day, index)}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addSlot(day)}
                                                className="text-sm text-primary-600 hover:text-primary-700"
                                            >
                                                + Add time slot
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Booking Settings */}
                <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-earth-900 mb-4">Booking Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-earth-900">Buffer time between sessions</p>
                                <p className="text-sm text-earth-500">Time to prepare between appointments</p>
                            </div>
                            <select
                                value={bufferTime}
                                onChange={(e) => setBufferTime(parseInt(e.target.value))}
                                className="px-3 py-2 border border-earth-200 rounded-lg"
                            >
                                <option value={0}>No buffer</option>
                                <option value={5}>5 minutes</option>
                                <option value={10}>10 minutes</option>
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-earth-900">Advance booking window</p>
                                <p className="text-sm text-earth-500">How far in advance can clients book</p>
                            </div>
                            <select
                                value={advanceBooking}
                                onChange={(e) => setAdvanceBooking(parseInt(e.target.value))}
                                className="px-3 py-2 border border-earth-200 rounded-lg"
                            >
                                <option value={7}>1 week</option>
                                <option value={14}>2 weeks</option>
                                <option value={30}>1 month</option>
                                <option value={60}>2 months</option>
                                <option value={90}>3 months</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-earth-900">Minimum notice required</p>
                                <p className="text-sm text-earth-500">How soon before can clients book</p>
                            </div>
                            <select
                                value={minNotice}
                                onChange={(e) => setMinNotice(parseInt(e.target.value))}
                                className="px-3 py-2 border border-earth-200 rounded-lg"
                            >
                                <option value={1}>1 hour</option>
                                <option value={2}>2 hours</option>
                                <option value={4}>4 hours</option>
                                <option value={12}>12 hours</option>
                                <option value={24}>24 hours</option>
                                <option value={48}>48 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSave} loading={saving}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

const mockSchedule = {
    monday: { is_available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    tuesday: { is_available: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { is_available: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { is_available: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { is_available: true, slots: [{ start: '09:00', end: '15:00' }] },
    saturday: { is_available: false, slots: [] },
    sunday: { is_available: false, slots: [] },
};

export default Availability;
