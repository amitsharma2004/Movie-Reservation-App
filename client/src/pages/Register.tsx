import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types/auth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    fullname: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black dark:bg-white auth-container">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl w-full max-w-md border dark:border-gray-700 auth-card">
        <div className="text-center auth-header">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 auth-title">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join us for the best movie experience</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm error-message">
              {error}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors placeholder-gray-500 dark:placeholder-gray-400 form-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors placeholder-gray-500 dark:placeholder-gray-400 form-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors placeholder-gray-500 dark:placeholder-gray-400 form-input"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 password-hint">
              Must contain at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center border-t border-gray-200 dark:border-gray-700 auth-footer">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;