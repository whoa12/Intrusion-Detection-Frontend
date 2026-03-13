import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import AttackDashboard from './pages/AttackDashboard';
import Navbar from './navbar/Navbar';
import BlockedIps from './pages/BlockedIps';

function App() {
  // Initialize state by checking localStorage immediately
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Listen for changes to ensure the UI stays in sync with storage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Check once on mount
    checkAuth();

    // Optional: Listen for storage changes (helpful if user logs out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Navbar only visible when authenticated */}
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />} 

        <Routes>
          {/* Public Routes: Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
          />

          {/* Protected Routes: Redirect to login if not authenticated */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <AttackDashboard /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/blocked-ips" 
            element={isAuthenticated ? <BlockedIps /> : <Navigate to="/login" replace />} 
          />

          {/* Root Handling */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />

          {/* Catch-all/404 handling */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
