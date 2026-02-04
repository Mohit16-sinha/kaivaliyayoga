import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Spinner, Avatar, Badge, EmptyState } from '../../components/ui';

/**
 * Professional Messages page - Client communication.
 */
const ProfessionalMessages = () => {
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setConversations(mockConversations);
            const clientId = searchParams.get('client');
            if (clientId) {
                const conv = mockConversations.find(c => c.client.id === parseInt(clientId));
                if (conv) setSelectedConversation(conv);
            } else if (mockConversations.length > 0) {
                setSelectedConversation(mockConversations[0]);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        if (messages[conversationId]) return;
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setMessages(prev => ({ ...prev, [conversationId]: mockMessages }));
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSend = () => {
        if (!newMessage.trim() || !selectedConversation) return;
        const msg = {
            id: Date.now(),
            sender: 'professional',
            content: newMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: [...(prev[selectedConversation.id] || []), msg],
        }));
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const templates = [
        { label: 'Appointment Reminder', text: "Hi! Just a reminder about your appointment tomorrow. Looking forward to seeing you!" },
        { label: 'Pre-Session Instructions', text: "Please wear comfortable clothes and have a yoga mat ready. See you soon!" },
        { label: 'Thank You', text: "Thank you for your session today! Remember to practice the exercises we discussed." },
        { label: 'Follow-up', text: "How are you feeling after our session? Any questions about the exercises?" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-6rem)]">
                <div className="bg-white rounded-xl shadow-card h-full flex overflow-hidden">
                    {/* Conversation List */}
                    <div className={`w-full md:w-80 border-r border-earth-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'
                        }`}>
                        <div className="p-4 border-b border-earth-100">
                            <h2 className="text-lg font-semibold text-earth-900 mb-3">Messages</h2>
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-earth-200 rounded-lg text-sm"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <p className="text-center text-earth-500 py-8">No conversations</p>
                            ) : (
                                filteredConversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full p-4 flex items-center gap-3 hover:bg-earth-50 transition-colors border-b border-earth-50 ${selectedConversation?.id === conv.id ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="relative">
                                            <Avatar name={conv.client.name} size="md" />
                                            {conv.client.is_online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium text-earth-900 truncate">{conv.client.name}</p>
                                                <span className="text-xs text-earth-500">{formatTime(conv.last_message_at)}</span>
                                            </div>
                                            <p className="text-sm text-earth-500 truncate">{conv.last_message}</p>
                                        </div>
                                        {conv.unread_count > 0 && (
                                            <Badge variant="primary">{conv.unread_count}</Badge>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Message Thread */}
                    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'
                        }`}>
                        {selectedConversation ? (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-earth-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="md:hidden p-2 hover:bg-earth-100 rounded-lg"
                                            onClick={() => setSelectedConversation(null)}
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <Avatar name={selectedConversation.client.name} />
                                        <div>
                                            <p className="font-medium text-earth-900">{selectedConversation.client.name}</p>
                                            <p className="text-xs text-earth-500">
                                                {selectedConversation.client.is_online ? '🟢 Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/professional/clients/${selectedConversation.client.id}`}>
                                            <Button variant="ghost" size="sm">View Profile</Button>
                                        </Link>
                                        <Button variant="ghost" size="sm">Book Appointment</Button>
                                    </div>
                                </div>

                                {/* Upcoming Appointment Notice */}
                                {selectedConversation.next_appointment && (
                                    <div className="px-4 py-2 bg-primary-50 border-b border-primary-100 text-sm text-primary-700">
                                        📅 Upcoming appointment: {selectedConversation.next_appointment}
                                    </div>
                                )}

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {(messages[selectedConversation.id] || []).map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'professional' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender === 'professional'
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-earth-100 text-earth-900'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'professional' ? 'text-primary-200' : 'text-earth-400'
                                                    }`}>
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Templates */}
                                <div className="px-4 py-2 border-t border-earth-100 flex gap-2 overflow-x-auto">
                                    {templates.map((tpl, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewMessage(tpl.text)}
                                            className="px-3 py-1 text-xs bg-earth-100 hover:bg-earth-200 rounded-full text-earth-700 whitespace-nowrap"
                                        >
                                            {tpl.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-earth-100">
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-earth-100 rounded-lg text-earth-500">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                        <Button variant="primary" onClick={handleSend} disabled={!newMessage.trim()}>
                                            Send
                                        </Button>
                                    </div>
                                    <p className="text-xs text-earth-400 mt-2 text-center">
                                        💡 All conversations are monitored for quality and safety
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-earth-500">Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock data
const mockConversations = [
    { id: 1, client: { id: 1, name: 'John Smith', is_online: true }, last_message: 'Thank you for the session!', last_message_at: new Date().toISOString(), unread_count: 2, next_appointment: 'Tomorrow, 2:00 PM' },
    { id: 2, client: { id: 2, name: 'Sarah Johnson', is_online: false }, last_message: 'See you next week', last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), unread_count: 0 },
    { id: 3, client: { id: 3, name: 'Michael Brown', is_online: true }, last_message: 'Can we reschedule?', last_message_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), unread_count: 1 },
];

const mockMessages = [
    { id: 1, sender: 'client', content: 'Hi! I wanted to ask about our next session.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 2, sender: 'professional', content: 'Hello! Of course, what would you like to know?', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
    { id: 3, sender: 'client', content: 'Should I prepare anything specific for the session?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 4, sender: 'professional', content: 'Just wear comfortable clothes and bring a water bottle. See you soon!', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { id: 5, sender: 'client', content: 'Thank you for the session!', timestamp: new Date().toISOString() },
];

export default ProfessionalMessages;
