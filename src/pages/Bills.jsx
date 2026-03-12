// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
// import { CheckCircle, XCircle, Plus, Upload, Search, Download, ArrowLeft, QrCode, Trash2, AlertCircle, FileText } from 'lucide-react';

// export default function Bills({ user }) {
//   const [view, setView] = useState('home'); // 'home', 'issue', 'history'
//   const [bills, setBills] = useState([]);
//   const [filterType, setFilterType] = useState('All'); // 'All', 'Paid', 'Unpaid'
  
//   // --- STATS ---
//   const [paidCount, setPaidCount] = useState(0);
//   const [unpaidCount, setUnpaidCount] = useState(0);

//   // --- ISSUE BILL STATE ---
//   const [citizens, setCitizens] = useState([]); 
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
  
//   const [type, setType] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [upiId, setUpiId] = useState("society@upi"); 
//   const [billFile, setBillFile] = useState(null); 
//   const [loading, setLoading] = useState(false);

//   // --- PAYMENT MODAL ---
//   const [payModal, setPayModal] = useState(null); 

//   // --- FETCH DATA ---
//   useEffect(() => {
//     fetchBills();
//     if (user.role === 'secretary') fetchCitizens();
//   }, [user]);

//   const fetchBills = async () => {
//     try {
//       let q;
//       let rawBills = [];
      
//       if (user.role === 'secretary') {
//         q = query(collection(db, "bills")); 
//         const snapshot = await getDocs(q);
//         rawBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//       } else {
//         q = query(collection(db, "bills"), where("email", "==", user.email));
//         const snapshot = await getDocs(q);
//         rawBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//       }

//       // Sort Newest First
//       rawBills.sort((a, b) => new Date(b.date) - new Date(a.date));
//       setBills(rawBills);

//       // Update Counts
//       if (user.role === 'citizen') {
//         setPaidCount(rawBills.filter(b => b.status === 'Paid').length);
//         setUnpaidCount(rawBills.filter(b => b.status === 'Unpaid').length);
//       }

//     } catch (err) { console.error(err); }
//   };

//   const fetchCitizens = async () => {
//     const q = query(collection(db, "citizens"));
//     const snapshot = await getDocs(q);
//     setCitizens(snapshot.docs.map(doc => ({ name: doc.data().name, email: doc.data().aadharNo, id: doc.id })));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setBillFile(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const issueBill = async () => {
//     if (!selectedUser || !type || !dueDate) { alert("Please fill required fields"); return; }
//     setLoading(true);
//     try {
//       await addDoc(collection(db, "bills"), {
//         email: selectedUser.email, 
//         userName: selectedUser.name,
//         type, amount: "0", dueDate, upiId, 
//         billCopy: billFile, status: "Unpaid", 
//         date: new Date().toISOString().split('T')[0]
//       });
//       alert("Bill Issued Successfully!");
//       setSearchTerm(""); setSelectedUser(null); setType(""); setDueDate(""); setBillFile(null);
//       fetchBills(); 
//       setView('home');
//     } catch (error) { console.error(error); alert("Error issuing bill."); }
//     setLoading(false);
//   };

//   const markAsPaid = async (id) => {
//     if(window.confirm("Mark as Paid?")) {
//         await updateDoc(doc(db, "bills", id), { status: "Paid" });
//         setPayModal(null);
//         fetchBills(); 
//     }
//   };

//   const deleteBill = async (id) => {
//     if(window.confirm("Are you sure you want to delete this bill?")) {
//         await deleteDoc(doc(db, "bills", id));
//         fetchBills();
//     }
//   };

//   // Helper to open history with filter
//   const openHistory = (filter) => {
//     setFilterType(filter);
//     setView('history');
//   };

//   // --- VIEW 1: HOME MENU ---
//   if (view === 'home') {
//     return (
//       <div className="dashboard-wrapper" style={{textAlign: 'center', paddingTop: '50px'}}>
//         <h2 style={{color: '#f1f5f9', marginBottom: '40px'}}>💳 Billing & Payments</h2>
        
//         <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto'}}>
          
