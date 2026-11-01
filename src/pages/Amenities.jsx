import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { Calendar, AlertCircle } from 'lucide-react';

export default function Amenities({ user, setPage }) {
  const [facility, setFacility] = useState("Clubhouse");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [busySlots, setBusySlots] = useState([]);

  useEffect(() => {
    if(date && facility) {
      const fetchSlots = async () => {
        try {
          const q = query(collection(db, "bookings"), where("date", "==", date), where("facility", "==", facility));
          const snap = await getDocs(q);
          setBusySlots(snap.docs.map(d => d.data()));
        } catch (err) {
          console.error("Error fetching slots:", err);
        }
      };
      fetchSlots();
    }
  }, [date, facility]);

  const handleBook = async () => {
    if(!date || !startTime || !endTime) { alert("Please fill all details"); return; }
    
    // Check Collision
    const isConflict = busySlots.some(slot => {
        return (startTime >= slot.startTime && startTime < slot.endTime) || 
               (endTime > slot.startTime && endTime <= slot.endTime);
    });

    if (isConflict) {
      alert("❌ Slot already booked! Please check the list below.");
      return;
    }

    try {
      const userEmail = user?.email || (user?.role === 'secretary' ? 'admin@society.com' : (user?.name ? `${user.name.toLowerCase().replace(/\s+/g, '')}@society.com` : "resident@society.com"));
      const userName = user?.name || "Resident";

      const bookingData = {
        user: userName,
        email: userEmail,
        facility: facility || "Clubhouse",
        date,
        startTime,
        endTime,
        createdAt: new Date().toISOString()
      };

      // Strip out any undefined fields so Firestore doesn't reject the payload
      const cleanedData = Object.fromEntries(
        Object.entries(bookingData).filter(([_, v]) => v !== undefined)
      );

      await addDoc(collection(db, "bookings"), cleanedData);
      alert("✅ Booking Confirmed!");
      setPage('dashboard');
    } catch (error) {
      console.error("Error booking amenity:", error);
      alert("Error confirming booking: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <button onClick={() => setPage('dashboard')} className="back-btn">← Back to Dashboard</button>
      
      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{background: '#e0e7ff', padding: '10px', borderRadius: '10px'}}>
                <Calendar size={24} color="#6366f1" />
            </div>
            <h2 style={{margin: 0}}>Book Amenity</h2>
        </div>
        
        <label style={{fontWeight: '600', color: '#475569'}}>Select Facility</label>
        <select value={facility} onChange={e => setFacility(e.target.value)}>
          <option>Clubhouse</option>
          <option>Tennis Court</option>
          <option>Guest Parking</option>
          <option>Swimming Pool</option>
        </select>

        <label style={{fontWeight: '600', color: '#475569'}}>Select Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />

        {/* Highlight Busy Slots */}
        {busySlots.length > 0 && (
          <div style={{
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#991b1b', fontWeight:'bold', marginBottom:'10px'}}>
                <AlertCircle size={16} /> Busy Slots on {date}
            </div>
            <ul style={{margin:0, paddingLeft:'20px', color:'#7f1d1d'}}>
              {busySlots.map((s, i) => <li key={i}>{s.startTime} - {s.endTime} ({s.user})</li>)}
            </ul>
          </div>
        )}

        <div className="time-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{fontWeight: '600', color: '#475569'}}>Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <label style={{fontWeight: '600', color: '#475569'}}>End Time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <button className="btn-primary" onClick={handleBook} style={{ width: '100%', marginTop: '10px' }}>
            Confirm Booking
        </button>
      </div>
    </div>
  );
}