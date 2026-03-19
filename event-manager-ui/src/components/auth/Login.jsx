import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { authService } from '../../services/authService';
import { FormInput } from '../common/FormInput';
import { Button } from '../common/Button';
import * as localStorage from '../../utils/localStorage';
import { TOKEN_KEY, USER_KEY } from '../../utils/constants';
import './Auth.css';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      const { data } = response;
      login(
        data.user,
        data.accessToken,
        data.refreshToken,
        data.tokenType,
        data.expiresIn
      );
      success('Login successful!');

      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname;
      navigate(from || (data.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      showError(errorMessage);
      setErrors({ form: errorMessage });
      if (formData.password) {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to your event management account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          {errors.form && <div className="form-error-message">{errors.form}</div>}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            loading={loading}
            className="auth-submit"
          >
            Login
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
