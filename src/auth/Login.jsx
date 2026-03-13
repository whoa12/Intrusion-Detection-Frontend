import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminService.login(formData);
      
      // Save data
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);

      // CRITICAL: Use window.location.href to force App.jsx to re-run
      window.location.href = '/dashboard';
      
    } catch (err) {
      alert(err.response?.data?.messageGenerated || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand"><h1>SECURE<span>FLOW</span></h1></div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="auth-footer">
          <p>Need an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;