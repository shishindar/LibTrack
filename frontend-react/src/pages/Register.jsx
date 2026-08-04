import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Field, Input } from '../components/Field';
import Button from '../components/Button';
import './Auth.css';

export default function Register() {
 
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[0-9]/, "Must contain at least one number")
  .matches(
    /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/,
    "Must contain at least one special character"
  ),

  confirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

   const formik = useFormik({
  initialValues: {
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  
  },
  
  validationSchema,

  onSubmit: async (values) => {
    setError("");
    setSubmitting(true);

    try {
      const res = await authApi.register({
        full_name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      login(res.token, res.user);
      navigate("/dashboard", { replace: true });

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
        <p className="auth-subtitle">Create a librarian account.</p>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Field label="Full Name">
           <Input
           name="fullName"
           value={formik.values.fullName}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           autoFocus
           />
           {formik.touched.fullName && formik.errors.fullName && (
            <div className="auth-error">{formik.errors.fullName}</div>
            )}
          </Field>
          <Field label="Email">
            <Input
            type="email"
            name="email"
            autoComplete="username"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
      autoComplete="new-password"
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
          <Field label="Confirm Password">
  <div className="password-input">
    <Input
      type={showConfirmPassword ? "text" : "password"}
      name="confirm"
      autoComplete="new-password"
      value={formik.values.confirm}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="••••••••"
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {formik.touched.confirm && formik.errors.confirm && (
    <div className="auth-error">{formik.errors.confirm}</div>
  )}
</Field>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <Button type="submit" disabled={submitting || !formik.isValid} style={{ width: '100%', marginTop: '0.5rem' }}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}