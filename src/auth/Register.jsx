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

    setLoading(true);   // show loading screen

    try {
      const response = await adminService.register(formData);

      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);

     window.location.href = "/dashboard";

    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.messageGenerated || "Registration failed. User might already exist.");
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
            <select name="role" value={formData.role} onChange={handleChange} required>
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
