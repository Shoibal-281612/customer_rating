import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import UserStores from './pages/UserStore';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import OwnerDashboard from './pages/OwnerDashboard';

// Component to handle root route based on auth
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/users" replace />;
  if (user.role === 'user') return <Navigate to="/stores" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/stores" element={<PrivateRoute allowedRoles={['user']}><UserStores /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/stores" element={<PrivateRoute allowedRoles={['admin']}><AdminStores /></PrivateRoute>} />
          <Route path="/owner/dashboard" element={<PrivateRoute allowedRoles={['store_owner']}><OwnerDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;