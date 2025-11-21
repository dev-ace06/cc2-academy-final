import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  User, 
  Calendar, 
  Image, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isInspector } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/clans', label: 'Clans', icon: Users },
    { path: '/members', label: 'Members', icon: User },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/media', label: 'Media Gallery', icon: Image },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-coc-gray-800 shadow-lg border-b border-coc-gray-200 dark:border-coc-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-coc-gold to-coc-orange rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-coc-gray-900 dark:text-white">
                CC2 Family Stats
              </h1>
              <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400">
                Clash of Clans Dashboard
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-coc-gray-900 dark:text-white">
                CC2 Family
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-coc-gold text-coc-gray-900 font-semibold'
                      : 'text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-200"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-coc-gray-900 dark:text-white">
                      {user.email}
                    </p>
                    <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400">
                      {user.role}
                    </p>
                  </div>
                  
                  {/* Dashboard link for authenticated users */}
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-coc-red hover:bg-coc-red hover:text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/login"
                  className="px-2 sm:px-4 py-1.5 sm:py-2 text-coc-gray-700 dark:text-coc-gray-300 hover:text-coc-blue dark:hover:text-coc-blue transition-colors duration-200 text-xs sm:text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-coc-gold text-coc-gray-900 rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 font-semibold text-xs sm:text-sm"
                >
                  Register
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/inspector-login"
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-coc-purple text-white rounded-lg hover:bg-coc-purple-dark transition-colors duration-200 text-xs sm:text-sm"
                    title="Inspector Access"
                  >
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    <span className="hidden sm:inline">Inspector</span>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-coc-gray-200 dark:border-coc-gray-700 py-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm ${
                      isActive(item.path)
                        ? 'bg-coc-gold text-coc-gray-900 font-semibold'
                        : 'text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-coc-gray-200 dark:border-coc-gray-700 my-2"></div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400 mb-1">Logged in as:</p>
                    <p className="text-sm font-medium text-coc-gray-900 dark:text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400">
                      {user.role}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2.5 text-coc-red hover:bg-coc-red hover:text-white rounded-lg transition-colors duration-200 text-sm text-left w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <div className="border-t border-coc-gray-200 dark:border-coc-gray-700 my-2"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 bg-coc-gold text-coc-gray-900 font-semibold rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 text-sm"
                  >
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/inspector-login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 bg-coc-purple text-white rounded-lg hover:bg-coc-purple-dark transition-colors duration-200 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Inspector Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






