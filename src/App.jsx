import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import AttackDashboard from './pages/AttackDashboard';
import Navbar from './navbar/Navbar';
import BlockedIps from './pages/BlockedIps';

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Navbar only visible when logged in */}
        {isAuthenticated && <Navbar />} 

        <Routes>
          {/* 1. Public Routes: If logged in, go to dashboard */}
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/register" element={
            !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
          } />

          {/* 2. Protected Routes: If not logged in, go to login */}
          <Route path="/dashboard" element={
            isAuthenticated ? <AttackDashboard /> : <Navigate to="/login" replace />
          } />

          <Route path="/blocked-ips" element={
            isAuthenticated ? <BlockedIps /> : <Navigate to="/login" replace />
          } />

          {/* 3. Root Handling */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } />

          {/* 4. Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;