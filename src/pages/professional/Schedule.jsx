import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Badge, Avatar, Spinner, Modal } from '../../components/ui';
import { useCurrency } from '../../contexts/CurrencyContext';

const localizer = momentLocalizer(moment);

/**
 * Professional Schedule/Calendar page with day/week/month views.
 */
const Schedule = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('week');
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [blockedTimes, setBlockedTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        fetchScheduleData();
    }, []);

    const fetchScheduleData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAppointments(mockAppointments);
            setBlockedTimes(mockBlockedTimes);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convert appointments to calendar events
    const events = useMemo(() => {
        const appointmentEvents = appointments.map(apt => ({
            id: apt.id,
            title: `${apt.client?.name} - ${apt.service?.name}`,
            start: new Date(apt.scheduled_at),
            end: new Date(new Date(apt.scheduled_at).getTime() + (apt.duration * 60 * 1000)),
            resource: apt,
            type: 'appointment',
            status: apt.status,
        }));

        const blockedEvents = blockedTimes.map(bt => ({
            id: `blocked-${bt.id}`,
            title: bt.reason || 'Blocked',
            start: new Date(bt.start),
            end: new Date(bt.end),
            resource: bt,
            type: 'blocked',
        }));

        return [...appointmentEvents, ...blockedEvents];
    }, [appointments, blockedTimes]);

    const eventStyleGetter = (event) => {
        let style = {
            borderRadius: '6px',
            opacity: 1,
            border: '0',
            display: 'block',
            fontSize: '12px',
            padding: '4px 8px',
        };

        if (event.type === 'blocked') {
            style.backgroundColor = '#9CA3AF';
            style.color = '#fff';
        } else {
            // Color by status
            switch (event.status) {
                case 'confirmed':
                    style.backgroundColor = '#3B82F6';
                    break;
                case 'pending':
                    style.backgroundColor = '#F59E0B';
                    break;
                case 'completed':
                    style.backgroundColor = '#10B981';
                    break;
                case 'cancelled':
                    style.backgroundColor = '#EF4444';
                    style.textDecoration = 'line-through';
                    break;
                default:
                    style.backgroundColor = '#6B7280';
            }
            style.color = '#fff';
        }

        return { style };
    };

    const handleSelectEvent = (event) => {
        if (event.type === 'appointment') {
            setSelectedEvent(event);
        }
    };

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setShowBlockModal(true);
    };

    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const goToToday = () => {
        setDate(new Date());
    };

    const CustomToolbar = ({ label, onNavigate, onView }) => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 bg-white rounded-xl shadow-card">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onNavigate('PREV')}
                    className="p-2 hover:bg-earth-100 rounded-lg"
                >
                    <svg className="h-5 w-5 text-earth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold text-earth-900 min-w-[200px] text-center">{label}</h2>
                <button
                    onClick={() => onNavigate('NEXT')}
                    className="p-2 hover:bg-earth-100 rounded-lg"
                >
                    <svg className="h-5 w-5 text-earth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-earth-100 rounded-lg p-1">
                    {['day', 'week', 'month'].map((v) => (
                        <button
                            key={v}
                            onClick={() => onView(v)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${view === v ? 'bg-white shadow-sm text-primary-600' : 'text-earth-600 hover:text-earth-900'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Schedule</h1>
                        <p className="text-earth-500 mt-1">View and manage your appointments</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/professional/availability">
                            <Button variant="ghost">⚙️ Availability Settings</Button>
                        </Link>
                        <Button variant="primary" onClick={() => setShowBlockModal(true)}>
                            + Block Time
                        </Button>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500" />
                            <span>Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-500" />
                            <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500" />
                            <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-400" />
                            <span>Blocked</span>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-card p-4" style={{ minHeight: '700px' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        view={view}
                        onView={handleViewChange}
                        date={date}
                        onNavigate={handleNavigate}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        eventPropGetter={eventStyleGetter}
                        components={{
                            toolbar: CustomToolbar,
                        }}
                        min={new Date(0, 0, 0, 8, 0, 0)}
                        max={new Date(0, 0, 0, 20, 0, 0)}
                        step={30}
                        timeslots={2}
                        style={{ height: 650 }}
                    />
                </div>
            </div>

            {/* Appointment Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-earth-900">Appointment Details</h3>
                            <button onClick={() => setSelectedEvent(null)} className="text-earth-400 hover:text-earth-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={selectedEvent.resource?.client?.name} size="lg" />
                                <div>
                                    <p className="font-semibold text-earth-900">{selectedEvent.resource?.client?.name}</p>
                                    <p className="text-sm text-earth-500">{selectedEvent.resource?.service?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-earth-500">Date</p>
                                    <p className="font-medium">{moment(selectedEvent.start).format('ddd, MMM D')}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Time</p>
                                    <p className="font-medium">{moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Duration</p>
                                    <p className="font-medium">{selectedEvent.resource?.duration} minutes</p>
                                </div>
                                <div>
                                    <p className="text-earth-500">Status</p>
                                    <Badge variant={selectedEvent.status === 'confirmed' ? 'success' : 'warning'}>
                                        {selectedEvent.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-earth-100">
                                <Button variant="primary" className="flex-1">Join Meeting</Button>
                                <Button variant="ghost">Message</Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        navigate(`/professional/appointments/${selectedEvent.resource?.id}`);
                                    }}
                                >
                                    Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Time Modal */}
            {showBlockModal && (
                <BlockTimeModal
                    isOpen={showBlockModal}
                    onClose={() => { setShowBlockModal(false); setSelectedSlot(null); }}
                    selectedSlot={selectedSlot}
                    onSave={(data) => {
                        console.log('Block time:', data);
                        setShowBlockModal(false);
                        setSelectedSlot(null);
                        // TODO: API call
                    }}
                />
            )}
        </div>
    );
};

// Block Time Modal Component
const BlockTimeModal = ({ isOpen, onClose, selectedSlot, onSave }) => {
    const [formData, setFormData] = useState({
        start_date: selectedSlot?.start ? moment(selectedSlot.start).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        start_time: selectedSlot?.start ? moment(selectedSlot.start).format('HH:mm') : '09:00',
        end_date: selectedSlot?.end ? moment(selectedSlot.end).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        end_time: selectedSlot?.end ? moment(selectedSlot.end).format('HH:mm') : '17:00',
        reason: '',
        notes: '',
    });

    const reasons = ['Vacation', 'Personal', 'Conference', 'Sick Leave', 'Other'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-earth-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-earth-900">Block Time</h2>
                        <button onClick={onClose} className="text-earth-400 hover:text-earth-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                                className="w-full px-3 py-2 border border-earth-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.start_time}
                                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                                className="w-full px-3 py-2 border border-earth-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                                className="w-full px-3 py-2 border border-earth-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.end_time}
                                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                                className="w-full px-3 py-2 border border-earth-200 rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1">Reason</label>
                        <select
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full px-3 py-2 border border-earth-200 rounded-lg"
                        >
                            <option value="">Select reason...</option>
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Internal notes..."
                            rows={2}
                            className="w-full px-3 py-2 border border-earth-200 rounded-lg resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-earth-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => onSave(formData)}>Block Time</Button>
                </div>
            </div>
        </div>
    );
};

// Mock data
const mockAppointments = [
    {
        id: 1,
        scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        status: 'confirmed',
        client: { name: 'John Smith' },
        service: { name: 'Yoga Therapy' },
    },
    {
        id: 2,
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        status: 'pending',
        client: { name: 'Sarah Johnson' },
        service: { name: 'Consultation' },
    },
    {
        id: 3,
        scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        status: 'confirmed',
        client: { name: 'Michael Brown' },
        service: { name: 'Follow-up' },
    },
];

const mockBlockedTimes = [
    {
        id: 1,
        start: moment().add(3, 'days').hour(12).minute(0).toISOString(),
        end: moment().add(3, 'days').hour(14).minute(0).toISOString(),
        reason: 'Lunch Break',
    },
];

export default Schedule;