//           {/* SECRETARY: ISSUE BILL */}
//           {user.role === 'secretary' && (
//             <div onClick={() => setView('issue')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
//               <div style={{background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
//                 <Plus size={40} color="#6366f1" />
//               </div>
//               <h3 style={{color: 'white', marginBottom:'10px'}}>Issue New Bill</h3>
//               <p style={{color: '#94a3b8'}}>Create maintenance or penalty bills for citizens.</p>
//             </div>
//           )}

//           {/* CITIZEN: STATUS CARDS */}
//           {user.role === 'citizen' && (
//             <>
//               {/* Unpaid Card */}
//               <div onClick={() => openHistory('Unpaid')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #ef4444'}}>
//                 <div style={{background: 'rgba(239, 68, 68, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
//                   <AlertCircle size={40} color="#f87171" />
//                 </div>
//                 <h2 style={{color: '#f87171', margin: '0 0 5px 0'}}>{unpaidCount}</h2>
//                 <h3 style={{color: 'white', margin: '0 0 10px 0'}}>Unpaid Bills</h3>
//                 <p style={{color: '#94a3b8'}}>View pending dues and make payments.</p>
//               </div>

//               {/* Paid Card */}
//               <div onClick={() => openHistory('Paid')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #22c55e'}}>
//                 <div style={{background: 'rgba(34, 197, 94, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
//                   <CheckCircle size={40} color="#4ade80" />
//                 </div>
//                 <h2 style={{color: '#4ade80', margin: '0 0 5px 0'}}>{paidCount}</h2>
//                 <h3 style={{color: 'white', margin: '0 0 10px 0'}}>Paid Bills</h3>
//                 <p style={{color: '#94a3b8'}}>View cleared transactions and receipts.</p>
//               </div>
//             </>
//           )}

//           {/* SECRETARY: VIEW ALL HISTORY */}
//           {user.role === 'secretary' && (
//              <div onClick={() => openHistory('All')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
//                 <div style={{background: 'rgba(59, 130, 246, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
//                   <FileText size={40} color="#3b82f6" />
//                 </div>
//                 <h3 style={{color: 'white', marginBottom:'10px'}}>All Transactions</h3>
//                 <p style={{color: '#94a3b8'}}>Monitor payment status and history of all units.</p>
//              </div>
//           )}

//         </div>
//       </div>
//     );
//   }

//   // --- VIEW 2: ISSUE BILL FORM ---
//   if (view === 'issue' && user.role === 'secretary') {
//     return (
//       <div style={{ maxWidth: '900px', margin: '0 auto' }}>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//           <button onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '15px' }}><ArrowLeft size={24}/></button>
//           <h2 style={{ color: 'white', margin: 0 }}>Issue New Bill</h2>
//         </div>

//         <div className="feed-card" style={{ padding: '30px', background: '#1e293b', border: '1px solid #334155' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
//             <div style={{ position: 'relative' }}>
//               <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Citizen Name</label>
//               <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '0 10px' }}>
//                 <Search size={18} color="#64748b" />
//                 <input placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setShowDropdown(true); }} style={{ border: 'none', padding: '12px', width: '100%', outline: 'none' }} />
//               </div>
//               {showDropdown && searchTerm && (
//                 <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', borderRadius: '8px', marginTop: '5px', zIndex: 10 }}>
//                   {citizens.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
//                     <div key={c.id} onClick={() => { setSearchTerm(c.name); setSelectedUser(c); setShowDropdown(false); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', color: 'black' }}>{c.name}</div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div>
//               <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Bill Type</label>
//               <input list="types" value={type} onChange={e => setType(e.target.value)} placeholder="Maintenance, Event..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
//               <datalist id="types"><option value="Maintenance"/><option value="Electricity"/><option value="Water"/></datalist>
//             </div>
//             <div>
//               <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Due Date</label>
//               <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
//             </div>
//             <div>
//               <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Payment UPI ID</label>
//               <input value={upiId} onChange={e => setUpiId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
//             </div>
//             <div style={{ gridColumn: 'span 2' }}>
//               <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Upload Bill (Image or PDF)</label>
//               <div style={{ background: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', position: 'relative' }}>
//                 <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
//                 <Upload size={20} color="#64748b" style={{ marginRight: '10px' }} />
//                 <span style={{ color: billFile ? '#166534' : '#64748b' }}>{billFile ? "File Attached Successfully" : "Click to select file"}</span>
//               </div>
//             </div>
//           </div>
//           <button className="btn-primary" onClick={issueBill} style={{ width: '100%', marginTop: '30px', padding: '14px' }} disabled={loading}>{loading ? "Sending..." : "Generate Bill"}</button>
//         </div>
//       </div>
//     );
//   }

