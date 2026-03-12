import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Video, 
  Calendar, 
  MessageSquare, 
  LogOut 
} from 'lucide-react';
import '../App.css'; // Assuming your styles are here

const Sidebar = ({ setPage, currentPage }) => {
  const { user, logout } = useAuth();

  // Safety check: If no user is logged in, don't render sidebar
  if (!user) return null;

  return (
    <div className="sidebar">
      <h2 style={{ color: '#60a5fa', marginBottom: '30px' }}>🏙️ SocietyAuto</h2>

      {/* User Profile Section */}
      <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #334155' }}>
        <p style={{ fontSize: '0.85em', color: '#94a3b8', textTransform: 'uppercase' }}>Welcome</p>
        <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{user.name}</p>
        <span style={{ 
            fontSize: '0.75em', 
            background: user.role === 'secretary' ? '#3b82f6' : '#22c55e', 
            padding: '2px 8px', 
            borderRadius: '4px',
            marginTop: '5px',
            display: 'inline-block'
        }}>
            {user.role === 'secretary' ? 'Secretary' : 'Citizen'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        
        {/* Only Secretary sees the "Citizens" Management Link */}
        {user.role === 'secretary' && (
          <button 
            onClick={() => setPage('citizens')} 
            className={`nav-btn ${currentPage === 'citizens' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> Citizens
          </button>
        )}

        <button 
          onClick={() => setPage('notices')} 
          className={`nav-btn ${currentPage === 'notices' ? 'active' : ''}`}
        >
          <FileText size={20} /> Notices
        </button>

        <button 
          onClick={() => setPage('bills')} 
          className={`nav-btn ${currentPage === 'bills' ? 'active' : ''}`}
        >
          <CreditCard size={20} /> Bills
        </button>
        
        <button 
          onClick={() => setPage('complaints')} 
          className={`nav-btn ${currentPage === 'complaints' ? 'active' : ''}`}
        >
          <MessageSquare size={20} /> Complaints
        </button>

        <button 
          onClick={() => setPage('meetings')} 
          className={`nav-btn ${currentPage === 'meetings' ? 'active' : ''}`}
        >
          <Video size={20} /> Meetings
        </button>

        <button 
          onClick={() => setPage('amenities')} 
          className={`nav-btn ${currentPage === 'amenities' ? 'active' : ''}`}
        >
          <Calendar size={20} /> Amenities
        </button>
      </nav>

      {/* Logout Button */}
      <button onClick={logout} className="logout-btn">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;