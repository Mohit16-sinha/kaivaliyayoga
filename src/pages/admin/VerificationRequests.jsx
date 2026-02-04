import React, { useState, useEffect } from 'react';
import { Button, Spinner, Badge, Avatar, Tabs } from '../../components/ui';
import { DataTable, ConfirmModal } from '../../components/admin';
import apiClient from '../../services/api';

/**
 * Verification Requests page - Review and manage professional applications.
 */
const VerificationRequests = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Refresh counts when requests change
    const tabs = [
        { id: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
        { id: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
        { id: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/applications');
            // Map backend fields to frontend expected format
            const mappedData = response.data.map(app => ({
                ...app,
                submitted_at: new Date(app.created_at).toLocaleDateString(),
                credentials: app.credentials || [],
                documents: app.documents || [] // Ensure array
            }));
            setRequests(mappedData);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            // Fallback to empty if failed
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (request) => {
        setProcessing(true);
        try {
            const response = await apiClient.post(`/admin/applications/${request.id}/approve`);
            // Update local state
            setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'approved' } : r));
            setSelectedRequest(null);
            alert(`Application approved! Temporary password: ${response.data.temp_password}`);
        } catch (error) {
            console.error('Approval failed:', error);
            alert('Failed to approve application.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return;
        setProcessing(true);
        try {
            await apiClient.post(`/admin/applications/${selectedRequest.id}/reject`, { reason: rejectReason });

            setRequests(requests.map(r => r.id === selectedRequest.id ? {
                ...r,
                status: 'rejected',
                rejection_reason: rejectReason
            } : r));

            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectReason('');
        } catch (error) {
            console.error('Rejection failed:', error);
            alert('Failed to reject application.');
        } finally {
            setProcessing(false);
        }
    };

    const handleRequestMoreInfo = async (request) => {
        console.log('Request more info from:', request.id);
        alert('Email feature not yet implemented.');
    };

    const filteredRequests = requests.filter(r => r.status === activeTab);

    const columns = [
        {
            accessor: 'professional',
            header: 'Professional',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={row.name} size="sm" />
                    <div>
                        <p className="font-medium text-earth-900">{row.name}</p>
                        <p className="text-xs text-earth-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { accessor: 'profession', header: 'Profession', sortable: true },
        { accessor: 'submitted_at', header: 'Submitted', sortable: true },
        {
            accessor: 'documents',
            header: 'Documents',
            render: (docs) => <Badge variant="info">{docs?.length || 0} files</Badge>,
        },
        {
            accessor: 'status',
            header: 'Status',
            render: (status) => (
                <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'}>
                    {status}
                </Badge>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Verification Requests</h1>
                    <p className="text-earth-500 mt-1">Review and approve professional applications</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-t-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                {/* Split View: Table + Detail Panel */}
                <div className="flex gap-6">
                    {/* Table */}
                    <div className={`${selectedRequest ? 'w-1/2' : 'w-full'} transition-all`}>
                        <DataTable
                            data={filteredRequests}
                            columns={columns}
                            onRowClick={setSelectedRequest}
                            emptyMessage={`No ${activeTab} requests`}
                            searchPlaceholder="Search by name or email..."
                        />
                    </div>

                    {/* Detail Panel */}
                    {selectedRequest && (
                        <div className="w-1/2 bg-white rounded-xl shadow-card p-6 h-fit sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-earth-900">Application Details</h3>
                                <button onClick={() => setSelectedRequest(null)} className="text-earth-400 hover:text-earth-600">
                                    ✕
                                </button>
                            </div>

                            {/* Professional Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-earth-100">
                                <Avatar name={selectedRequest.name} size="lg" />
                                <div>
                                    <h4 className="font-semibold text-earth-900">{selectedRequest.name}</h4>
                                    <p className="text-sm text-earth-500">{selectedRequest.email}</p>
                                    <p className="text-sm text-primary-600">{selectedRequest.profession}</p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h5 className="font-medium text-earth-900 mb-2">Bio</h5>
                                <p className="text-sm text-earth-600">{selectedRequest.bio}</p>
                            </div>

                            {/* Credentials */}
                            <div className="mb-6">
                                <h5 className="font-medium text-earth-900 mb-2">Credentials</h5>
                                <ul className="space-y-2">
                                    {selectedRequest.credentials?.map((cred, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-earth-600">
                                            <span className="text-green-500">✓</span> {cred}
                                        </li>
                                    ))}
                                    {(!selectedRequest.credentials || selectedRequest.credentials.length === 0) && (
                                        <p className="text-sm text-gray-400 italic">No credentials provided</p>
                                    )}
                                </ul>
                            </div>

                            {/* Documents */}
                            <div className="mb-6">
                                <h5 className="font-medium text-earth-900 mb-2">Uploaded Documents</h5>
                                <div className="space-y-2">
                                    {selectedRequest.documents?.map((doc, i) => (
                                        <a
                                            key={i}
                                            href={doc.url || "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 p-3 bg-earth-50 rounded-lg hover:bg-earth-100 text-sm"
                                        >
                                            📄 {doc.name || `Document ${i + 1}`}
                                        </a>
                                    ))}
                                    {(!selectedRequest.documents || selectedRequest.documents.length === 0) && (
                                        <p className="text-sm text-gray-400 italic">No documents uploaded</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedRequest.status === 'pending' && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="primary"
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(selectedRequest)}
                                        loading={processing}
                                    >
                                        ✓ Approve
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => setShowRejectModal(true)}
                                    >
                                        ✕ Reject
                                    </Button>
                                </div>
                            )}

                            {selectedRequest.status === 'rejected' && selectedRequest.rejection_reason && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <strong>Rejection Reason:</strong> {selectedRequest.rejection_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRejectModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-earth-900 mb-4">Reject Application</h3>
                        <p className="text-sm text-earth-600 mb-4">
                            Provide a reason for rejection. This will be sent to the applicant.
                        </p>
                        <select
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-4 py-2 border border-earth-200 rounded-lg mb-4"
                        >
                            <option value="">Select a reason...</option>
                            <option value="Invalid credentials">Invalid credentials</option>
                            <option value="Documents unclear or expired">Documents unclear or expired</option>
                            <option value="Insufficient experience">Insufficient experience</option>
                            <option value="Other">Other</option>
                        </select>
                        <textarea
                            rows={3}
                            placeholder="Additional feedback (optional)..."
                            className="w-full px-4 py-2 border border-earth-200 rounded-lg mb-4 resize-none"
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={handleReject}
                                loading={processing}
                                disabled={!rejectReason}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationRequests;