//   // --- VIEW 3: BILL HISTORY ---
//   if (view === 'history') {
//     // Filter bills based on selection
//     const filteredBills = filterType === 'All' ? bills : bills.filter(b => b.status === filterType);

//     return (
//       <div style={{ maxWidth: '900px', margin: '0 auto' }}>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//           <button onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '15px' }}><ArrowLeft size={24}/></button>
//           <h2 style={{ color: 'white', margin: 0 }}>{filterType === 'All' ? 'All Transactions' : `${filterType} Bills`}</h2>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {filteredBills.length === 0 ? (
//             <div className="feed-card" style={{textAlign: 'center', padding: '50px', background: '#1e293b', border: '1px dashed #334155'}}>
//                 <div style={{margin: '0 auto 20px', width: '60px', height: '60px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//                     {filterType === 'Paid' ? <CheckCircle size={30} color="#94a3b8"/> : <AlertCircle size={30} color="#94a3b8"/>}
//                 </div>
//                 <h3 style={{color: '#94a3b8'}}>No {filterType.toLowerCase()} bills found</h3>
//                 <p style={{color: '#64748b'}}>You're all caught up!</p>
//             </div>
//           ) : (
//             filteredBills.map(bill => (
//                 <div key={bill.id} className="feed-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#1e293b', borderLeft: bill.status === 'Paid' ? '5px solid #22c55e' : '5px solid #ef4444', position: 'relative' }}>
                
//                 {/* DELETE BUTTON (Secretary Only) */}
//                 {user.role === 'secretary' && (
//                     <button onClick={() => deleteBill(bill.id)} style={{position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'}}>
//                         <Trash2 size={18} />
//                     </button>
//                 )}

//                 <div>
//                     <span style={{ background: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd5e1' }}>{bill.date}</span>
//                     <h3 style={{ margin: '8px 0', color: 'white' }}>{bill.type}</h3>
//                     <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{user.role === 'secretary' ? `Billed To: ${bill.userName}` : `Due: ${bill.dueDate}`}</p>
//                     {bill.billCopy && (
//                     <a href={bill.billCopy} download="Bill_Doc" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#6366f1', fontSize: '0.85rem', marginTop: '8px', textDecoration: 'none' }}>
//                         <Download size={14}/> Download Bill
//                     </a>
//                     )}
//                 </div>

//                 <div style={{ textAlign: 'right', marginTop: '15px' }}>
//                     <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
//                     {bill.status}
//                     </div>
//                     {user.role === 'citizen' && bill.status === 'Unpaid' && (
//                     <button onClick={() => setPayModal(bill)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <QrCode size={16}/> Pay Online
//                     </button>
//                     )}
//                     {user.role === 'secretary' && bill.status === 'Unpaid' && (
//                     <button onClick={() => markAsPaid(bill.id)} style={{ border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Mark Paid</button>
//                     )}
//                 </div>
//                 </div>
//             ))
//           )}
//         </div>

//         {/* PAYMENT MODAL */}
//         {payModal && (
//           <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
//             <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', maxWidth: '350px' }}>
//               <h3 style={{ color: '#1e293b', marginTop: 0 }}>Scan to Pay</h3>
//               <p style={{ color: '#64748b' }}>Scan this QR code with GPay, PhonePe, or Paytm.</p>
//               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${payModal.upiId}&pn=Society&tn=${payModal.type}`} alt="QR Code" style={{ margin: '20px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }} />
//               <p style={{ fontWeight: 'bold', color: '#334155' }}>Paying To: {payModal.upiId}</p>
//               <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
//                 <button onClick={() => setPayModal(null)} className="btn-primary" style={{ width: '100%' }}>Done (Waiting Approval)</button>
//                 <button onClick={() => setPayModal(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     );
//   }

