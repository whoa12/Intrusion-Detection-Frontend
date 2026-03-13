import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import '../pages/Dashboard.css';
import { ShieldAlert, Globe, Code, Link2, Clock, Ban, X, ShieldQuestion } from 'lucide-react';

const AttackDashboard = () => {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get role from localStorage
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN'; // Match the exact string from your backend

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIp, setSelectedIp] = useState("");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    loadAttacks();
    const interval = setInterval(loadAttacks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAttacks = async () => {
    try {
      // Both users and admins can view attacks via the common service
      const response = await adminService.getAllAttacks();
      setAttacks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const openBlockModal = (ip) => {
    // Extra safety: Don't allow non-admins to open modal
    if (!isAdmin) return;
    setSelectedIp(ip);
    setBlockReason(""); 
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async (e) => {
    e.preventDefault();
    
    const blockData = {
      ipAddress: selectedIp,
      reason: blockReason,
      timeStamp: new Date().toISOString()
    };

    try {
      await adminService.blockIp(selectedIp, blockData);
      alert(`Success: ${selectedIp} has been restricted.`);
      setIsModalOpen(false); 
      loadAttacks(); 
    } catch (err) {
      alert("System Error: Could not process block.");
    }
  };

  if (loading) return <div className="loading-state">Syncing with SecureFlow Backend...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="header-section">
          <div className="brand-group">
            <h1 className="brand-title">SECURE<span className="text-blue">FLOW</span>
              <div className="live-indicator"><span className="dot"></span>LIVE MONITOR</div>
            </h1>
            <p className="subtitle">
              {isAdmin ? "Threat Detection & Response Console" : "Security Monitoring Feed"}
            </p>
          </div>
        </header>

        <div className="attack-grid">
          {attacks.map((attack) => (
            <div key={attack.id} className="attack-card">
              <div className="card-top">
                <span className="type-tag">{attack.attackType}</span>
                <span className="time-tag"><Clock size={12} /> {new Date(attack.timeStamp).toLocaleTimeString()}</span>
              </div>

              <div className="info-stack">
                <div className="info-row">
                  <Globe size={14} className="icon-blue" />
                  <span className="info-label">SOURCE</span>
                  <span className="info-value mono">{attack.ipAddress}</span>
                </div>
                <div className="info-row">
                  <Link2 size={14} className="icon-blue" />
                  <span className="info-label">TARGET</span>
                  <span className="info-value truncate">{attack.uri}</span>
                </div>
              </div>

              <div className="payload-wrapper">
                <div className="payload-header"><Code size={12} /> Malicious Payload</div>
                <div className="payload-content"><code>{attack.payload || "// No data captured"}</code></div>
              </div>

              {/* --- ROLE BASED ACTION --- */}
              {isAdmin && (
                <div className="card-footer">
                  <button onClick={() => openBlockModal(attack.ipAddress)} className="btn-block">
                    <Ban size={14} /> BLOCK IP
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- BLOCK IP FORM MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><ShieldQuestion size={22} /> Restriction Protocol</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleConfirmBlock}>
              <div className="form-group">
                <label>Target IP Address</label>
                <input type="text" value={selectedIp} readOnly className="input-disabled" />
              </div>

              <div className="form-group">
                <label>Reason for Restriction</label>
                <textarea 
                  required
                  placeholder="Specify violation (e.g., SQL Injection)..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm">Confirm Block</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackDashboard;