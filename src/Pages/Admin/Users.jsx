import { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://pet-adoption-platform-server-side.vercel.app/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      const response = await fetch(`https://pet-adoption-platform-server-side.vercel.app/users/${userId}/admin`, {
        method: 'PATCH',
      });
      if (response.ok) {
        alert('User promoted to admin successfully');
        fetchUsers();
      } else {
        alert('Failed to promote user to admin');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Error promoting user to admin');
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-lg font-semibold">Loading users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Users</h2>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Profile Picture</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={u.photoURL || 'https://via.placeholder.com/40'}
                    alt={u.displayName || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 break-words">
                  {u.displayName || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 break-all">
                  {u.email}
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  {u.role || 'user'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => handleMakeAdmin(u._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold text-sm">Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
