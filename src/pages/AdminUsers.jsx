import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ ...filters, ...sort });
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sort]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      setMessage('User created successfully');
      setShowCreateForm(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Creation failed');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add User
        </button>
      </div>

      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input placeholder="Name" className="border p-2 rounded" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
        <input placeholder="Email" className="border p-2 rounded" value={filters.email} onChange={e => setFilters({...filters, email: e.target.value})} />
        <input placeholder="Address" className="border p-2 rounded" value={filters.address} onChange={e => setFilters({...filters, address: e.target.value})} />
        <select className="border p-2 rounded" value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Create New User</h3>
          <form onSubmit={handleCreateUser} className="space-y-3">
            <input placeholder="Name (20-60 chars)" className="w-full border p-2 rounded" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
            <input type="password" placeholder="Password (8-16, uppercase, special)" className="w-full border p-2 rounded" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
            <input placeholder="Address (max 400)" className="w-full border p-2 rounded" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required />
            <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'name', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Name</th>
              <th className="p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'email', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Email</th>
              <th className="p-2">Address</th>
              <th className="p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'role', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.address}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;