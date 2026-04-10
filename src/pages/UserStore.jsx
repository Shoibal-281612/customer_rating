import { useEffect, useState } from 'react';
import api from '../services/api';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchStores = async () => {
    const res = await api.get(`/stores?search=${search}&sortBy=${sortBy}&order=${order}`);
    setStores(res.data);
  };

  useEffect(() => { fetchStores(); }, [search, sortBy, order]);

  const submitRating = async (storeId, rating) => {
    if (rating < 1 || rating > 5) return;
    await api.post(`/stores/${storeId}/ratings`, { rating });
    fetchStores();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Stores</h2>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search by name/address" className="border p-2 rounded flex-1" value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')} className="bg-gray-500 text-white px-3 rounded">Toggle Sort ({order})</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 cursor-pointer" onClick={() => setSortBy('name')}>Store Name</th>
              <th className="p-2 cursor-pointer" onClick={() => setSortBy('address')}>Address</th>
              <th className="p-2">Overall Rating</th>
              <th className="p-2">Your Rating</th>
              <th className="p-2">Submit</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id} className="border-t">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.overallRating ? store.overallRating.toFixed(1) : 'No ratings'}</td>
                <td className="p-2">{store.userRating || 'Not rated'}</td>
                <td className="p-2"><input type="number" min="1" max="5" className="border p-1 w-20" onBlur={e => submitRating(store.id, parseInt(e.target.value))} placeholder="1-5" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserStores;