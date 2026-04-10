import { useEffect, useState } from 'react';
import api from '../services/api';

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/owner/dashboard');
      setDashboard(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!dashboard) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Store Owner Dashboard</h2>

      {/* Store Info */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">{dashboard.store.name}</h3>
        <p className="text-gray-600">Email: {dashboard.store.email}</p>
        <p className="text-gray-600">Address: {dashboard.store.address}</p>
        <div className="mt-3 p-3 bg-yellow-50 inline-block rounded">
          <span className="font-bold">Average Rating:</span> 
          <span className="text-2xl ml-2 text-yellow-600">{dashboard.averageRating.toFixed(1)} / 5</span>
        </div>
      </div>

      {/* Users who rated */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Users who submitted ratings</h3>
        {dashboard.ratings.length === 0 ? (
          <p className="text-gray-500">No ratings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.ratings.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.user.name}</td>
                    <td className="p-2">{item.user.email}</td>
                    <td className="p-2 font-bold">{item.rating} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;