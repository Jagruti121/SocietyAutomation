import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import Tesseract from 'tesseract.js';
import { Upload, Save, UserPlus, Users, ArrowLeft, Loader, RefreshCw, Eye, Trash2, X, Download } from 'lucide-react';
import '../App.css';

export default function Citizens() {
  const [view, setView] = useState('home'); // 'home', 'register', 'list'
  
  // --- REGISTRATION STATE ---
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null); // Local preview URL
  const [saveImage, setSaveImage] = useState(null); // Compressed Base64 for DB
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', aadharNo: '', dob: '', gender: '', phone: '', address: ''
  });

  // --- LIST STATE ---
  const [citizensList, setCitizensList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);

  // ==========================================
  //      VIEW 1: HOME (MENU)
  // ==========================================
  if (view === 'home') {
    return (
      <div className="dashboard-wrapper" style={{textAlign: 'center', paddingTop: '50px'}}>
        <h2 style={{color: '#f1f5f9', marginBottom: '40px'}}>👥 Citizen Management</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto'}}>
          
          <div onClick={() => setView('register')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
            <div style={{background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
              <UserPlus size={40} color="#6366f1" />
            </div>
            <h3 style={{color: 'white'}}>Register New Citizen</h3>
          </div>

          <div onClick={() => { setView('list'); fetchCitizens(); }} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
            <div style={{background: 'rgba(34, 197, 94, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
              <Users size={40} color="#22c55e" />
            </div>
            <h3 style={{color: 'white'}}>Current Citizens</h3>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  //      VIEW 2: CITIZEN LIST
  // ==========================================
  
  async function fetchCitizens() {
    setFetching(true);
    try {
      const q = query(collection(db, "citizens"), orderBy("registeredAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCitizensList(list);
    } catch (error) { console.error(error); }
    setFetching(false);
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this citizen? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "citizens", id));
        fetchCitizens();
      } catch (error) {
        alert("Error deleting record");
      }
    }
  }

  if (view === 'list') {
    return (
      <div className="dashboard-wrapper">
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button onClick={() => setView('home')} className="btn-secondary" style={{marginRight: '20px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <ArrowLeft size={18}/> Back
                </button>
                <h2 style={{color: 'white', margin: 0}}>📋 Citizen Directory</h2>
            </div>
            <button onClick={fetchCitizens} className="btn-secondary"><RefreshCw size={18}/></button>
          </div>

          {fetching ? (
            <div style={{textAlign: 'center', padding: '50px', color: '#94a3b8'}}><Loader className="spin" size={32} /></div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
              {citizensList.length === 0 ? <p style={{color: '#64748b'}}>No records found.</p> : (
                citizensList.map((citizen) => (
                  <div key={citizen.id} className="feed-card" style={{background: '#1e293b', border: '1px solid #334155', padding: '20px', position: 'relative'}}>
                    
                    <button 
                        onClick={() => handleDelete(citizen.id)}
                        style={{position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'}}
                        title="Delete Citizen"
                    >
                        <Trash2 size={20} />
                    </button>

                    <h3 style={{margin: '0 0 5px 0', color: '#f8fafc', paddingRight: '30px'}}>{citizen.name}</h3>
                    <p style={{color: '#6366f1', fontWeight: 'bold', margin: '0 0 15px 0', fontSize: '0.9rem'}}>{citizen.aadharNo}</p>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px'}}>
                      <div>📅 {citizen.dob}</div>
                      <div>👤 {citizen.gender}</div>
                      <div style={{gridColumn: 'span 2'}}>📞 {citizen.phone || "N/A"}</div>
                      <div style={{gridColumn: 'span 2'}}>📍 {citizen.address}</div>
                    </div>

                    <button 
                        onClick={() => setViewPhoto(citizen.photo)}
                        className="btn-secondary" 
                        style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px'}}
                    >
                        <Eye size={16}/> View Aadhaar Card
                    </button>

                  </div>
                ))
              )}
            </div>
          )}

          {viewPhoto && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)', zIndex: 1000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
                    <button 
                        onClick={() => setViewPhoto(null)}
                        style={{position: 'absolute', top: '-40px', right: '-40px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        <X size={20} color="black"/>
                    </button>
                    
                    <img src={viewPhoto} alt="Aadhaar" style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', border: '1px solid #555'}} />
                    
                    <div style={{marginTop: '20px', textAlign: 'center'}}>
                        <a 
                            href={viewPhoto} 
                            download="aadhaar_card.jpg"
                            className="btn-primary"
                            style={{display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none'}}
                        >
                            <Download size={18}/> Download Image
                        </a>
                    </div>
                </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  //      VIEW 3: REGISTER (Fixed Image Processing)
  // ==========================================
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      processAndScan(url); 
    }
  };

  const processAndScan = (imageUrl) => {
    setLoading(true);
    setProgress(0);

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // --- STEP 1: CREATE COMPRESSED COPY FOR DATABASE ---
      // Resize to max 800px width to keep file size small (under 1MB)
      const storageScale = Math.min(800 / img.width, 1);
      canvas.width = img.width * storageScale;
      canvas.height = img.height * storageScale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Save as JPEG with 0.6 quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      setSaveImage(compressedBase64);

      // --- STEP 2: CREATE HIGH CONTRAST COPY FOR OCR ---
      // Resize again for OCR (Tesseract likes ~1500px width)
      const ocrScale = Math.min(1500 / img.width, 1);
      canvas.width = img.width * ocrScale;
      canvas.height = img.height * ocrScale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply Binarization (Black & White)
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const color = avg > 110 ? 255 : 0; 
        data[i] = color; data[i + 1] = color; data[i + 2] = color; 
      }
      ctx.putImageData(imageData, 0, 0);
      
      scanImage(canvas.toDataURL());
    };
  };

  const scanImage = async (processedImage) => {
    try {
      const result = await Tesseract.recognize(processedImage, 'eng', {
        logger: m => { if (m.status === 'recognizing text') setProgress(parseInt(m.progress * 100)); }
      });
      parseData(result.data.text);
    } catch (err) { console.error(err); alert("Error scanning image."); }
    setLoading(false);
  };

  const parseData = (rawText) => {
    const cleanText = rawText.replace(/[^a-zA-Z0-9\s,:\/\-\.\n]/g, ''); 
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let extracted = { ...formData };
    
    // Logic as before
    const pinRegex = /\b\d{6}\b/;
    const phoneRegex = /\b[6-9]\d{9}\b/;
    const relationRegex = /\b(S\/O|C\/O|W\/O|D\/O)\b/i; 
    let pinIndex = -1, relationIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (pinRegex.test(lines[i])) pinIndex = i;
        if (relationRegex.test(lines[i])) relationIndex = i;
    }

    if (pinIndex !== -1) {
        let addressLines = [];
        let pinLine = lines[pinIndex];
        if (phoneRegex.test(pinLine)) pinLine = pinLine.replace(phoneRegex, '').trim();
        addressLines.unshift(pinLine);
        let startIndex = relationIndex !== -1 ? relationIndex + 1 : Math.max(0, pinIndex - 4);
        for (let i = pinIndex - 1; i >= startIndex; i--) {
            if (i === relationIndex || lines[i].toLowerCase().includes('address') || /^To$/i.test(lines[i])) break;
            addressLines.unshift(lines[i]);
        }
        extracted.address = addressLines.join(', ');
    } else {
        const addrIdx = rawText.toLowerCase().indexOf('address');
        if (addrIdx !== -1) extracted.address = rawText.substring(addrIdx + 8, addrIdx + 150).split('\n').join(', ');
    }

    let phoneFound = false;
    if (pinIndex !== -1) {
        for(let i = pinIndex; i < lines.length; i++) {
            const match = lines[i].match(phoneRegex);
            if (match) { extracted.phone = match[0]; phoneFound = true; break; }
        }
    }
    if (!phoneFound) {
        const matches = cleanText.match(/\b[6-9]\d{9}\b/g);
        if (matches && matches.length > 0) extracted.phone = matches[matches.length - 1]; 
    }

    if (relationIndex > 0) extracted.name = lines[relationIndex - 1];
    else {
        for (let line of lines) {
            if (/^[A-Za-z\s\.]+$/.test(line) && line.length > 4 && !line.includes('Govt') && !line.includes('India')) {
                extracted.name = line; break;
            }
        }
    }

    const aadharMatch = cleanText.match(/\d{4}\s\d{4}\s\d{4}/);
    if (aadharMatch) extracted.aadharNo = aadharMatch[0];
    if (/female/i.test(cleanText)) extracted.gender = "Female";
    else if (/male/i.test(cleanText)) extracted.gender = "Male";
    else if (/transgender/i.test(cleanText)) extracted.gender = "Transgender";
    const dobMatch = cleanText.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dobMatch) extracted.dob = dobMatch[0];

    setFormData(prev => ({ ...prev, ...extracted }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.aadharNo) { alert("Name and Aadhaar Number are required."); return; }
    setLoading(true);
    try {
      const q = query(collection(db, "citizens"), where("aadharNo", "==", formData.aadharNo));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) { alert("⚠️ User Already Registered!"); setLoading(false); return; }

      const cleanAadhar = formData.aadharNo.replace(/\s/g, '');
      const password = cleanAadhar.length >= 4 ? cleanAadhar.slice(-4) : "1234";

      // SAVE COMPRESSED IMAGE
      await addDoc(collection(db, "citizens"), {
        ...formData,
        role: 'citizen',
        password: password,
        photo: saveImage, 
        registeredAt: new Date().toISOString()
      });

      alert(`✅ Citizen Saved!`);
      setFormData({ name: '', aadharNo: '', dob: '', gender: '', phone: '', address: '' });
      setImage(null);
      setSaveImage(null);
      setView('home');
    } catch (error) { 
        console.error("Save Error:", error); 
        alert("Error saving data: " + error.message); 
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-wrapper">
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div className="feed-card" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div className="card-header" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button onClick={() => setView('home')} style={{background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer'}}>
             <ArrowLeft size={24} />
          </button>
          <h3><UserPlus className="icon" /> Register New Citizen</h3>
        </div>

        <div className="card-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
          
          <div>
            <div style={{display:'grid', gap:'15px'}}>
              <div className="dark-input-group"><label>Full Name</label><input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} placeholder="Name" /></div>
              <div className="dark-input-group"><label>Aadhaar Number</label><input value={formData.aadharNo} onChange={e=>setFormData({...formData, aadharNo:e.target.value})} placeholder="xxxx xxxx xxxx"/></div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                 <div className="dark-input-group"><label>DOB / Year</label><input value={formData.dob} onChange={e=>setFormData({...formData, dob:e.target.value})} placeholder="DD/MM/YYYY"/></div>
                 <div className="dark-input-group"><label>Gender</label><select value={formData.gender} onChange={e=>setFormData({...formData, gender:e.target.value})} style={{background:'#222', color:'white'}}><option value="">Select</option><option>Male</option><option>Female</option><option>Transgender</option></select></div>
              </div>
              <div className="dark-input-group"><label>Phone Number</label><input value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} placeholder="Phone" style={{borderColor: formData.phone ? '#4ade80' : '#444'}}/></div>
              <div className="dark-input-group"><label>Address</label><textarea rows="3" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} placeholder="Address" style={{borderColor: formData.address ? '#4ade80' : '#444'}}/></div>
            </div>
            <button className="btn-primary" onClick={handleSave} style={{width:'100%', marginTop:'20px'}} disabled={loading}>
              {loading ? "Checking..." : <><Save size={18} style={{marginRight:'8px'}}/> Save & Register</>}
            </button>
          </div>

          <div>
            <div className="file-upload-wrapper" style={{marginBottom: '20px', padding: '20px', border: '2px dashed #444', background: '#1a1a1a', textAlign: 'center', borderRadius: '12px'}}>
              <input type="file" id="up" onChange={handleImageChange} style={{display:'none'}} />
              <label htmlFor="up" className="btn-secondary" style={{display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'12px 24px', fontSize:'1rem', cursor:'pointer', background: '#6366f1', color: 'white', border: 'none', width: '80%', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'}}>
                {loading ? <Loader className="spin" size={20}/> : (image ? <RefreshCw size={20}/> : <Upload size={20}/>)} 
                {loading ? `Scanning... ${progress}%` : (image ? "Rescan Aadhaar" : "Upload & Scan Aadhaar")}
              </label>
              {loading && <div style={{width:'100%', height:'6px', background:'#333', marginTop:'15px', borderRadius:'3px'}}><div style={{width:`${progress}%`, height:'100%', background:'#4ade80', borderRadius:'3px', transition:'width 0.2s'}}></div></div>}
            </div>
            {image && (
                <div style={{background:'#1a1a1a', borderRadius:'12px', height:'550px', border: '1px solid #333', overflow: 'auto', padding: '10px', animation: 'fadeIn 0.5s ease'}}>
                   <p style={{textAlign:'center', color:'#666', fontSize:'0.75rem', marginTop:0}}>Scroll to view details</p>
                   <img src={image} alt="Preview" style={{width: '100%', display: 'block', borderRadius: '6px'}} />
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}