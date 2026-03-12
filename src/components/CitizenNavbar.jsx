import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, FileText, Video, Calendar } from 'lucide-react';
import '../App.css';

const CitizenNavbar = ({ setPage, currentPage }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'bills', label: 'Bills', icon: <FileText size={18} /> },
    { id: 'meetings', label: 'Meetings', icon: <Video size={18} /> },
    { id: 'amenities', label: 'Amenities', icon: <Calendar size={18} /> },
  ];

  return (
    <div className="top-navbar">
      {/* Left Side: Brand Name with Gradient Effect */}
      <div className="nav-brand">
        🏙️ Society Auto
      </div>

      {/* Right Side: Navigation & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`top-nav-btn ${currentPage === item.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Divider Line */}
        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

        {/* User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>
            {user.email}
          </span>
          
          <button 
            onClick={logout} 
            className="btn-primary" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red gradient for logout
              boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default CitizenNavbar;