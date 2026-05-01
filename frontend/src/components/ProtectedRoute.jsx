import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ADMIN':
      return 'ADMIN';
    case 'ROLE_CANDIDATE':
    case 'CANDIDATE':
      return 'CANDIDATE';
    case 'ROLE_USER':
    case 'ROLE_VOTER':
    case 'VOTER':
    default:
      return 'VOTER';
  }
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-dark-900 dark:text-white text-lg">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  const role = normalizeRole(user.role);
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
