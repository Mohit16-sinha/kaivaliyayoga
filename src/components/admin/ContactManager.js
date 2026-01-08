import React, { useState, useEffect } from 'react';

const ContactManager = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/admin/contact?status=all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setMessages(data || []);
    };

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/admin/contact/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        fetchMessages();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Contact Messages</h2>
            <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-4 border rounded ${msg.status === 'unread' ? 'border-l-4 border-l-red-500 bg-red-50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold">{msg.subject}</h3>
                                <p className="text-sm text-gray-600">{msg.name} ({msg.email})</p>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-800 mb-4">{msg.message}</p>
                        <div className="flex gap-2">
                            {msg.status !== 'read' && (
                                <button onClick={() => updateStatus(msg.id, 'read')} className="text-xs bg-white border px-2 py-1 rounded">Mark Read</button>
                            )}
                            {msg.status !== 'replied' && (
                                <button onClick={() => updateStatus(msg.id, 'replied')} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mark Replied</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactManager;
