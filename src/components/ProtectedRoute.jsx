import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props
 * @param {React.Component} props.children - The component to render if authorized
 * @param {Array<number>} props.allowedRoles - Array of role IDs allowed to access this route
 * @param {string} props.redirectTo - Where to redirect if not authorized (default: '/')
 */
export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/' }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has the required role
  return children;
}
