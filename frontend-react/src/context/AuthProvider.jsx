import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "../contexts/authContext";
import {
  setAuthToken,
  clearAuthToken,
  setUnauthorizedHandler,
} from "../api/client";
import { authApi } from "../api/auth";

const ACCESS_TOKEN_KEY = "library_tracker_access_token";
const REFRESH_TOKEN_KEY = "library_tracker_refresh_token";
const USER_KEY = "library_tracker_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    clearAuthToken();

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
    setChecking(false);
  }, []); 

  const login = useCallback((accessToken, refreshToken, newUser) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    setAuthToken(accessToken, refreshToken);

    setToken(accessToken);
    setUser(newUser);
  }, []);

  const updateUser = useCallback((updatedUser) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(updatedUser)
  );

  setUser(updatedUser);
}, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    const refreshToken = localStorage.getItem(
      REFRESH_TOKEN_KEY
    );

    setAuthToken(token, refreshToken);

    authApi
      .me()
      .then((res) => {
        setUser(res.user || res.data || res);
      })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, [token, logout]);

  const value = useMemo(
  () => ({
    user,
    token,
    checking,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  }),
  [user, token, checking, login, logout, updateUser]
);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}