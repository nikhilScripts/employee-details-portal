import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token in URL (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      auth.setToken(tokenFromUrl);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load user from API
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await auth.getMe();
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (err) {
        console.error('Failed to load user:', err);
        auth.setToken(null);
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = () => {
    // Redirect to Microsoft SSO
    window.location.href = auth.getLoginUrl();
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;