import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="hover:text-green-200">Home</Link>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin/users" className="hover:text-green-200">Admin Panel</Link>}
            {user.role === 'user' && <Link to="/stores" className="hover:text-green-200">Stores</Link>}
            {user.role === 'store_owner' && <Link to="/owner/dashboard" className="hover:text-green-200">My Store</Link>}
            <Link to="/change-password" className="hover:text-green-200">Change Password</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-200">Login</Link>
            <Link to="/register" className="hover:text-green-200">Register</Link>
          </>
        )}
      </div>
      {user && (
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;