// // import React, { useState, useEffect } from 'react';
// // import { db } from '../firebase';
// // import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
// // import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, CheckCircle, User } from 'lucide-react';
// // import '../App.css';

// // export default function SecretaryDashboard({ setPage }) {
// //   const [notices, setNotices] = useState([]);
// //   const [complaints, setComplaints] = useState([]);
// //   const [bookings, setBookings] = useState([]);
// //   const [viewImage, setViewImage] = useState(null);
// //   const [showCalendar, setShowCalendar] = useState(false);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       // 1. Notices
// //       const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
// //       setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));

// //       // 2. Complaints
// //       const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
// //       setComplaints(complaintSnap.docs.map(d => ({ id: d.id, ...d.data() })));

// //       // 3. Bookings
// //       const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("date")));
// //       setBookings(bookingSnap.docs.map(d => d.data()));
// //     };
// //     fetchData();
// //   }, []);

// //   const handleTaskCompleted = async (id) => {
// //     if(window.confirm("Mark this complaint as resolved?")) {
// //       await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
// //       setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
// //     }
// //   };

// //   const isDateBooked = (day) => {
// //     const today = new Date();
// //     const year = today.getFullYear();
// //     const month = String(today.getMonth() + 1).padStart(2, '0');
// //     const dayStr = String(day).padStart(2, '0');
// //     const checkDate = `${year}-${month}-${dayStr}`;
// //     return bookings.some(b => b.date === checkDate);
// //   };

// //   const activeComplaints = complaints.filter(c => c.status !== 'Resolved');
// //   const solvedComplaints = complaints.filter(c => c.status === 'Resolved');

// //   return (
// //     <div className="dashboard-feed">
      
// //       {/* Image Modal */}
// //       {viewImage && (
// //         <div className="modal-overlay" onClick={() => setViewImage(null)}>
// //           <div className="modal-content" onClick={e => e.stopPropagation()}>
// //             <button className="close-modal-btn" onClick={() => setViewImage(null)}><X size={24} /></button>
// //             <img src={viewImage} alt="Full View" className="modal-image" />
// //           </div>
// //         </div>
// //       )}

// //       {/* Calendar Modal */}
// //       {showCalendar && (
// //         <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
// //           <div className="modal-content" onClick={e => e.stopPropagation()} style={{background:'white', padding:'30px', borderRadius:'15px', maxWidth:'400px', width:'100%'}}>
// //             <button className="close-modal-btn" onClick={() => setShowCalendar(false)}><X size={24} /></button>
// //             <h3 style={{marginBottom:'20px', textAlign:'center'}}>📅 Monthly Schedule</h3>
// //             <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'10px', textAlign:'center'}}>
// //               {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{fontWeight:'bold', color:'#94a3b8'}}>{d}</div>)}
// //               {[...Array(31)].map((_, i) => {
// //                 const day = i + 1;
// //                 const booked = isDateBooked(day);
// //                 return (
// //                   <div key={i} style={{
// //                     padding:'10px', borderRadius:'8px', 
// //                     background: booked ? '#ef4444' : '#f1f5f9',
// //                     color: booked ? 'white' : '#334155',
// //                     fontWeight: booked ? 'bold' : 'normal',
// //                     border: booked ? '2px solid #b91c1c' : 'none'
// //                   }}>
// //                     {day}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ROW 1: NOTICES (Full Width) */}
// //       <div className="dashboard-row-full">
// //         <div className="feed-card notice-feed">
// //           <div className="card-header">
// //             <h3><Megaphone className="icon" /> Posted Notices</h3>
// //             <button className="btn-secondary" onClick={() => setPage('notices')}>Manage Notices</button>
// //           </div>
// //           <div className="card-content">
// //             {notices.slice(0, 3).map(n => (
// //               <div key={n.id} className="notice-item">
// //                 <span className="notice-date">{new Date(n.date).toLocaleDateString()}</span>
// //                 <p>{n.content}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ROW 2: SPLIT VIEW */}
// //       <div className="dashboard-row-split">
        
