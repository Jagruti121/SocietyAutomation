import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { LogOut, Home, Users, FileText, CreditCard, Video, Calendar, Star } from 'lucide-react';
import '../App.css';

const SecretaryNavbar = ({ setPage, currentPage }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'citizens', label: 'Citizens', icon: <Users size={18} /> },
    { id: 'notices', label: 'Notices', icon: <FileText size={18} /> },
    { id: 'bills', label: 'Bills', icon: <CreditCard size={18} /> },
    { id: 'meetings', label: 'Meetings', icon: <Video size={18} /> },
    { id: 'amenities', label: 'Amenities', icon: <Calendar size={18} /> },
  ];

  const startMeeting = async () => {
    try {
      await updateDoc(doc(db, "settings", "meeting"), { isActive: true });
      alert("🔴 Online Meeting Started Successfully!");
      setPage('meetings'); 
    } catch (error) {
      console.error("Error starting meeting:", error);
      alert("Could not start meeting. Check console.");
    }
  };

  return (
    <div className="top-navbar">
      <div className="nav-brand">
        🏙️ Society<span style={{color: '#6366f1'}}>Admin</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`top-nav-btn ${currentPage === item.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

        {/* UPDATED: Star Button with Text */}
        <button 
          onClick={startMeeting}
          className="top-nav-btn"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '2px', 
            padding: '5px 10px',
            height: 'auto'
          }}
        >
          <Star size={20} fill="#f59e0b" color="#f59e0b" />
          <span style={{fontSize: '0.65rem', fontWeight: 'bold', color: '#f59e0b', lineHeight: 1}}>
            Start Meeting
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Secretary</span>
          <button 
            onClick={logout} 
            className="btn-primary" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem', 
              display: 'flex', alignItems: 'center', gap: '6px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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

export default SecretaryNavbar;