//   return null;
// }


import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { CheckCircle, XCircle, Plus, Upload, Search, Download, ArrowLeft, QrCode, Trash2, AlertCircle, FileText } from 'lucide-react';

export default function Bills({ user }) {
  const [view, setView] = useState('home'); // 'home', 'issue', 'history'
  const [bills, setBills] = useState([]);
  const [filterType, setFilterType] = useState('All'); // 'All', 'Paid', 'Unpaid'
  
  // --- STATS ---
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);

  // --- ISSUE BILL STATE ---
  const [citizens, setCitizens] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(""); // Added amount state
  const [dueDate, setDueDate] = useState("");
  const [upiId, setUpiId] = useState("society@upi"); 
  const [billFile, setBillFile] = useState(null); 
  const [loading, setLoading] = useState(false);

  // --- PAYMENT MODAL ---
  const [payModal, setPayModal] = useState(null); 

  // --- FETCH DATA ---
  useEffect(() => {
    fetchBills();
    if (user.role === 'secretary') {
      fetchCitizens();
      setView('home');
      setFilterType('All');
    } else {
      // Directly open unpaid bills for citizens
      setView('history');
      setFilterType('Unpaid');
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      let q;
      let rawBills = [];
      
      if (user.role === 'secretary') {
        q = query(collection(db, "bills")); 
        const snapshot = await getDocs(q);
        rawBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      } else {
        q = query(collection(db, "bills"), where("email", "==", user.email));
        const snapshot = await getDocs(q);
        rawBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // Sort Newest First
      rawBills.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBills(rawBills);

      // Update Counts
      if (user.role === 'citizen') {
        setPaidCount(rawBills.filter(b => b.status === 'Paid').length);
        setUnpaidCount(rawBills.filter(b => b.status === 'Unpaid').length);
      }

    } catch (err) { console.error(err); }
  };

  const fetchCitizens = async () => {
    const q = query(collection(db, "citizens"));
    const snapshot = await getDocs(q);
    setCitizens(snapshot.docs.map(doc => ({ name: doc.data().name, email: doc.data().aadharNo, id: doc.id })));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBillFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const issueBill = async () => {
    if (!selectedUser || !type || !dueDate || !amount) { alert("Please fill required fields"); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "bills"), {
        email: selectedUser.email, 
        userName: selectedUser.name,
        type, amount, dueDate, upiId, // Added amount here
        billCopy: billFile, status: "Unpaid", 
        date: new Date().toISOString().split('T')[0]
      });
      alert("Bill Issued Successfully!");
      setSearchTerm(""); setSelectedUser(null); setType(""); setAmount(""); setDueDate(""); setBillFile(null);
      fetchBills(); 
      setView('home');
    } catch (error) { console.error(error); alert("Error issuing bill."); }
    setLoading(false);
  };

  const markAsPaid = async (id) => {
    if(window.confirm("Mark as Paid?")) {
        await updateDoc(doc(db, "bills", id), { status: "Paid" });
        setPayModal(null);
        fetchBills(); 
    }
  };

  const deleteBill = async (id) => {
    if(window.confirm("Are you sure you want to delete this bill?")) {
        await deleteDoc(doc(db, "bills", id));
        fetchBills();
    }
  };

  // Helper to open history with filter
  const openHistory = (filter) => {
    setFilterType(filter);
    setView('history');
  };

  // --- VIEW 1: HOME MENU ---
  if (view === 'home') {
    return (
      <div className="dashboard-wrapper" style={{textAlign: 'center', paddingTop: '50px'}}>
        <h2 style={{color: '#f1f5f9', marginBottom: '40px'}}>💳 Billing & Payments</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto'}}>
          
          {/* SECRETARY: ISSUE BILL */}
          {user.role === 'secretary' && (
            <div onClick={() => setView('issue')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
              <div style={{background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                <Plus size={40} color="#6366f1" />
              </div>
              <h3 style={{color: 'white', marginBottom:'10px'}}>Issue New Bill</h3>
              <p style={{color: '#94a3b8'}}>Create maintenance or penalty bills for citizens.</p>
            </div>
          )}

          {/* CITIZEN: STATUS CARDS (Kept as fallback, though bypassed by default now) */}
          {user.role === 'citizen' && (
            <>
              {/* Unpaid Card */}
              <div onClick={() => openHistory('Unpaid')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #ef4444'}}>
                <div style={{background: 'rgba(239, 68, 68, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                  <AlertCircle size={40} color="#f87171" />
                </div>
                <h2 style={{color: '#f87171', margin: '0 0 5px 0'}}>{unpaidCount}</h2>
                <h3 style={{color: 'white', margin: '0 0 10px 0'}}>Unpaid Bills</h3>
                <p style={{color: '#94a3b8'}}>View pending dues and make payments.</p>
              </div>

              {/* Paid Card */}
              <div onClick={() => openHistory('Paid')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #22c55e'}}>
                <div style={{background: 'rgba(34, 197, 94, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                  <CheckCircle size={40} color="#4ade80" />
                </div>
                <h2 style={{color: '#4ade80', margin: '0 0 5px 0'}}>{paidCount}</h2>
                <h3 style={{color: 'white', margin: '0 0 10px 0'}}>Paid Bills</h3>
                <p style={{color: '#94a3b8'}}>View cleared transactions and receipts.</p>
              </div>
            </>
          )}

          {/* SECRETARY: VIEW ALL HISTORY */}
          {user.role === 'secretary' && (
             <div onClick={() => openHistory('All')} className="feed-card" style={{padding: '40px', cursor: 'pointer', textAlign: 'center', background: '#1e293b', border: '2px solid #334155'}}>
                <div style={{background: 'rgba(59, 130, 246, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                  <FileText size={40} color="#3b82f6" />
                </div>
                <h3 style={{color: 'white', marginBottom:'10px'}}>All Transactions</h3>
                <p style={{color: '#94a3b8'}}>Monitor payment status and history of all units.</p>
             </div>
          )}

        </div>
      </div>
    );
  }

  // --- VIEW 2: ISSUE BILL FORM ---
  if (view === 'issue' && user.role === 'secretary') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '15px' }}><ArrowLeft size={24}/></button>
          <h2 style={{ color: 'white', margin: 0 }}>Issue New Bill</h2>
        </div>

        <div className="feed-card" style={{ padding: '30px', background: '#1e293b', border: '1px solid #334155' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Citizen Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '0 10px' }}>
                <Search size={18} color="#64748b" />
                <input placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setShowDropdown(true); }} style={{ border: 'none', padding: '12px', width: '100%', outline: 'none' }} />
              </div>
              {showDropdown && searchTerm && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', borderRadius: '8px', marginTop: '5px', zIndex: 10 }}>
                  {citizens.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                    <div key={c.id} onClick={() => { setSearchTerm(c.name); setSelectedUser(c); setShowDropdown(false); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', color: 'black' }}>{c.name}</div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Bill Type</label>
              <input list="types" value={type} onChange={e => setType(e.target.value)} placeholder="Maintenance, Event..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
              <datalist id="types"><option value="Maintenance"/><option value="Electricity"/><option value="Water"/></datalist>
            </div>
            
            {/* Added Amount Field */}
            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1500" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
            </div>

            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
            </div>
            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Payment UPI ID</label>
              <input value={upiId} onChange={e => setUpiId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Upload Bill (Image or PDF)</label>
              <div style={{ background: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <Upload size={20} color="#64748b" style={{ marginRight: '10px' }} />
                <span style={{ color: billFile ? '#166534' : '#64748b' }}>{billFile ? "File Attached Successfully" : "Click to select file"}</span>
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={issueBill} style={{ width: '100%', marginTop: '30px', padding: '14px' }} disabled={loading}>{loading ? "Sending..." : "Generate Bill"}</button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: BILL HISTORY ---
  if (view === 'history') {
    // Filter bills based on selection
    const filteredBills = filterType === 'All' ? bills : bills.filter(b => b.status === filterType);

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Dynamic Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user.role === 'secretary' && (
              <button onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '15px' }}><ArrowLeft size={24}/></button>
            )}
            <h2 style={{ color: 'white', margin: 0 }}>
              {filterType === 'All' ? 'All Transactions' : `${filterType} Bills`}
              {/* Added Unpaid Count to the title for Citizens */}
              {user.role === 'citizen' && filterType === 'Unpaid' && ` (${unpaidCount})`}
            </h2>
          </div>
          
          {/* Added Citizen Toggle Button for Paid/Unpaid Bills */}
          {user.role === 'citizen' && (
            <button 
              onClick={() => setFilterType(filterType === 'Unpaid' ? 'Paid' : 'Unpaid')} 
              style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {filterType === 'Unpaid' ? 'View Paid Bills' : 'View Unpaid Bills'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredBills.length === 0 ? (
            <div className="feed-card" style={{textAlign: 'center', padding: '50px', background: '#1e293b', border: '1px dashed #334155'}}>
                <div style={{margin: '0 auto 20px', width: '60px', height: '60px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {filterType === 'Paid' ? <CheckCircle size={30} color="#94a3b8"/> : <AlertCircle size={30} color="#94a3b8"/>}
                </div>
                <h3 style={{color: '#94a3b8'}}>No {filterType.toLowerCase()} bills found</h3>
                <p style={{color: '#64748b'}}>You're all caught up!</p>
            </div>
          ) : (
            filteredBills.map(bill => (
                <div key={bill.id} className="feed-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#1e293b', borderLeft: bill.status === 'Paid' ? '5px solid #22c55e' : '5px solid #ef4444', position: 'relative' }}>
                
                {/* DELETE BUTTON (Secretary Only) */}
                {user.role === 'secretary' && (
                    <button onClick={() => deleteBill(bill.id)} style={{position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer'}}>
                        <Trash2 size={18} />
                    </button>
                )}

                <div>
                    <span style={{ background: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd5e1' }}>{bill.date}</span>
                    
                    {/* Added Bill Amount to the details card */}
                    <h3 style={{ margin: '8px 0', color: 'white', display: 'flex', alignItems: 'center' }}>
                      {bill.type} 
                      {bill.amount && <span style={{color: '#4ade80', marginLeft: '12px'}}>₹{bill.amount}</span>}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{user.role === 'secretary' ? `Billed To: ${bill.userName}` : `Due: ${bill.dueDate}`}</p>
                    {bill.billCopy && (
                    <a href={bill.billCopy} download="Bill_Doc" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#6366f1', fontSize: '0.85rem', marginTop: '8px', textDecoration: 'none' }}>
                        <Download size={14}/> Download Bill
                    </a>
                    )}
                </div>

                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                    {bill.status}
                    </div>
                    {user.role === 'citizen' && bill.status === 'Unpaid' && (
                    <button onClick={() => setPayModal(bill)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <QrCode size={16}/> Pay Online
                    </button>
                    )}
                    {user.role === 'secretary' && bill.status === 'Unpaid' && (
                    <button onClick={() => markAsPaid(bill.id)} style={{ border: '1px solid #4ade80', color: '#4ade80', background: 'transparent', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Mark Paid</button>
                    )}
                </div>
                </div>
            ))
          )}
        </div>

        {/* PAYMENT MODAL */}
        {payModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', maxWidth: '350px' }}>
              <h3 style={{ color: '#1e293b', marginTop: 0 }}>Scan to Pay</h3>
              <p style={{ color: '#64748b' }}>Scan this QR code with GPay, PhonePe, or Paytm.</p>
              
              {/* Updated UPI URL to also include the dynamically added amount */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${payModal.upiId}&pn=Society&tn=${payModal.type}&am=${payModal.amount}`} alt="QR Code" style={{ margin: '20px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }} />
              
              <h2 style={{ color: '#10b981', margin: '0 0 10px 0' }}>₹{payModal.amount}</h2>
              <p style={{ fontWeight: 'bold', color: '#334155' }}>Paying To: {payModal.upiId}</p>
              
              <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setPayModal(null)} className="btn-primary" style={{ width: '100%' }}>Done (Waiting Approval)</button>
                <button onClick={() => setPayModal(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return null;
}