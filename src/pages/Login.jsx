import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { User, Shield, ArrowRight, Lock, KeyRound } from 'lucide-react';
import '../App.css';

// --- IMPORT THE IMAGE ---
// Make sure you saved your image as 'login_bg.jpg' in the 'src' folder
import bgImage from '../login_bg.jpg'; 

export default function Login() {
  const { login } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false); // false = Citizen, true = Secretary
  const [loading, setLoading] = useState(false);

  // --- ADMIN STATE ---
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // --- CITIZEN STATE ---
  const [citizenName, setCitizenName] = useState('');
  const [citizenPass, setCitizenPass] = useState('');

  // 1. ADMIN LOGIN
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin@123') {
      login({ role: 'secretary', name: 'Secretary', email: 'admin@society.com', uid: 'admin' });
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  // 2. CITIZEN LOGIN
  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    if (!citizenName || !citizenPass) {
      alert("Please enter your Name and Password.");
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "citizens"), 
        where("name", "==", citizenName),
        where("password", "==", citizenPass)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;
        login({ 
          role: 'citizen', name: userDoc.name, email: userDoc.aadharNo, 
          uid: userId, photo: userDoc.photo || null
        });
      } else {
        alert("Login Failed!\n\n1. Check your Name spelling.\n2. Password is the last 4 digits of your Aadhaar.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("System Error. Please try again.");
    }
    setLoading(false);
  };

  return (
    // BACKGROUND CONTAINER
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Using your local image with a purple/dark overlay to match the neon vibe
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(88, 28, 135, 0.6)), url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px'
    }}>
      
      {/* GLASSMORPHISM CARD */}
      <div className="login-card" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '50px', 
        background: 'rgba(15, 23, 42, 0.85)', // Dark Navy transparent
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', 
        border: '1px solid rgba(139, 92, 246, 0.3)', // Purple border
        backdropFilter: 'blur(12px)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff', fontWeight: '800', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
            Society Auto
          </h2>
          <p style={{ color: '#c4b5fd', fontSize: '1rem', fontWeight: '500' }}>Smart Management for Modern Living</p>
        </div>
        
        {/* TOGGLE SWITCH */}
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.3)', 
          padding: '6px', 
          borderRadius: '12px', 
          display: 'flex', 
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button 
            onClick={() => setIsAdmin(false)}
            style={{ 
              flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.3s',
              background: !isAdmin ? '#7c3aed' : 'transparent',  // Bright Violet
              color: !isAdmin ? 'white' : '#94a3b8',
              boxShadow: !isAdmin ? '0 4px 12px rgba(124, 58, 237, 0.5)' : 'none'
            }}
          >
            Citizen
          </button>
          <button 
            onClick={() => setIsAdmin(true)}
            style={{ 
              flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.3s',
              background: isAdmin ? '#7c3aed' : 'transparent', 
              color: isAdmin ? 'white' : '#94a3b8',
              boxShadow: isAdmin ? '0 4px 12px rgba(124, 58, 237, 0.5)' : 'none'
            }}
          >
            Secretary
          </button>
        </div>

        {/* --- CITIZEN LOGIN FORM --- */}
        {!isAdmin ? (
          <form onSubmit={handleCitizenLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="dark-input-group">
              <label style={{display:'flex', alignItems:'center', gap:'10px', color:'#e2e8f0', fontWeight:'500', marginBottom:'10px', fontSize:'0.95rem'}}>
                <User size={18} color="#a78bfa"/> Registered Name
              </label>
              <input 
                placeholder="Enter your full name" 
                value={citizenName} 
                onChange={(e) => setCitizenName(e.target.value)} 
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', 
                  background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #475569', 
                  color: 'white', fontSize: '1rem', outline: 'none'
                }}
              />
            </div>
            
            <div className="dark-input-group">
              <label style={{display:'flex', alignItems:'center', gap:'10px', color:'#e2e8f0', fontWeight:'500', marginBottom:'10px', fontSize:'0.95rem'}}>
                <KeyRound size={18} color="#a78bfa"/> Password
              </label>
              <input 
                type="password"
                maxLength="4"
                placeholder="Last 4 digits of Aadhaar" 
                value={citizenPass} 
                onChange={(e) => setCitizenPass(e.target.value)} 
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', 
                  background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #475569', 
                  color: 'white', fontSize: '1rem', outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: '15px', width: '100%', padding: '18px', borderRadius: '12px', 
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', 
                color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', 
                cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(124, 58, 237, 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                transition: 'transform 0.2s'
              }}
            >
               {loading ? "Verifying..." : "Login Securely"} <ArrowRight size={20} />
            </button>

          </form>
        ) : (
          
          /* --- SECRETARY LOGIN FORM --- */
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="dark-input-group">
              <label style={{display:'flex', alignItems:'center', gap:'10px', color:'#e2e8f0', fontWeight:'500', marginBottom:'10px', fontSize:'0.95rem'}}>
                <Shield size={18} color="#a78bfa"/> Admin ID
              </label>
              <input 
                placeholder="admin" 
                value={adminUser} 
                onChange={(e) => setAdminUser(e.target.value)} 
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', 
                  background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #475569', 
                  color: 'white', fontSize: '1rem', outline: 'none'
                }}
              />
            </div>
            
            <div className="dark-input-group">
              <label style={{display:'flex', alignItems:'center', gap:'10px', color:'#e2e8f0', fontWeight:'500', marginBottom:'10px', fontSize:'0.95rem'}}>
                <Lock size={18} color="#a78bfa"/> Password
              </label>
              <input 
                type="password" 
                placeholder="••••••" 
                value={adminPass} 
                onChange={(e) => setAdminPass(e.target.value)} 
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', 
                  background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #475569', 
                  color: 'white', fontSize: '1rem', outline: 'none'
                }}
              />
            </div>
            
            <button 
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '15px', width: '100%', padding: '18px', borderRadius: '12px', 
                background: '#0f172a', 
                color: 'white', border: '1px solid #334155', fontSize: '1.1rem', fontWeight: 'bold', 
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
              }}
            >
               Access Dashboard <Shield size={20} />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}