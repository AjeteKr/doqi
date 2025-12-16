import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from './RoleGuard';

/**
 * RedirectByRole - Redirects users to their appropriate dashboard/home on initial load
 * Prevents admin/staff from seeing user pages and vice versa
 */
export default function RedirectByRole({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on an appropriate page
      const adminRoutes = ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users', '/admin/settings'];
      const staffRoutes = ['/staff/dashboard', '/staff/messages', '/staff/orders', '/staff/products', '/staff/jobs', '/staff/applications'];
      const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      
      // Skip redirect if on auth routes
      if (authRoutes.includes(currentPath)) {
        return;
      }
      
      // Redirect based on role if user is on the wrong type of page
      if (user.role === ROLES.ADMIN) {
        // Admin shouldn't be on user or staff pages
        if (!currentPath.startsWith('/admin')) {
          navigate('/admin/dashboard', { replace: true });
        }
      } else if (user.role === ROLES.STAFF) {
        // Staff shouldn't be on user or admin pages
        if (!currentPath.startsWith('/staff')) {
          navigate('/staff/dashboard', { replace: true });
        }
      } else if (user.role === ROLES.USER || user.role === ROLES.PREMIUM) {
        // Regular and premium users shouldn't be on admin or staff pages
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/staff')) {
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, isAuthenticated, loading, navigate]);

  return children;
}