// //         {/* LEFT COLUMN: COMPLAINTS (Active + Solved) */}
// //         <div className="dashboard-col-left">
          
// //           {/* Active Complaints */}
// //           <div className="feed-card complaint-feed">
// //             <div className="card-header">
// //               <h3><AlertTriangle className="icon" /> Resident Complaints</h3>
// //             </div>
// //             <div className="card-content">
// //               {activeComplaints.length === 0 ? <p style={{color:'#64748b'}}>No active complaints.</p> : null}
// //               {activeComplaints.map(c => (
// //                 <div key={c.id} className="complaint-item">
// //                   <div className="complaint-main">
// //                     <div className="complaint-text">
// //                       <strong>{c.title || "Issue"}</strong>
// //                       <p>{c.text}</p>
// //                       {c.imageUrl && (
// //                         <div className="complaint-thumbnail-wrapper">
// //                           <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
// //                           <span className="thumbnail-hint">(click)</span>
// //                         </div>
// //                       )}
// //                       <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#64748b' }}>
// //                           <span style={{ marginRight: '10px' }}>By: {c.email?.split('@')[0]}</span>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
// //                      <div style={{fontWeight:'bold', color:'#3b82f6'}}>{c.voteCount || 0} Votes</div>
// //                      <button onClick={() => handleTaskCompleted(c.id)} className="btn-primary" style={{background:'#10b981', padding:'6px 10px', fontSize:'0.75rem', display:'flex', gap:'5px'}}>
// //                       <CheckCircle size={14} /> Solved
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Solved Complaints (Stacked below Active) */}
// //           <div className="feed-card" style={{borderLeft: '5px solid #10b981'}}>
// //             <div className="card-header">
// //               <h3><CheckCircle className="icon" style={{color:'#10b981'}} /> Solved Complaints</h3>
// //             </div>
// //             <div className="card-content">
// //               {solvedComplaints.length === 0 ? <p style={{color:'#64748b'}}>No resolved history.</p> : null}
// //               {solvedComplaints.map(c => (
// //                 <div key={c.id} style={{padding:'10px', borderBottom:'1px solid #eee', opacity:0.7}}>
// //                    <strong>{c.title}</strong> - <span style={{fontSize:'0.9rem'}}>{c.text.substring(0, 50)}...</span>
// //                    <div style={{fontSize:'0.8rem', color:'#10b981', fontWeight:'bold'}}>Resolved ✅</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //         </div>

// //         {/* RIGHT COLUMN: AMENITIES */}
// //         <div className="dashboard-col-right">
// //           <div className="feed-card amenity-feed">
// //             <div className="card-header">
// //               <h3><Calendar className="icon" /> Amenities Schedule</h3>
// //               <div style={{display:'flex', gap:'10px'}}>
// //                 <button className="btn-secondary" onClick={() => setShowCalendar(true)}>View Calendar</button>
// //                 <button className="btn-primary" onClick={() => setPage('amenities')} style={{padding:'8px 12px'}}>Book Now</button>
// //               </div>
// //             </div>
// //             <div className="card-content">
// //               {bookings.slice(0,3).map((b, i) => (
// //                 <div key={i} className="booking-item">
// //                   <div className="booking-date">
// //                     <span className="day">{new Date(b.date).getDate()}</span>
// //                     <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
// //                   </div>
// //                   <div className="booking-details">
// //                     <strong>{b.facility}</strong>
// //                     <p>{b.startTime} - {b.endTime}</p>
// //                     <small>By: {b.user || b.email}</small>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, CheckCircle, User, MessageSquare, Reply, Send } from 'lucide-react';
// import '../App.css';

// export default function SecretaryDashboard({ setPage, user }) {
//   const [notices, setNotices] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [viewImage, setViewImage] = useState(null);
//   const [showCalendar, setShowCalendar] = useState(false);

