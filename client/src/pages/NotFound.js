import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-coc-gray-50 dark:bg-coc-gray-900">
      <div className="text-center">
        <div className="mx-auto h-32 w-32 bg-gradient-to-br from-coc-gold to-coc-orange rounded-full flex items-center justify-center mb-8">
          <Shield className="h-16 w-16 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-coc-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-coc-gray-700 dark:text-coc-gray-300 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-coc-gray-600 dark:text-coc-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to the action!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-coc-gold text-coc-gray-900 rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600 transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-coc-gray-500 dark:text-coc-gray-500">
            Need help? Contact our support team or check out our{' '}
            <Link to="/help" className="text-coc-blue hover:text-coc-blue-dark">
              help center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;








