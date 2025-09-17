import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Clans from './pages/Clans';
import Members from './pages/Members';
import Events from './pages/Events';
import MediaGallery from './pages/MediaGallery';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import InspectorLogin from './pages/InspectorLogin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-coc-gray-50 dark:bg-coc-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/clans" element={<Clans />} />
                <Route path="/members" element={<Members />} />
                <Route path="/events" element={<Events />} />
                <Route path="/media" element={<MediaGallery />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inspector-login" element={<InspectorLogin />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--surface-color)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#059669',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#DC2626',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;



