import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/admin`, {
        method: 'PATCH',
      });
      if (response.ok) {
        alert('User promoted to admin successfully');
        fetchUsers(); // Refresh user list
      } else {
        alert('Failed to promote user to admin');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Error promoting user to admin');
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Profile Picture</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={u.photoURL || 'https://via.placeholder.com/40'}
                  alt={u.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{u.displayName || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{u.email}</td>
              <td className="border border-gray-300 px-4 py-2">{u.role || 'user'}</td>
              <td className="border border-gray-300 px-4 py-2">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleMakeAdmin(u._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Make Admin
                  </button>
                )}
                {u.role === 'admin' && <span className="text-green-600 font-semibold">Admin</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
