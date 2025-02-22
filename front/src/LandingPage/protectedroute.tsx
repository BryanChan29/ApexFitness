import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authUtils';

const ProtectedRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) return <div>Loading...</div>; // Show loading state

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
