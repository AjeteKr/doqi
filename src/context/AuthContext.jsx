import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          // Verify token by fetching profile
          const userData = await authService.getProfile(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const newToken = data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(data.user || { email });
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      // Auto-login after registration
      if (data.token) {
        const newToken = data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(data.user || { name, email });
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user info
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        token,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
