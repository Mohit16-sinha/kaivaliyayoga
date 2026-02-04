import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button } from '../ui';

/**
 * Client card for professional's client list.
 */
const ClientCard = ({ client, onMessage, onView }) => {
    return (
        <div className="bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
                <Avatar
                    src={client.profile_image_url}
                    name={client.name}
                    size="lg"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-earth-900 truncate">{client.name}</h3>
                        {client.total_sessions >= 10 && (
                            <Badge variant="success" size="sm">Loyal</Badge>
                        )}
                        {client.status === 'inactive' && (
                            <Badge variant="warning" size="sm">Inactive</Badge>
                        )}
                    </div>
                    <p className="text-sm text-earth-500 truncate">{client.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                    <p className="text-earth-500">Total Sessions</p>
                    <p className="font-medium text-earth-900">{client.total_sessions}</p>
                </div>
                <div>
                    <p className="text-earth-500">Last Session</p>
                    <p className="font-medium text-earth-900">
                        {client.last_session ? new Date(client.last_session).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-earth-100">
                <Link to={`/professional/clients/${client.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">View Profile</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onMessage?.(client)}>
                    Message
                </Button>
            </div>
        </div>
    );
};

export default ClientCard;
