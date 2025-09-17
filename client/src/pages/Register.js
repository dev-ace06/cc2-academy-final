import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    clanTag: '',
    role: 'Member'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await register(
      formData.email,
      formData.password,
      formData.clanTag || undefined,
      formData.role
    );
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
    
    setLoading(false);
  };

  const roleOptions = [
    { value: 'Member', label: 'Member' },
    { value: 'Elder', label: 'Elder' },
    { value: 'Co-Leader', label: 'Co-Leader' },
    { value: 'Leader', label: 'Leader' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-coc-gray-50 dark:bg-coc-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-coc-gold to-coc-orange rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-coc-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-coc-gray-600 dark:text-coc-gray-400">
            Join CC2 Academy Stats community
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Email address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-coc-gray-400 hover:text-coc-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-coc-gray-400 hover:text-coc-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-coc-gray-400 hover:text-coc-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-coc-gray-400 hover:text-coc-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="clanTag" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Clan Tag (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="clanTag"
                  name="clanTag"
                  type="text"
                  value={formData.clanTag}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="#YOUR_CLAN_TAG"
                />
              </div>
              <p className="mt-1 text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Your clan tag in Clash of Clans (e.g., #ABC123)
              </p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Role in Clan
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Your current role in your clan
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/login"
                  className="font-medium text-coc-blue hover:text-coc-blue-dark transition-colors duration-200"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-coc-blue hover:text-coc-blue-dark">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-coc-blue hover:text-coc-blue-dark">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;








