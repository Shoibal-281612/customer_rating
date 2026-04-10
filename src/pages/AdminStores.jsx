import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]); // for owner dropdown

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({ ...filters, ...sort });
      const res = await api.get(`/admin/stores?${params}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.filter(u => u.role === 'store_owner'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, [filters, sort]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', newStore);
      setMessage('Store created successfully');
      setShowCreateForm(false);
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Creation failed');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Stores</h2>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add Store
        </button>
      </div>

      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input placeholder="Store Name" className="border p-2 rounded" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
        <input placeholder="Email" className="border p-2 rounded" value={filters.email} onChange={e => setFilters({...filters, email: e.target.value})} />
        <input placeholder="Address" className="border p-2 rounded" value={filters.address} onChange={e => setFilters({...filters, address: e.target.value})} />
      </div>

      {/* Create Store Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Create New Store</h3>
          <form onSubmit={handleCreateStore} className="space-y-3">
            <input placeholder="Store Name" className="w-full border p-2 rounded" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required />
            <input type="email" placeholder="Store Email" className="w-full border p-2 rounded" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required />
            <input placeholder="Address (max 400)" className="w-full border p-2 rounded" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required />
            <select className="w-full border p-2 rounded" value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})}>
              <option value="">No Owner (optional)</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Store</button>
          </form>
        </div>
      )}

      {/* Stores Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'name', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Store Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Overall Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id} className="border-t">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.overallRating ? store.overallRating.toFixed(1) : 'No ratings'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStores;