import React, { useState, useEffect } from 'react';

const UsersManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/admin/users?limit=50', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data.data || []);
    };

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change role to ${newRole}?`)) return;

        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/admin/users/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role: newRole })
        });
        fetchUsers();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.phone}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => toggleRole(u.id, u.role)}
                                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                                    >
                                        Switch Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManager;
