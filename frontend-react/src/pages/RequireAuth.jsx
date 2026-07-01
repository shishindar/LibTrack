import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RequireAuth({ children }) {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <div className="auth-checking">Checking session…</div>;
  }

  if (!isAuthenticated) {
    // Remember where the user was headed so Login can send them back after success.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
