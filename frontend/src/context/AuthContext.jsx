import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getCurrentUser();
      setUser(data);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    const token = data.accessToken || data.token;
    if (token) localStorage.setItem('accessToken', token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (data.user) {
      setUser(data.user);
    } else {
      await fetchUser();
    }
    return data;
  };

  const register = async (data) => {
    const { data: result } = await authApi.register(data);
    const token = result.accessToken || result.token;
    if (token) localStorage.setItem('accessToken', token);
    if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken);
    if (result.user) {
      setUser(result.user);
    } else {
      await fetchUser();
    }
    return result;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