//   // --- STATES FOR NOTICE COMMENTS & REPLIES ---
//   const [expandedNotices, setExpandedNotices] = useState({});
//   const [replyInputs, setReplyInputs] = useState({});
//   const [showReplyInput, setShowReplyInput] = useState({}); 

//   const fetchNotices = async () => {
//     const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
//     setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchNotices();
//       const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
//       setComplaints(complaintSnap.docs.map(d => ({ id: d.id, ...d.data() })));
//       const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("date")));
//       setBookings(bookingSnap.docs.map(d => d.data()));
//     };
//     fetchData();
//   }, []);

//   const handleTaskCompleted = async (id) => {
//     if(window.confirm("Mark this complaint as resolved?")) {
//       await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
//       setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
//     }
//   };

//   const isDateBooked = (day) => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const dayStr = String(day).padStart(2, '0');
//     const checkDate = `${year}-${month}-${dayStr}`;
//     return bookings.some(b => b.date === checkDate);
//   };

//   const toggleExpandComments = (noticeId) => {
//     setExpandedNotices(prev => ({ ...prev, [noticeId]: !prev[noticeId] }));
//   };

//   const handleReply = async (noticeId, commentId) => {
//     const replyText = replyInputs[commentId];
//     if (!replyText || !replyText.trim()) return;

//     const notice = notices.find(n => n.id === noticeId);
//     const noticeRef = doc(db, "notices", noticeId);

//     const updatedComments = (notice.comments || []).map(c => {
//       if (c.id === commentId) {
//         const newReply = {
//           id: Date.now().toString(),
//           text: replyText,
//           authorName: user?.name || 'Secretary',
//           date: new Date().toISOString()
//         };
//         return { ...c, replies: [...(c.replies || []), newReply] };
//       }
//       return c;
//     });

//     await updateDoc(noticeRef, { comments: updatedComments });
    
//     setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
//     setShowReplyInput(prev => ({ ...prev, [commentId]: false })); 
//     fetchNotices();
//   };

//   const activeComplaints = complaints.filter(c => c.status !== 'Resolved');
//   const solvedComplaints = complaints.filter(c => c.status === 'Resolved');

//   return (
//     <div className="dashboard-feed">
//       {viewImage && (
//         <div className="modal-overlay" onClick={() => setViewImage(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <button className="close-modal-btn" onClick={() => setViewImage(null)}><X size={24} /></button>
//             <img src={viewImage} alt="Full View" className="modal-image" />
//           </div>
//         </div>
//       )}

//       {showCalendar && (
//         <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()} style={{background:'white', padding:'30px', borderRadius:'15px', maxWidth:'400px', width:'100%'}}>
//             <button className="close-modal-btn" onClick={() => setShowCalendar(false)}><X size={24} /></button>
//             <h3 style={{marginBottom:'20px', textAlign:'center'}}>📅 Monthly Schedule</h3>
//             <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'10px', textAlign:'center'}}>
//               {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{fontWeight:'bold', color:'#94a3b8'}}>{d}</div>)}
//               {[...Array(31)].map((_, i) => {
//                 const day = i + 1;
//                 const booked = isDateBooked(day);
//                 return (
//                   <div key={i} style={{
//                     padding:'10px', borderRadius:'8px', 
//                     background: booked ? '#ef4444' : '#f1f5f9',
//                     color: booked ? 'white' : '#334155',
//                     fontWeight: booked ? 'bold' : 'normal',
//                     border: booked ? '2px solid #b91c1c' : 'none'
//                   }}>
//                     {day}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="dashboard-row-full">
//         <div className="feed-card notice-feed">
//           <div className="card-header">
//             <h3><Megaphone className="icon" /> Posted Notices</h3>
//             <button className="btn-secondary" onClick={() => setPage('notices')}>Manage Notices</button>
//           </div>
//           <div className="card-content">
//             {notices.slice(0, 3).map(n => (
//               <div key={n.id} className="notice-item" style={{display:'flex', flexDirection:'column'}}>
//                 <div>
//                   <span className="notice-date">{new Date(n.date).toLocaleDateString()}</span>
//                   <p>{n.content}</p>
//                 </div>

