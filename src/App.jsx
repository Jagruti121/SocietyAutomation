
import './App.css';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CitizenNavbar from './components/CitizenNavbar';
import SecretaryNavbar from './components/SecretaryNavbar'; 
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard'; 
import Notices from './pages/Notices';
import Bills from './pages/Bills';
import Meetings from './pages/Meetings';
import Amenities from './pages/Amenities';
import Complaints from './pages/Complaints';
import Citizens from './pages/Citizens';
const AppContent = () => {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <Login />;

  // 1. Determine which Navbar to show based on Role
  const Navbar = user.role === 'secretary' ? SecretaryNavbar : CitizenNavbar;
  
  // 2. Determine which Dashboard to show based on Role
  const Dashboard = user.role === 'secretary' ? SecretaryDashboard : CitizenDashboard;

  return (
    <div className="citizen-layout"> {/* Unified Layout Class */}
      
      {/* --- TOP NAVIGATION BAR --- */}
      <Navbar setPage={setPage} currentPage={page} />

      {/* --- WELCOME HEADER --- */}
      <div className="citizen-welcome">
        <h1>Welcome, {user.name}</h1>
        {user.role === 'secretary' && (
          <p style={{color: 'rgba(255,255,255,0.8)', marginTop:'5px', fontSize: '0.9rem'}}>
            Admin Control Panel
          </p>
        )}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="main-content" style={{ padding: '0 30px 30px 30px' }}>
        
        {/* DASHBOARD (Dynamic based on role) */}
        {page === 'dashboard' && (
          <Dashboard user={user} setPage={setPage} />
        )}

        {/* --- SHARED PAGES --- */}
        
        {/* Notices: Both see it, Secretary can edit */}
        {page === 'notices' && <Notices role={user.role} />}
        
        {/* Bills: Secretary issues, Citizen pays */}
        {page === 'bills' && <Bills user={user} />}
        
        {/* Meetings: Secretary starts, Citizen joins */}
        {page === 'meetings' && <Meetings role={user.role} />}
        
        {/* Amenities: Both can view/book */}
        {page === 'amenities' && <Amenities user={user} setPage={setPage} />}
        
        {/* Complaints: Citizen raises, Secretary views list (via Dashboard) */}
        {page === 'complaints' && <Complaints user={user} setPage={setPage} />}

        {/* --- SECRETARY SPECIFIC PAGES --- */}
        {/* THIS IS THE UPDATE: RENDER THE CITIZENS COMPONENT HERE */}
        {page === 'citizens' && <Citizens />}

      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;