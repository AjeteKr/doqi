import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Role-based access control constants
 */
export const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  USER: 3,
  PREMIUM: 4
};

/**
 * Define allowed routes for each role
 */
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: [
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
    '/admin/users',
    '/admin/settings'
  ],
  [ROLES.STAFF]: [
    '/staff/dashboard',
    '/staff/messages',
    '/staff/orders',
    '/staff/products',
    '/staff/jobs',
    '/staff/applications'
  ],
  [ROLES.USER]: [
    '/',
    '/about',
    '/contact',
    '/products',
    '/product/:slug',
    '/favorites',
    '/starflex',
    '/profile',
    '/terms',
    '/privacy'
  ],
  [ROLES.PREMIUM]: [
    '/',
    '/about',
    '/contact',
    '/products',
    '/product/:slug',
    '/favorites',
    '/starflex',
    '/profile',
    '/terms',
    '/privacy'
  ]
};

/**
 * Check if a user role has access to a specific route
 * @param {number} role - User role ID
 * @param {string} path - Current path
 * @returns {boolean}
 */
export const hasRouteAccess = (role, path) => {
  if (!role || !path) return false;
  
  const allowedRoutes = ROLE_ROUTES[role] || [];
  
  // Check exact match
  if (allowedRoutes.includes(path)) return true;
  
  // Check dynamic routes (e.g., /product/:slug)
  return allowedRoutes.some(route => {
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return false;
  });
};

/**
 * RoleGuard - Restricts access based on user role
 * Shows 404 if user tries to access routes they're not authorized for
 * 
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authorized
 * @param {Array<number>} props.allowedRoles - Array of role IDs allowed to access
 * @param {string} props.currentPath - Current route path for validation
 */
export default function RoleGuard({ children, allowedRoles = [], currentPath }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User tried to access a route they don't have permission for
    return <Navigate to="/404" replace />;
  }

  // Additional check: verify user has access to this specific route
  if (currentPath && !hasRouteAccess(user.role, currentPath)) {
    return <Navigate to="/404" replace />;
  }

  // User is authenticated and authorized
  return children;
}
