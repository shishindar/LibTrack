import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

/** useAuth — returns { user, token, checking, isAuthenticated, login, logout }. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
