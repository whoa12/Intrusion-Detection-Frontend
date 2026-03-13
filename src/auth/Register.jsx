import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import './Auth.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminService.register(formData);

      // 1. Save data to localStorage
      // Ensure these keys match exactly what App.js is looking for
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);

      // 2. Crucial Step: Wait a micro-moment for Storage to commit
      // Then use window.location.assign to force a clean transition 
      // to the dashboard while keeping the new storage state.
      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 100);

    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.messageGenerated || "Registration failed.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Creating account...</p>
        </div>
      )}

      <div className="auth-card">
        <div className="brand">
          <h1>SECURE<span>FLOW</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              required
              className="role-select"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Administrator</option>
              <option value="USER">User</option>
            </select>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login" className="auth-link"> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
