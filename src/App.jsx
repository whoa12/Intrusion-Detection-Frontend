import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import AttackDashboard from './pages/AttackDashboard';
import Navbar from './navbar/Navbar';
import BlockedIps from './pages/BlockedIps';

function App() {
  // Use state so the component re-renders when the status changes
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // This effect will run whenever the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {isAuthenticated && <Navbar />} 

        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/register" element={
            !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
          } />

          <Route path="/dashboard" element={
            isAuthenticated ? <AttackDashboard /> : <Navigate to="/login" replace />
          } />

          <Route path="/blocked-ips" element={
            isAuthenticated ? <BlockedIps /> : <Navigate to="/login" replace />
          } />

          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
