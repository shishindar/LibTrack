import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from '../contexts/authContext';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import { authApi } from '../api/auth';

const STORAGE_KEY = 'library_tracker_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_KEY)
  );
  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setChecking(false);
  }, []);

  const login = useCallback((newToken, newUser) => {
    console.log('SAVING TOKEN:', newToken);

    localStorage.setItem(STORAGE_KEY, newToken);

    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    setAuthToken(token);

    authApi
      .me()
      .then((res) => {
        setUser(res.user || res.data || res);
      })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      checking,
      isAuthenticated: !!token && !!user,
      login,
      logout,
    }),
    [user, token, checking, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}