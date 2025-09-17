import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const InspectorLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { inspectorLogin, isAuthenticated } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await inspectorLogin(formData.username, formData.password);
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-coc-gray-50 dark:bg-coc-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-coc-purple to-coc-blue rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-coc-gray-900 dark:text-white">
            Inspector Access
          </h2>
          <p className="mt-2 text-sm text-coc-gray-600 dark:text-coc-gray-400">
            Special access for CWL table management
          </p>
        </div>

        <div className="card border-2 border-coc-purple">
          <div className="mb-6 p-4 bg-coc-purple bg-opacity-10 rounded-lg">
            <div className="flex items-center space-x-2 text-coc-purple">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Inspector Privileges</span>
            </div>
            <ul className="mt-2 text-sm text-coc-gray-600 dark:text-coc-gray-400 space-y-1">
              <li>• Edit CWL records and points</li>
              <li>• Manage promotion/demotion tables</li>
              <li>• Add custom remarks and notes</li>
              <li>• Bulk update member data</li>
            </ul>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter inspector username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-coc-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter inspector password"
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coc-purple hover:bg-coc-purple-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Access Inspector Panel
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-coc-gray-300 dark:border-coc-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-coc-gray-800 text-coc-gray-500">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/login"
                className="w-full flex justify-center items-center px-4 py-2 border border-coc-gray-300 dark:border-coc-gray-600 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-50 dark:hover:bg-coc-gray-700 transition-colors duration-200"
              >
                Regular User Login
              </Link>
              
              <Link
                to="/register"
                className="w-full flex justify-center items-center px-4 py-2 border border-coc-blue text-coc-blue rounded-lg hover:bg-coc-blue hover:text-white transition-colors duration-200"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="p-4 bg-coc-gray-100 dark:bg-coc-gray-800 rounded-lg">
            <p className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
              <strong>Default Inspector Credentials:</strong>
            </p>
            <p className="text-sm text-coc-gray-500 dark:text-coc-gray-500 mt-1">
              Username: <code className="bg-coc-gray-200 dark:bg-coc-gray-700 px-1 rounded">inspector</code>
            </p>
            <p className="text-sm text-coc-gray-500 dark:text-coc-gray-500">
              Password: <code className="bg-coc-gray-200 dark:bg-coc-gray-700 px-1 rounded">inspector911</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorLogin;