//                 <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
//                   <button onClick={() => toggleExpandComments(n.id)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     <MessageSquare size={14} /> 
//                     {expandedNotices[n.id] ? 'Hide Comments' : `View Comments ( ${(n.comments || []).length} )`}
//                   </button>

//                   {expandedNotices[n.id] && (
//                     <div style={{ marginTop: '10px' }}>
//                       {(n.comments || []).length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No comments yet.</p>}
                      
//                       {(n.comments || []).map(c => (
//                         <div key={c.id} style={{ marginBottom: '15px', padding: '12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                          
//                           {/* UPDATED: Name and comment text color is now black */}
//                           <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'black' }}><strong>{c.authorName}:</strong> {c.text}</p>
                          
//                           <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '4px' }}>
//                             <strong>Agree ({(c.agrees || []).length}):</strong> {(c.agrees || []).map(u => u.name).join(', ') || 'None'}
//                           </div>
//                           <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '2px', marginBottom: '10px' }}>
//                             <strong>Disagree ({(c.disagrees || []).length}):</strong> {(c.disagrees || []).map(u => u.name).join(', ') || 'None'}
//                           </div>

//                           {/* Existing Replies */}
//                           {(c.replies || []).map(r => (
//                             <div key={r.id} style={{ marginLeft: '15px', padding: '8px 12px', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '2px solid #22c55e', borderRadius: '4px', marginBottom: '8px' }}>
//                               <p style={{ margin: 0, fontSize: '0.85rem', color: 'black' }}>
//                                 <strong style={{ color: '#16a34a' }}>{r.authorName}:</strong> {r.text}
//                               </p>
//                             </div>
//                           ))}

//                           <button 
//                             onClick={() => setShowReplyInput(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
//                             style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', padding: 0 }}
//                           >
//                             <Reply size={12} /> {showReplyInput[c.id] ? 'Cancel Reply' : 'Reply'}
//                           </button>

