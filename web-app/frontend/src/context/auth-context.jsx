import { createContext, useState, useCallback } from 'react';
import { auth_service } from '../services/auth-service.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => auth_service.getUser());
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await auth_service.login(email, password);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const errorMsg = 
        (typeof err === 'string' ? err : null) ||
        err.message ||
        err.error?.message ||
        err.error?.error ||
        'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth_service.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading: is_loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
