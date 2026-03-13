import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ShieldAlert, ShieldOff, Clock, Globe, Terminal, X, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedIp, setSelectedIp] = useState("");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    fetchAttacks();
  }, []);

  const fetchAttacks = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAttacks();
      setAttacks(response.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const openBlockModal = (ip) => {
    setSelectedIp(ip);
    setBlockReason("");
    setShowBlockModal(true);
  };

  const handleBlockConfirm = async (e) => {
    e.preventDefault();
    try {
      await adminService.blockIp({ 
        ipAddress: selectedIp, 
        reason: blockReason || "Repeated suspicious activity" 
      });
      alert(`Node ${selectedIp} has been restricted.`);
      setShowBlockModal(false);
    } catch (err) {
      alert("Failed to block IP.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="header-section">
          <div>
            <h1 className="brand-title">SECURE<span className="text-blue">FLOW</span></h1>
            <p className="subtitle">Threat Intelligence Monitor</p>
          </div>
          <div className="live-indicator">
            <div className="dot"></div> LIVE TRAFFIC SCAN
          </div>
        </header>

        {loading ? (
          <div className="loading-state">Initializing Neural Link...</div>
        ) : (
          <div className="attack-grid">
            {attacks.map((log) => (
              <div key={log.id} className="attack-card">
                <div className="card-top">
                  <span className="type-tag">{log.attackType || 'Suspicious'}</span>
                  <span className="time-tag"><Clock size={12}/> {new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="info-stack">
                  <div className="info-row">
                    <Globe size={14} className="icon-blue" />
                    <span className="info-label">SOURCE:</span>
                    <span className="info-value mono">{log.ipAddress}</span>
                  </div>
                  <div className="payload-wrapper">
                    <div className="payload-header"><Terminal size={10}/> RAW_PAYLOAD</div>
                    <div className="payload-content">
                      <code>{log.payload || 'No payload data available'}</code>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-block" onClick={() => openBlockModal(log.ipAddress)}>
                    <ShieldAlert size={16} /> BLOCK IP
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BLOCK MODAL */}
      {showBlockModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Restrict Node</h2>
              <button className="close-btn" onClick={() => setShowBlockModal(false)}><X /></button>
            </div>
            <form onSubmit={handleBlockConfirm}>
              <div className="form-group">
                <label>Target IP Address</label>
                <input type="text" value={selectedIp} readOnly className="input-disabled" />
              </div>
              <div className="form-group">
                <label>Reason for Restriction</label>
                <textarea 
                  placeholder="Explain why this IP is being blocked..." 
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  required
                  rows="4"
                  /* INLINE STYLE TO FORCE BLACK TEXT */
                  style={{ color: '#000000', backgroundColor: '#ffffff' }} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBlockModal(false)}>Cancel</button>
                <button type="submit" className="btn-confirm">Confirm Restriction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;