//                           {/* UPDATED: Light background for reply textbox and black text */}
//                           {showReplyInput[c.id] && (
//                             <div style={{ display: 'flex', gap: '8px', marginTop: '8px', marginLeft: '15px' }}>
//                               <input 
//                                 type="text" 
//                                 placeholder="Reply to citizen..." 
//                                 value={replyInputs[c.id] || ""}
//                                 onChange={e => setReplyInputs({ ...replyInputs, [c.id]: e.target.value })}
//                                 style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: 'black', fontSize: '0.85rem', outline: 'none' }}
//                               />
//                               <button 
//                                 onClick={() => handleReply(n.id, c.id)} 
//                                 style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
//                                 <Send size={14} /> Send
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="dashboard-row-split">
//         <div className="dashboard-col-left">
//           <div className="feed-card complaint-feed">
//             <div className="card-header">
//               <h3><AlertTriangle className="icon" /> Resident Complaints</h3>
//             </div>
//             <div className="card-content">
//               {activeComplaints.length === 0 ? <p style={{color:'#64748b'}}>No active complaints.</p> : null}
//               {activeComplaints.map(c => (
//                 <div key={c.id} className="complaint-item">
//                   <div className="complaint-main">
//                     <div className="complaint-text">
//                       <strong>{c.title || "Issue"}</strong>
//                       <p>{c.text}</p>
//                       {c.imageUrl && (
//                         <div className="complaint-thumbnail-wrapper">
//                           <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
//                           <span className="thumbnail-hint">(click)</span>
//                         </div>
//                       )}
//                       <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#64748b' }}>
//                           <span style={{ marginRight: '10px' }}>By: {c.email?.split('@')[0]}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
//                      <div style={{fontWeight:'bold', color:'#3b82f6'}}>{c.voteCount || 0} Votes</div>
//                      <button onClick={() => handleTaskCompleted(c.id)} className="btn-primary" style={{background:'#10b981', padding:'6px 10px', fontSize:'0.75rem', display:'flex', gap:'5px'}}>
//                       <CheckCircle size={14} /> Solved
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="feed-card" style={{borderLeft: '5px solid #10b981'}}>
//             <div className="card-header">
//               <h3><CheckCircle className="icon" style={{color:'#10b981'}} /> Solved Complaints</h3>
//             </div>
//             <div className="card-content">
//               {solvedComplaints.length === 0 ? <p style={{color:'#64748b'}}>No resolved history.</p> : null}
//               {solvedComplaints.map(c => (
//                 <div key={c.id} style={{padding:'10px', borderBottom:'1px solid #eee', opacity:0.7}}>
//                    <strong>{c.title}</strong> - <span style={{fontSize:'0.9rem'}}>{c.text.substring(0, 50)}...</span>
//                    <div style={{fontSize:'0.8rem', color:'#10b981', fontWeight:'bold'}}>Resolved ✅</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-col-right">
//           <div className="feed-card amenity-feed">
//             <div className="card-header">
//               <h3><Calendar className="icon" /> Amenities Schedule</h3>
//               <div style={{display:'flex', gap:'10px'}}>
//                 <button className="btn-secondary" onClick={() => setShowCalendar(true)}>View Calendar</button>
//                 <button className="btn-primary" onClick={() => setPage('amenities')} style={{padding:'8px 12px'}}>Book Now</button>
//               </div>
//             </div>
//             <div className="card-content">
//               {bookings.slice(0,3).map((b, i) => (
//                 <div key={i} className="booking-item">
//                   <div className="booking-date">
//                     <span className="day">{new Date(b.date).getDate()}</span>
//                     <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
//                   </div>
//                   <div className="booking-details">
//                     <strong>{b.facility}</strong>
//                     <p>{b.startTime} - {b.endTime}</p>
//                     <small>By: {b.user || b.email}</small>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, CheckCircle, User, MessageSquare, Reply, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import '../App.css';

