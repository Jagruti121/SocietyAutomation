import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Upload } from 'lucide-react';

export default function Complaints({ user, setPage }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [attachment, setAttachment] = useState(""); // Stores Base64 string

  // Convert File to Base64 String
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result); // Result is the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc) return;

    try {
      const userEmail = user?.email || (user?.role === 'secretary' ? 'admin@society.com' : 'resident@society.com');
      const complaintData = {
        email: userEmail,
        userName: user?.name || "Resident",
        title,
        text: desc,
        imageUrl: attachment || "", // Store the image string
        voteCount: 0,
        date: new Date().toISOString(),
        status: "Pending"
      };

      const cleanedData = Object.fromEntries(
        Object.entries(complaintData).filter(([_, v]) => v !== undefined)
      );

      await addDoc(collection(db, "complaints"), cleanedData);
      
      alert("Complaint Raised Successfully!");
      setPage('dashboard');
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit. Try again.");
    }
  };

  return (
    <div className="page-container">
      <button onClick={() => setPage('dashboard')} className="back-btn">← Back to Dashboard</button>
      
      <div className="form-card">
        <h2>📝 Raise a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label>Issue Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Broken Lift" 
            required 
          />
          
          <label>Description</label>
          <textarea 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            rows="4" 
            placeholder="Describe the issue in detail..." 
            required 
          />
          
          <label>Attach Photo (Optional)</label>
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              accept="image/*" 
              id="file-input"
              onChange={handleImageChange} 
              style={{display: 'none'}} 
            />
            <label htmlFor="file-input" className="file-upload-btn">
              <Upload size={18} /> 
              {attachment ? "Image Attached ✅" : "Click to Upload Image"}
            </label>
          </div>

          {attachment && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Preview:</p>
              <img 
                src={attachment} 
                alt="Preview" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
              />
            </div>
          )}
          
          <button className="btn-primary" type="submit" style={{ marginTop: '20px' }}>Submit Complaint</button>
        </form>
      </div>
    </div>
  );
}