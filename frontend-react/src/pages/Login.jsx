import { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react";  
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Field, Input } from '../components/Field';
import Button from '../components/Button';
import './Auth.css';

export default function Login() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const validationSchema = Yup.object({
    email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
    
    password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  });

  // Show a "session expired" type message if AuthProvider's logout()
  // stashed a reason — then clear it so it doesn't reappear later.
  useEffect(() => {
    const reason = sessionStorage.getItem('library_tracker_logout_reason');
    if (reason) {
      setError(reason);
      sessionStorage.removeItem('library_tracker_logout_reason');
    }
  }, []);

  const formik = useFormik({
  initialValues: {
    email: "",
    password: "",
  },

  validationSchema,

  onSubmit: async (values) => {
    setError("");
    setSubmitting(true);

    try {
      const res = await authApi.login({
  email: values.email.trim(),
  password: values.password,
});

console.log("LOGIN RESPONSE:", res);

// Pass access token, refresh token and user
login(
  res.accessToken,
  res.refreshToken,
  res.user
);

navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  },
});

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">📚</span>
          <h1>Library <em>Tracker</em></h1>
        </div>
        <p className="auth-subtitle">Sign in to manage the catalogue, loans, and members.</p>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Field label="Email">
            <Input
            type="email"
            name="email"
            autoComplete="username"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="you@library.com"
            autoFocus
            />
            {formik.touched.email && formik.errors.email && (
              <div className="auth-error">{formik.errors.email}</div>
            )}
          </Field>
          <Field label="Password">
  <div className="password-input">
    <Input
      type={showPassword ? "text" : "password"}
      name="password"
      autoComplete="current-password"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="••••••••"
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {formik.touched.password && formik.errors.password && (
    <div className="auth-error">{formik.errors.password}</div>
  )}
</Field>

          {error && <div className="auth-error" role="alert">{error}</div>}

         <Button
         type="submit"
         disabled={submitting || !formik.isValid}
         style={{ width: '100%', marginTop: '0.5rem' }}
         >
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