export default function SecretaryDashboard({ setPage, user }) {
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // --- NEW: Replaced expanded list with a single modal state ---
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const selectedNotice = notices.find(n => n.id === selectedNoticeId);
  
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({}); 

  const noticeScrollRef = useRef(null);

  const fetchNotices = async () => {
    const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
    setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotices();
      const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
      setComplaints(complaintSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("date")));
      setBookings(bookingSnap.docs.map(d => d.data()));
    };
    fetchData();
  }, []);

  const handleTaskCompleted = async (id) => {
    if(window.confirm("Mark this complaint as resolved?")) {
      await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
    }
  };

  const isDateBooked = (day) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const checkDate = `${year}-${month}-${dayStr}`;
    return bookings.some(b => b.date === checkDate);
  };

  const handleReply = async (noticeId, commentId) => {
    const replyText = replyInputs[commentId];
    if (!replyText || !replyText.trim()) return;

    const notice = notices.find(n => n.id === noticeId);
    const noticeRef = doc(db, "notices", noticeId);

    const updatedComments = (notice.comments || []).map(c => {
      if (c.id === commentId) {
        const newReply = {
          id: Date.now().toString(),
          text: replyText,
          authorName: user?.name || 'Secretary',
          date: new Date().toISOString()
        };
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });

    await updateDoc(noticeRef, { comments: updatedComments });
    setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
    setShowReplyInput(prev => ({ ...prev, [commentId]: false })); 
    fetchNotices();
  };

  const scrollNotices = (direction) => {
    if (noticeScrollRef.current) {
      const scrollAmount = 340; 
      noticeScrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const activeComplaints = complaints.filter(c => c.status !== 'Resolved');
  const solvedComplaints = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="dashboard-feed">
      
      {/* Existing Image Modal */}
      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setViewImage(null)}><X size={24} /></button>
            <img src={viewImage} alt="Full View" className="modal-image" />
          </div>
        </div>
      )}

      {/* Existing Calendar Modal */}
      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{background:'white', padding:'30px', borderRadius:'15px', maxWidth:'400px', width:'100%'}}>
            <button className="close-modal-btn" onClick={() => setShowCalendar(false)}><X size={24} /></button>
            <h3 style={{marginBottom:'20px', textAlign:'center'}}>📅 Monthly Schedule</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'10px', textAlign:'center'}}>
              {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{fontWeight:'bold', color:'#94a3b8'}}>{d}</div>)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const booked = isDateBooked(day);
                return (
                  <div key={i} style={{
                    padding:'10px', borderRadius:'8px', 
                    background: booked ? '#ef4444' : '#f1f5f9',
                    color: booked ? 'white' : '#334155',
                    fontWeight: booked ? 'bold' : 'normal',
                    border: booked ? '2px solid #b91c1c' : 'none'
                  }}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: Notice Details & Secretary Comments Modal --- */}
      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNoticeId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            background: '#ffffff', 
            padding: '30px', 
            borderRadius: '15px', 
            width: '90%', 
            maxWidth: '600px', 
            maxHeight: '85vh', 
            overflowY: 'auto'
          }}>
            <button className="close-modal-btn" onClick={() => setSelectedNoticeId(null)}><X size={24} /></button>
            
            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f1f5f9' }}>
              <span className="notice-date" style={{ fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                {new Date(selectedNotice.date).toLocaleDateString()}
              </span>
              <p style={{ marginTop: '15px', lineHeight: '1.6', color: '#1e293b', fontSize: '1.1rem' }}>{selectedNotice.content}</p>
            </div>

            <h4 style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <MessageSquare size={18} /> Comments ({(selectedNotice.comments || []).length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {(selectedNotice.comments || []).length === 0 && <p style={{ color: '#94a3b8' }}>No comments yet.</p>}
              
              {(selectedNotice.comments || []).map(c => (
                <div key={c.id} style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #6366f1', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: '#0f172a' }}><strong>{c.authorName}:</strong> {c.text}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', marginTop: '8px', marginBottom: '10px' }}>
                    <div style={{ color: '#16a34a' }}>
                      <strong>Agree ({(c.agrees || []).length}):</strong> {(c.agrees || []).map(u => u.name).join(', ') || 'None'}
                    </div>
                    <div style={{ color: '#dc2626' }}>
                      <strong>Disagree ({(c.disagrees || []).length}):</strong> {(c.disagrees || []).map(u => u.name).join(', ') || 'None'}
                    </div>
                  </div>

                  {(c.replies || []).map(r => (
                    <div key={r.id} style={{ marginLeft: '10px', marginTop: '8px', padding: '8px 12px', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid #22c55e', borderRadius: '4px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a' }}>
                        <strong style={{ color: '#16a34a' }}>{r.authorName}:</strong> {r.text}
                      </p>
                    </div>
                  ))}

                  <button 
                    onClick={() => setShowReplyInput(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                    style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', padding: 0, fontWeight: 'bold' }}
                  >
                    <Reply size={14} /> {showReplyInput[c.id] ? 'Cancel Reply' : 'Reply'}
                  </button>

                  {showReplyInput[c.id] && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Reply to citizen..." 
                        value={replyInputs[c.id] || ""}
                        onChange={e => setReplyInputs({ ...replyInputs, [c.id]: e.target.value })}
                        style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                      />
                      <button 
                        onClick={() => handleReply(selectedNotice.id, c.id)} 
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Send size={14} /> Send
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROW 1: NOTICES (Horizontal Slider) */}
      <div className="dashboard-row-full">
        <div className="feed-card notice-feed">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><Megaphone className="icon" /> Posted Notices</h3>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => scrollNotices('left')} className="btn-secondary" style={{ padding: '6px', borderRadius: '8px' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollNotices('right')} className="btn-secondary" style={{ padding: '6px', borderRadius: '8px' }}>
                <ChevronRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => setPage('notices')} style={{ marginLeft: '10px' }}>Manage</button>
            </div>
          </div>
          
          <div 
            className="card-content" 
            ref={noticeScrollRef} 
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: '20px', 
              paddingBottom: '10px', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              alignItems: 'flex-start'
            }}
          >
            {notices.map(n => (
              <div 
                key={n.id} 
                className="notice-item" 
                style={{ 
                  minWidth: '320px', 
                  maxWidth: '320px', 
                  flex: '0 0 auto', 
                  display: 'flex', 
                  flexDirection: 'column',
                  // UPDATED: Light UI colors
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <span className="notice-date" style={{ fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                  {/* UPDATED: Black font color */}
                  <p style={{ marginTop: '12px', lineHeight: '1.5', color: '#0f172a' }}>{n.content}</p>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                  <button 
                    onClick={() => setSelectedNoticeId(n.id)}
                    style={{ 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      border: 'none', 
                      color: '#6366f1', 
                      cursor: 'pointer', 
                      fontSize: '0.85rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '600'
                    }}
                  >
                    <MessageSquare size={14} /> 
                    {(n.comments || []).length} Comments
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-row-split">
        <div className="dashboard-col-left">
          <div className="feed-card complaint-feed">
            <div className="card-header">
              <h3><AlertTriangle className="icon" /> Resident Complaints</h3>
            </div>
            <div className="card-content">
              {activeComplaints.length === 0 ? <p style={{color:'#64748b'}}>No active complaints.</p> : null}
              {activeComplaints.map(c => (
                <div key={c.id} className="complaint-item">
                  <div className="complaint-main">
                    <div className="complaint-text">
                      <strong>{c.title || "Issue"}</strong>
                      <p>{c.text}</p>
                      {c.imageUrl && (
                        <div className="complaint-thumbnail-wrapper">
                          <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
                          <span className="thumbnail-hint">(click)</span>
                        </div>
                      )}
                      <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#64748b' }}>
                          <span style={{ marginRight: '10px' }}>By: {c.email?.split('@')[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                     <div style={{fontWeight:'bold', color:'#3b82f6'}}>{c.voteCount || 0} Votes</div>
                     <button onClick={() => handleTaskCompleted(c.id)} className="btn-primary" style={{background:'#10b981', padding:'6px 10px', fontSize:'0.75rem', display:'flex', gap:'5px'}}>
                      <CheckCircle size={14} /> Solved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="feed-card" style={{borderLeft: '5px solid #10b981'}}>
            <div className="card-header">
              <h3><CheckCircle className="icon" style={{color:'#10b981'}} /> Solved Complaints</h3>
            </div>
            <div className="card-content">
              {solvedComplaints.length === 0 ? <p style={{color:'#64748b'}}>No resolved history.</p> : null}
              {solvedComplaints.map(c => (
                <div key={c.id} style={{padding:'10px', borderBottom:'1px solid #eee', opacity:0.7}}>
                   <strong>{c.title}</strong> - <span style={{fontSize:'0.9rem'}}>{c.text.substring(0, 50)}...</span>
                   <div style={{fontSize:'0.8rem', color:'#10b981', fontWeight:'bold'}}>Resolved ✅</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-col-right">
          <div className="feed-card amenity-feed">
            <div className="card-header">
              <h3><Calendar className="icon" /> Amenities Schedule</h3>
              <div style={{display:'flex', gap:'10px'}}>
                <button className="btn-secondary" onClick={() => setShowCalendar(true)}>View Calendar</button>
                <button className="btn-primary" onClick={() => setPage('amenities')} style={{padding:'8px 12px'}}>Book Now</button>
              </div>
            </div>
            <div className="card-content">
              {bookings.slice(0,3).map((b, i) => (
                <div key={i} className="booking-item">
                  <div className="booking-date">
                    <span className="day">{new Date(b.date).getDate()}</span>
                    <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="booking-details">
                    <strong>{b.facility}</strong>
                    <p>{b.startTime} - {b.endTime}</p>
                    <small>By: {b.user || b.email}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}