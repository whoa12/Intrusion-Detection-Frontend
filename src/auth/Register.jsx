import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import AttackDashboard from './pages/AttackDashboard';
import Navbar from './navbar/Navbar';
import BlockedIps from './pages/BlockedIps';

function App() {
  // 1. Initialize state by checking localStorage immediately
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 2. Sync state when the app mounts or storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Navbar only visible when authenticated */}
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />} 

        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
          />

          {/* Protected Routes */}
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

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
