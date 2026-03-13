import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, Ban, LogOut, Activity } from 'lucide-react';
import '../navbar/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-icon"><Activity size={20} /></div>
          <span className="logo-text">SECURE<span className="text-blue">FLOW</span></span>
        </div>

        <div className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <ShieldAlert size={18} /> <span>Attacks</span>
          </NavLink>

          <NavLink to="/blocked-ips" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Ban size={18} /> <span>Blocked IPs</span>
          </NavLink>
        </div>

        <div className="nav-actions">
          <div className="user-badge">{role}</div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;