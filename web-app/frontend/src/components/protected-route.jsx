import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
