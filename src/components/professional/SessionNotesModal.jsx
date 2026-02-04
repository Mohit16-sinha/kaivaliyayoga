import React, { useState } from 'react';
import { Button, Spinner } from '../ui';

/**
 * Session Notes Modal for adding/editing session notes.
 */
const SessionNotesModal = ({ isOpen, onClose, appointment, existingNotes, onSave }) => {
    const [notes, setNotes] = useState({
        summary: existingNotes?.summary || '',
        recommendations: existingNotes?.recommendations || '',
        internal_notes: existingNotes?.internal_notes || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave?.(notes);
            onClose();
        } catch (error) {
            console.error('Failed to save notes:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-earth-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-earth-900">
                            {existingNotes ? 'Edit Session Notes' : 'Add Session Notes'}
                        </h2>
                        <button onClick={onClose} className="text-earth-400 hover:text-earth-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {appointment && (
                        <p className="text-sm text-earth-500 mt-1">
                            Session with {appointment.client?.name} on {new Date(appointment.scheduled_at).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Session Summary <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={notes.summary}
                            onChange={(e) => setNotes(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="What was covered in this session? Key discussion points, exercises performed, etc."
                            rows={4}
                            className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Follow-up Recommendations
                        </label>
                        <textarea
                            value={notes.recommendations}
                            onChange={(e) => setNotes(prev => ({ ...prev, recommendations: e.target.value }))}
                            placeholder="Home exercises, lifestyle changes, resources to share, next steps..."
                            rows={3}
                            className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Internal Notes (Private)
                        </label>
                        <textarea
                            value={notes.internal_notes}
                            onChange={(e) => setNotes(prev => ({ ...prev, internal_notes: e.target.value }))}
                            placeholder="Personal observations, things to remember for next session..."
                            rows={3}
                            className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                        <p className="text-xs text-earth-500 mt-1">
                            🔒 These notes are private and only visible to you
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-earth-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!notes.summary.trim() || saving}
                        loading={saving}
                    >
                        {existingNotes ? 'Update Notes' : 'Save Notes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SessionNotesModal;
