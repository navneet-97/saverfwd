import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const justAuthenticated = useRef(false);

  // Fetch current user from /api/auth/me (for page reload / initial load)
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Backend returns ApiResponseUserResponse: { success, message, data: UserResponse }
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip fetch if we just logged in/register — user is already set
    if (justAuthenticated.current) {
      justAuthenticated.current = false;
      setLoading(false);
      return;
    }
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const authData = await authApi.login(credentials);
    // Backend returns: { success, message, data: UserResponse, tokens: TokenResponse }
    const accessToken = authData.tokens?.accessToken;
    const refreshToken = authData.tokens?.refreshToken;

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    justAuthenticated.current = true;
    setUser(authData.data);
    setLoading(false);
    return authData;
  };

  const register = async (registerData) => {
    const authData = await authApi.register(registerData);
    const accessToken = authData.tokens?.accessToken;
    const refreshToken = authData.tokens?.refreshToken;

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    justAuthenticated.current = true;
    setUser(authData.data);
    setLoading(false);
    return authData;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
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
