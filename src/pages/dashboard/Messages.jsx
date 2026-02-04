import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Spinner, EmptyState } from '../../components/ui';

/**
 * Messages page with conversation list and message thread.
 */
const Messages = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setConversations(mockConversations);
            if (mockConversations.length > 0) {
                setSelectedConversation(mockConversations[0]);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setMessages(mockMessages[conversationId] || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const newMessage = {
                id: Date.now(),
                content: messageInput,
                sender: 'user',
                timestamp: new Date().toISOString(),
                status: 'sent',
            };
            setMessages(prev => [...prev, newMessage]);
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.professional?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
        setIsMobileThreadOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-earth-900 pt-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-earth-800 rounded-xl shadow-card overflow-hidden transition-colors" style={{ height: 'calc(100vh - 140px)' }}>
                    <div className="flex h-full">
                        {/* Conversation List */}
                        <div className={`w-full md:w-80 lg:w-96 border-r border-earth-100 dark:border-earth-700 flex flex-col ${isMobileThreadOpen ? 'hidden md:flex' : ''}`}>
                            {/* Header */}
                            <div className="p-4 border-b border-earth-100 dark:border-earth-700">
                                <h2 className="text-xl font-semibold text-earth-900 dark:text-white mb-3">Messages</h2>
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg text-sm bg-white dark:bg-earth-700 text-earth-900 dark:text-white placeholder-earth-400 dark:placeholder-earth-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Conversation List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.length === 0 ? (
                                    <div className="p-4 text-center text-earth-500 dark:text-earth-400">
                                        <p>No conversations yet</p>
                                        <p className="text-sm mt-1">Messages with professionals will appear here</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`p-4 border-b border-earth-50 dark:border-earth-700 cursor-pointer hover:bg-earth-50 dark:hover:bg-earth-700 transition-colors ${selectedConversation?.id === conv.id ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative">
                                                    <Avatar
                                                        src={conv.professional?.profile_image_url}
                                                        name={conv.professional?.name}
                                                        size="md"
                                                    />
                                                    {conv.professional?.is_online && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-earth-900 dark:text-white truncate">{conv.professional?.name}</p>
                                                        <span className="text-xs text-earth-400 dark:text-earth-500">{formatTimestamp(conv.last_message_at)}</span>
                                                    </div>
                                                    <p className="text-sm text-earth-500 dark:text-earth-400 truncate">{conv.last_message}</p>
                                                </div>
                                                {conv.unread_count > 0 && (
                                                    <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                                        {conv.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Message Thread */}
                        <div className={`flex-1 flex flex-col ${!isMobileThreadOpen ? 'hidden md:flex' : ''}`}>
                            {selectedConversation ? (
                                <>
                                    {/* Thread Header */}
                                    <div className="p-4 border-b border-earth-100 dark:border-earth-700 flex items-center gap-3">
                                        <button
                                            onClick={() => setIsMobileThreadOpen(false)}
                                            className="md:hidden text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <Avatar
                                            src={selectedConversation.professional?.profile_image_url}
                                            name={selectedConversation.professional?.name}
                                            size="md"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-earth-900 dark:text-white">{selectedConversation.professional?.name}</p>
                                            <p className="text-sm text-earth-500 dark:text-earth-400">
                                                {selectedConversation.professional?.is_online ? (
                                                    <span className="text-green-600 dark:text-green-400">🟢 Online now</span>
                                                ) : (
                                                    `Last seen ${formatTimestamp(selectedConversation.professional?.last_seen || new Date())}`
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/professionals/${selectedConversation.professional?.id}`)}
                                        >
                                            View Profile
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => navigate(`/professionals/${selectedConversation.professional?.id}`)}
                                        >
                                            Book Appointment
                                        </Button>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                                                    <div className={`rounded-2xl px-4 py-2 ${message.sender === 'user'
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-earth-100 dark:bg-earth-700 text-earth-900 dark:text-white'
                                                        }`}>
                                                        <p>{message.content}</p>
                                                    </div>
                                                    <p className={`text-xs text-earth-400 dark:text-earth-500 mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                                                        {formatTimestamp(message.timestamp)}
                                                        {message.sender === 'user' && (
                                                            <span className="ml-1">
                                                                {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-earth-100 dark:border-earth-700">
                                        <div className="flex items-end gap-2">
                                            <button className="p-2 text-earth-400 hover:text-earth-600 dark:text-earth-500 dark:hover:text-earth-300">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                            </button>
                                            <textarea
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type a message..."
                                                rows={1}
                                                className="flex-1 resize-none px-4 py-2 border border-earth-200 dark:border-earth-600 rounded-lg bg-white dark:bg-earth-700 text-earth-900 dark:text-white placeholder-earth-400 dark:placeholder-earth-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                style={{ maxHeight: '120px' }}
                                            />
                                            <Button
                                                variant="primary"
                                                onClick={handleSendMessage}
                                                disabled={!messageInput.trim() || sending}
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <EmptyState
                                        title="Select a conversation"
                                        description="Choose a conversation from the list to start messaging"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock data
const mockConversations = [
    {
        id: 1,
        professional: { id: 1, name: 'Dr. Sarah Johnson', is_online: true },
        last_message: 'Thanks for the session! Looking forward...',
        last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unread_count: 2,
    },
    {
        id: 2,
        professional: { id: 2, name: 'Dr. Michael Chen', is_online: false, last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        last_message: 'Your meal plan is ready to download',
        last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
    },
    {
        id: 3,
        professional: { id: 3, name: 'Emily Rodriguez', is_online: false },
        last_message: 'Remember to practice the breathing exercises',
        last_message_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        unread_count: 0,
    },
];

const mockMessages = {
    1: [
        { id: 1, content: 'Hi! Looking forward to our session tomorrow. Any questions before we start?', sender: 'professional', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: 'read' },
        { id: 2, content: 'Thanks! Just one quick question - should I prepare anything specific for the yoga therapy session?', sender: 'user', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), status: 'read' },
        { id: 3, content: 'Great question! Just wear comfortable clothes and have a yoga mat ready. Also, have some water nearby.', sender: 'professional', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'read' },
        { id: 4, content: 'Perfect, I\'ll be ready! See you tomorrow.', sender: 'user', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), status: 'delivered' },
    ],
    2: [
        { id: 1, content: 'Your personalized meal plan is ready! I\'ve attached it as a PDF.', sender: 'professional', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'read' },
        { id: 2, content: 'Thank you so much! I\'ll review it and let you know if I have questions.', sender: 'user', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), status: 'read' },
    ],
};

export default Messages;
