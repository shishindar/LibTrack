import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Field, Input } from '../components/Field';
import Button from '../components/Button';
import './Auth.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  // Show a "session expired" type message if AuthProvider's logout()
  // stashed a reason — then clear it so it doesn't reappear later.
  useEffect(() => {
    const reason = sessionStorage.getItem('library_tracker_logout_reason');
    if (reason) {
      setError(reason);
      sessionStorage.removeItem('library_tracker_logout_reason');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authApi.login({ email: email.trim(), password });
      login(res.token, res.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">📚</span>
          <h1>Library <em>Tracker</em></h1>
        </div>
        <p className="auth-subtitle">Sign in to manage the catalogue, loans, and members.</p>

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@library.com"
              autoFocus
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <Button type="submit" disabled={submitting} style={{ width: '100%', marginTop: '0.5rem' }}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-footnote">
          No account? <Link to="/register">Register as a librarian</Link>
        </p>
      </div>
    </div>
  );
}
