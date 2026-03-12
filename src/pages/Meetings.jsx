import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Video, Radio } from 'lucide-react';

export default function Meetings({ role }) {
  const [meeting, setMeeting] = useState({ isActive: false, link: "" });

  const fetchMeeting = async () => {
    const docRef = doc(db, "settings", "meeting");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setMeeting(docSnap.data());
    else await setDoc(docRef, { isActive: false, link: "https://meet.jit.si/SocietyGeneral" });
  };

  useEffect(() => { fetchMeeting(); }, []);

  const toggleMeeting = async () => {
    const newState = !meeting.isActive;
    await updateDoc(doc(db, "settings", "meeting"), { isActive: newState });
    setMeeting({ ...meeting, isActive: newState });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="feed-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        
        <div style={{ 
          width: '80px', height: '80px', 
          background: meeting.isActive ? '#fee2e2' : '#f1f5f9', 
          borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          margin: '0 auto 20px'
        }}>
          <Video size={40} color={meeting.isActive ? '#ef4444' : '#94a3b8'} />
        </div>

        <h2 style={{ marginBottom: '10px' }}>Online Meeting Room</h2>
        
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: meeting.isActive ? '#ef4444' : '#cbd5e1',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          {meeting.isActive ? <Radio size={16} className="animate-pulse" /> : null}
          {meeting.isActive ? "LIVE NOW" : "OFFLINE"}
        </div>

        {meeting.isActive ? (
          <div>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              The general body meeting is currently in progress. Please join using the link below.
            </p>
            <a 
              href={meeting.link} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary" 
              style={{ display: 'inline-block', textDecoration: 'none', fontSize: '1.1rem', padding: '15px 40px' }}
            >
              Join Meeting Room
            </a>
          </div>
        ) : (
          <p style={{ color: '#64748b' }}>
            No meeting is currently active. Please check back later or wait for a notice.
          </p>
        )}

        {role === 'secretary' && (
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>ADMIN CONTROLS</p>
            <button 
              onClick={toggleMeeting} 
              className={meeting.isActive ? "btn-secondary" : "btn-primary"}
            >
              {meeting.isActive ? "Stop Meeting" : "Start Meeting"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}