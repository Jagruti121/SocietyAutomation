// // import React, { useState, useEffect } from 'react';
// // import { db } from '../firebase';
// // import { collection, query, orderBy, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
// // import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, User } from 'lucide-react';
// // import '../App.css';

// // export default function CitizenDashboard({ user, setPage }) {
// //   const [notices, setNotices] = useState([]);
// //   const [complaints, setComplaints] = useState([]);
// //   const [bookings, setBookings] = useState([]);
// //   const [viewImage, setViewImage] = useState(null);

// //   // Load votes from local storage
// //   const [userVotes, setUserVotes] = useState(() => {
// //     const saved = localStorage.getItem(`votes_${user.email}`);
// //     return saved ? JSON.parse(saved) : {};
// //   });

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       // 1. Fetch Notices
// //       const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
// //       setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));

// //       // 2. Fetch Complaints (Sorted by Votes) & FILTER OUT RESOLVED
// //       const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
// //       const allComplaints = complaintSnap.docs.map(d => ({ id: d.id, ...d.data() }));
// //       setComplaints(allComplaints.filter(c => c.status !== 'Resolved'));

// //       // 3. Fetch Bookings
// //       const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("date")));
// //       setBookings(bookingSnap.docs.filter(b => new Date(b.data().date) >= new Date()).map(d => d.data()));
// //     };
// //     fetchData();
// //   }, []);

// //   const handleVote = async (id, currentVotes, type) => {
// //     if (userVotes[id]) return;
// //     const newCount = type === 'up' ? (currentVotes || 0) + 1 : (currentVotes || 0) - 1;
// //     await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
// //     setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
// //     const newVoteState = { ...userVotes, [id]: type };
// //     setUserVotes(newVoteState);
// //     localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
// //   };

// //   const handleRemoveVote = async (id, currentVotes, type) => {
// //     if (userVotes[id] !== type) return;
// //     const newCount = type === 'up' ? (currentVotes || 0) - 1 : (currentVotes || 0) + 1;
// //     await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
// //     setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
// //     const newVoteState = { ...userVotes };
// //     delete newVoteState[id]; 
// //     setUserVotes(newVoteState);
// //     localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
// //   };

// //   return (
// //     <div className="dashboard-feed">
      
// //       {/* Image Modal */}
// //       {viewImage && (
// //         <div className="modal-overlay" onClick={() => setViewImage(null)}>
// //           <div className="modal-content" onClick={e => e.stopPropagation()}>
// //             <button className="close-modal-btn" onClick={() => setViewImage(null)}>
// //               <X size={24} />
// //             </button>
// //             <img src={viewImage} alt="Full View" className="modal-image" />
// //           </div>
// //         </div>
// //       )}

// //       {/* ROW 1: NOTICES (Full Width) */}
// //       <div className="dashboard-row-full">
// //         <div className="feed-card notice-feed">
// //           <div className="card-header">
// //             <h3><Megaphone className="icon" /> Latest Notices</h3>
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
        
// //         {/* LEFT COLUMN: COMPLAINTS */}
// //         <div className="dashboard-col-left">
// //           <div className="feed-card complaint-feed">
// //             <div className="card-header">
// //               <h3><AlertTriangle className="icon" /> Community Issues</h3>
// //               <button className="btn-secondary" onClick={() => setPage('complaints')}>+ Raise Complaint</button>
// //             </div>
// //             <div className="card-content">
// //               {complaints.length === 0 ? <p style={{color:'#64748b', textAlign:'center'}}>No active issues reported.</p> : null}
// //               {complaints.map(c => {
// //                 const myVote = userVotes[c.id]; 
// //                 return (
// //                   <div key={c.id} className="complaint-item">
// //                     <div className="complaint-main">
// //                       <div className="complaint-text">
// //                         <strong>{c.title || "Issue"}</strong>
// //                         <p>{c.text}</p>
// //                         {c.imageUrl && (
// //                           <div className="complaint-thumbnail-wrapper">
// //                             <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
// //                             <span className="thumbnail-hint">(Click to view)</span>
// //                           </div>
// //                         )}
// //                         <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
// //                             <span style={{ marginRight: '10px' }}>By: {c.email.split('@')[0]}</span>
// //                             <span>• {new Date(c.date).toLocaleDateString()}</span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="vote-actions">
// //                       <button 
// //                         onClick={() => handleVote(c.id, c.voteCount, 'up')}
// //                         onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'up')}
// //                         className={`vote-btn up ${myVote === 'up' ? 'active-vote' : ''}`}
// //                         disabled={myVote === 'down'} 
// //                       >
// //                         <ThumbsUp size={18} />
// //                       </button>
// //                       <span className={`vote-count ${myVote ? 'voted-text' : ''}`}>{c.voteCount || 0}</span>
// //                       <button 
// //                         onClick={() => handleVote(c.id, c.voteCount, 'down')} 
// //                         onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'down')}
// //                         className={`vote-btn down ${myVote === 'down' ? 'active-vote' : ''}`}
// //                         disabled={myVote === 'up'} 
// //                       >
// //                         <ThumbsDown size={18} />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>

// //         {/* RIGHT COLUMN: AMENITIES */}
// //         <div className="dashboard-col-right">
// //           <div className="feed-card amenity-feed">
// //             <div className="card-header">
// //               <h3><Calendar className="icon" /> Amenities Schedule</h3>
// //               <button className="btn-secondary" onClick={() => setPage('amenities')}>Book Now</button>
// //             </div>
// //             <div className="card-content">
// //               {bookings.map((b, i) => (
// //                 <div key={i} className="booking-item">
// //                   <div className="booking-date">
// //                     <span className="day">{new Date(b.date).getDate()}</span>
// //                     <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
// //                   </div>
// //                   <div className="booking-details">
// //                     <strong>{b.facility}</strong>
// //                     <p>{b.startTime} - {b.endTime}</p>
// //                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#64748b', fontSize: '0.85rem' }}>
// //                         <User size={14} />
// //                         <span>Booked by: <b>{b.user || b.email}</b></span>
// //                     </div>
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
// import { collection, query, orderBy, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
// import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, User, MessageSquare, Send } from 'lucide-react';
// import '../App.css';

// export default function CitizenDashboard({ user, setPage }) {
//   const [notices, setNotices] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [viewImage, setViewImage] = useState(null);
//   const [newComments, setNewComments] = useState({});
//   const [expandedNotices, setExpandedNotices] = useState({});

//   const [userVotes, setUserVotes] = useState(() => {
//     const saved = localStorage.getItem(`votes_${user.email}`);
//     return saved ? JSON.parse(saved) : {};
//   });

//   const fetchNotices = async () => {
//     const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
//     setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchNotices();
//       const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
//       const allComplaints = complaintSnap.docs.map(d => ({ id: d.id, ...d.data() }));
//       setComplaints(allComplaints.filter(c => c.status !== 'Resolved'));

//       const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("date")));
//       setBookings(bookingSnap.docs.filter(b => new Date(b.data().date) >= new Date()).map(d => d.data()));
//     };
//     fetchData();
//   }, []);

//   const handleVote = async (id, currentVotes, type) => {
//     if (userVotes[id]) return;
//     const newCount = type === 'up' ? (currentVotes || 0) + 1 : (currentVotes || 0) - 1;
//     await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
//     setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
//     const newVoteState = { ...userVotes, [id]: type };
//     setUserVotes(newVoteState);
//     localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
//   };

//   const handleRemoveVote = async (id, currentVotes, type) => {
//     if (userVotes[id] !== type) return;
//     const newCount = type === 'up' ? (currentVotes || 0) - 1 : (currentVotes || 0) + 1;
//     await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
//     setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
//     const newVoteState = { ...userVotes };
//     delete newVoteState[id]; 
//     setUserVotes(newVoteState);
//     localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
//   };

//   const handleAddComment = async (noticeId) => {
//     const text = newComments[noticeId];
//     if (!text || !text.trim()) return;

//     const noticeRef = doc(db, "notices", noticeId);
//     const notice = notices.find(n => n.id === noticeId);
    
//     const newCommentObj = {
//       id: Date.now().toString(),
//       text: text,
//       authorName: user?.name || user?.email || 'Citizen',
//       authorEmail: user?.email || 'unknown',
//       agrees: [],
//       disagrees: [],
//       date: new Date().toISOString()
//     };

//     const updatedComments = [...(notice.comments || []), newCommentObj];
//     await updateDoc(noticeRef, { comments: updatedComments });
//     setNewComments({ ...newComments, [noticeId]: "" }); 
//     fetchNotices();
//   };

//   const handleNoticeVote = async (noticeId, commentId, voteType) => {
//     if (!user) return;
    
//     const notice = notices.find(n => n.id === noticeId);
//     const noticeRef = doc(db, "notices", noticeId);
//     const userInfo = { name: user.name || user.email || 'Citizen', email: user.email };

//     const updatedComments = (notice.comments || []).map(c => {
//       if (c.id !== commentId) return c; 
//       const hasAgreed = (c.agrees || []).some(u => u.email === userInfo.email);
//       const hasDisagreed = (c.disagrees || []).some(u => u.email === userInfo.email);

//       let newAgrees = (c.agrees || []).filter(u => u.email !== userInfo.email);
//       let newDisagrees = (c.disagrees || []).filter(u => u.email !== userInfo.email);

//       if (voteType === 'agree' && !hasAgreed) newAgrees.push(userInfo);
//       else if (voteType === 'disagree' && !hasDisagreed) newDisagrees.push(userInfo);

//       return { ...c, agrees: newAgrees, disagrees: newDisagrees };
//     });

//     await updateDoc(noticeRef, { comments: updatedComments });
//     fetchNotices();
//   };

//   const toggleExpandComments = (noticeId) => {
//     setExpandedNotices(prev => ({ ...prev, [noticeId]: !prev[noticeId] }));
//   };

//   return (
//     <div className="dashboard-feed">
      
//       {viewImage && (
//         <div className="modal-overlay" onClick={() => setViewImage(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <button className="close-modal-btn" onClick={() => setViewImage(null)}>
//               <X size={24} />
//             </button>
//             <img src={viewImage} alt="Full View" className="modal-image" />
//           </div>
//         </div>
//       )}

//       <div className="dashboard-row-full">
//         <div className="feed-card notice-feed">
//           <div className="card-header">
//             <h3><Megaphone className="icon" /> Latest Notices</h3>
//           </div>
//           <div className="card-content">
//             {notices.slice(0, 3).map(n => (
//               <div key={n.id} className="notice-item" style={{display:'flex', flexDirection:'column'}}>
//                 <div>
//                   <span className="notice-date">{new Date(n.date).toLocaleDateString()}</span>
//                   <p>{n.content}</p>
//                 </div>

//                 <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  
//                   {/* UPDATED: Styled comments option button */}
//                   <button 
//                     onClick={() => toggleExpandComments(n.id)}
//                     style={{ 
//                       background: 'rgba(99, 102, 241, 0.1)', 
//                       border: 'none', 
//                       color: '#6366f1', 
//                       cursor: 'pointer', 
//                       fontSize: '0.85rem', 
//                       display: 'inline-flex', 
//                       alignItems: 'center', 
//                       gap: '6px', 
//                       padding: '6px 12px',
//                       borderRadius: '20px',
//                       fontWeight: '600'
//                     }}
//                   >
//                     <MessageSquare size={14}/> 
//                     {expandedNotices[n.id] ? 'Hide Comments' : `${(n.comments || []).length} Comments`}
//                   </button>
                  
//                   {expandedNotices[n.id] && (
//                     <div style={{ marginTop: '15px' }}>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
//                         {(n.comments || []).length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No comments yet. Be the first to share your thoughts!</p>}
                        
//                         {(n.comments || []).map(c => {
//                           const hasAgreed = (c.agrees || []).some(u => u.email === user?.email);
//                           const hasDisagreed = (c.disagrees || []).some(u => u.email === user?.email);

//                           return (
//                             <div key={c.id} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: '6px' }}>
//                               <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'black' }}><strong>{c.authorName}:</strong> {c.text}</p>
                              
//                               {(c.replies || []).map(r => (
//                                 <div key={r.id} style={{ marginLeft: '10px', marginTop: '5px', padding: '6px 10px', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '2px solid #22c55e', borderRadius: '4px' }}>
//                                   <p style={{ margin: 0, fontSize: '0.85rem', color: 'black' }}>
//                                     <strong style={{ color: '#16a34a' }}>{r.authorName}:</strong> {r.text}
//                                   </p>
//                                 </div>
//                               ))}

//                               <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
//                                 <button 
//                                   onClick={() => handleNoticeVote(n.id, c.id, 'agree')} 
//                                   style={{ background: 'none', border: 'none', color: hasAgreed ? '#22c55e' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', padding: 0, fontWeight: hasAgreed ? 'bold' : 'normal' }}>
//                                   <ThumbsUp size={12} /> Agree ({(c.agrees || []).length})
//                                 </button>
//                                 <button 
//                                   onClick={() => handleNoticeVote(n.id, c.id, 'disagree')} 
//                                   style={{ background: 'none', border: 'none', color: hasDisagreed ? '#ef4444' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', padding: 0, fontWeight: hasDisagreed ? 'bold' : 'normal' }}>
//                                   <ThumbsDown size={12} /> Disagree ({(c.disagrees || []).length})
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>

//                       <div style={{ display: 'flex', gap: '8px' }}>
//                         <input 
//                           type="text" 
//                           placeholder="Add a comment..." 
//                           value={newComments[n.id] || ""} 
//                           onChange={(e) => setNewComments({ ...newComments, [n.id]: e.target.value })}
//                           style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', color: 'black', outline: 'none', fontSize: '0.85rem' }}
//                         />
//                         <button onClick={() => handleAddComment(n.id)} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                           <Send size={14}/> Post
//                         </button>
//                       </div>
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
//               <h3><AlertTriangle className="icon" /> Community Issues</h3>
//               <button className="btn-secondary" onClick={() => setPage('complaints')}>+ Raise Complaint</button>
//             </div>
//             <div className="card-content">
//               {complaints.length === 0 ? <p style={{color:'#64748b', textAlign:'center'}}>No active issues reported.</p> : null}
//               {complaints.map(c => {
//                 const myVote = userVotes[c.id]; 
//                 return (
//                   <div key={c.id} className="complaint-item">
//                     <div className="complaint-main">
//                       <div className="complaint-text">
//                         <strong>{c.title || "Issue"}</strong>
//                         <p>{c.text}</p>
//                         {c.imageUrl && (
//                           <div className="complaint-thumbnail-wrapper">
//                             <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
//                             <span className="thumbnail-hint">(Click to view)</span>
//                           </div>
//                         )}
//                         <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
//                             <span style={{ marginRight: '10px' }}>By: {c.email.split('@')[0]}</span>
//                             <span>• {new Date(c.date).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="vote-actions">
//                       <button 
//                         onClick={() => handleVote(c.id, c.voteCount, 'up')}
//                         onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'up')}
//                         className={`vote-btn up ${myVote === 'up' ? 'active-vote' : ''}`}
//                         disabled={myVote === 'down'} 
//                       >
//                         <ThumbsUp size={18} />
//                       </button>
//                       <span className={`vote-count ${myVote ? 'voted-text' : ''}`}>{c.voteCount || 0}</span>
//                       <button 
//                         onClick={() => handleVote(c.id, c.voteCount, 'down')} 
//                         onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'down')}
//                         className={`vote-btn down ${myVote === 'down' ? 'active-vote' : ''}`}
//                         disabled={myVote === 'up'} 
//                       >
//                         <ThumbsDown size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-col-right">
//           <div className="feed-card amenity-feed">
//             <div className="card-header">
//               <h3><Calendar className="icon" /> Amenities Schedule</h3>
//               <button className="btn-secondary" onClick={() => setPage('amenities')}>Book Now</button>
//             </div>
//             <div className="card-content">
//               {bookings.map((b, i) => (
//                 <div key={i} className="booking-item">
//                   <div className="booking-date">
//                     <span className="day">{new Date(b.date).getDate()}</span>
//                     <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
//                   </div>
//                   <div className="booking-details">
//                     <strong>{b.facility}</strong>
//                     <p>{b.startTime} - {b.endTime}</p>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#64748b', fontSize: '0.85rem' }}>
//                         <User size={14} />
//                         <span>Booked by: <b>{b.user || b.email}</b></span>
//                     </div>
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
import { collection, query, orderBy, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown, Calendar, Megaphone, AlertTriangle, X, User, MessageSquare, Send, ChevronRight, ChevronLeft } from 'lucide-react';
import '../App.css';

export default function CitizenDashboard({ user, setPage }) {
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [newComments, setNewComments] = useState({});
  
  // --- NEW: Replaced expanded list with a single modal state ---
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const selectedNotice = notices.find(n => n.id === selectedNoticeId);

  const noticeScrollRef = useRef(null);

  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem(`votes_${user.email}`);
    return saved ? JSON.parse(saved) : {};
  });

  const fetchNotices = async () => {
    const noticeSnap = await getDocs(query(collection(db, "notices"), orderBy("date", "desc")));
    setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchNotices();
      const complaintSnap = await getDocs(query(collection(db, "complaints"), orderBy("voteCount", "desc")));
      const allComplaints = complaintSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setComplaints(allComplaints.filter(c => c.status !== 'Resolved'));
    };
    fetchInitialData();

    // Real-time bookings: Show today and future dates, sorted by date and timing
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const unsub = onSnapshot(query(collection(db, "bookings")), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const upcoming = all
        .filter(b => b.date && b.date >= todayStr)
        .sort((a, b) => {
          const dComp = a.date.localeCompare(b.date);
          if (dComp !== 0) return dComp;
          const tA = a.startTime || a.time || "";
          const tB = b.startTime || b.time || "";
          return tA.localeCompare(tB);
        });
      setBookings(upcoming);
    });

    return () => unsub();
  }, []);

  const handleVote = async (id, currentVotes, type) => {
    if (userVotes[id]) return;
    const newCount = type === 'up' ? (currentVotes || 0) + 1 : (currentVotes || 0) - 1;
    await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
    const newVoteState = { ...userVotes, [id]: type };
    setUserVotes(newVoteState);
    localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
  };

  const handleRemoveVote = async (id, currentVotes, type) => {
    if (userVotes[id] !== type) return;
    const newCount = type === 'up' ? (currentVotes || 0) - 1 : (currentVotes || 0) + 1;
    await updateDoc(doc(db, "complaints", id), { voteCount: newCount });
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, voteCount: newCount } : c));
    const newVoteState = { ...userVotes };
    delete newVoteState[id]; 
    setUserVotes(newVoteState);
    localStorage.setItem(`votes_${user.email}`, JSON.stringify(newVoteState));
  };

  const handleAddComment = async (noticeId) => {
    const text = newComments[noticeId];
    if (!text || !text.trim()) return;

    const noticeRef = doc(db, "notices", noticeId);
    const notice = notices.find(n => n.id === noticeId);
    
    const newCommentObj = {
      id: Date.now().toString(),
      text: text,
      authorName: user?.name || user?.email || 'Citizen',
      authorEmail: user?.email || 'unknown',
      agrees: [],
      disagrees: [],
      date: new Date().toISOString()
    };

    const updatedComments = [...(notice.comments || []), newCommentObj];
    await updateDoc(noticeRef, { comments: updatedComments });
    setNewComments({ ...newComments, [noticeId]: "" }); 
    fetchNotices();
  };

  const handleNoticeVote = async (noticeId, commentId, voteType) => {
    if (!user) return;
    
    const notice = notices.find(n => n.id === noticeId);
    const noticeRef = doc(db, "notices", noticeId);
    const userInfo = { name: user.name || user.email || 'Citizen', email: user.email };

    const updatedComments = (notice.comments || []).map(c => {
      if (c.id !== commentId) return c; 
      const hasAgreed = (c.agrees || []).some(u => u.email === userInfo.email);
      const hasDisagreed = (c.disagrees || []).some(u => u.email === userInfo.email);

      let newAgrees = (c.agrees || []).filter(u => u.email !== userInfo.email);
      let newDisagrees = (c.disagrees || []).filter(u => u.email !== userInfo.email);

      if (voteType === 'agree' && !hasAgreed) newAgrees.push(userInfo);
      else if (voteType === 'disagree' && !hasDisagreed) newDisagrees.push(userInfo);

      return { ...c, agrees: newAgrees, disagrees: newDisagrees };
    });

    await updateDoc(noticeRef, { comments: updatedComments });
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

  return (
    <div className="dashboard-feed">
      
      {/* Existing Image Modal */}
      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setViewImage(null)}>
              <X size={24} />
            </button>
            <img src={viewImage} alt="Full View" className="modal-image" />
          </div>
        </div>
      )}

      {/* --- NEW: Notice Details & Comments Centered Modal --- */}
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
            
            {/* Modal Header: Full Notice Details */}
            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f1f5f9' }}>
              <span className="notice-date" style={{ fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                {new Date(selectedNotice.date).toLocaleDateString()}
              </span>
              <p style={{ marginTop: '15px', lineHeight: '1.6', color: '#1e293b', fontSize: '1.1rem' }}>{selectedNotice.content}</p>
            </div>

            <h4 style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <MessageSquare size={18} /> Comments ({(selectedNotice.comments || []).length})
            </h4>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {(selectedNotice.comments || []).length === 0 && <p style={{ color: '#94a3b8' }}>No comments yet. Be the first to share your thoughts!</p>}
              
              {(selectedNotice.comments || []).map(c => {
                const hasAgreed = (c.agrees || []).some(u => u.email === user?.email);
                const hasDisagreed = (c.disagrees || []).some(u => u.email === user?.email);

                return (
                  <div key={c.id} style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a' }}><strong>{c.authorName}:</strong> {c.text}</p>
                    
                    {(c.replies || []).map(r => (
                      <div key={r.id} style={{ marginLeft: '10px', marginTop: '8px', padding: '8px 12px', background: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid #22c55e', borderRadius: '4px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a' }}>
                          <strong style={{ color: '#16a34a' }}>{r.authorName}:</strong> {r.text}
                        </p>
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleNoticeVote(selectedNotice.id, c.id, 'agree')} 
                        style={{ background: 'none', border: 'none', color: hasAgreed ? '#22c55e' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: 0, fontWeight: hasAgreed ? 'bold' : 'normal' }}>
                        <ThumbsUp size={14} /> Agree ({(c.agrees || []).length})
                      </button>
                      <button 
                        onClick={() => handleNoticeVote(selectedNotice.id, c.id, 'disagree')} 
                        style={{ background: 'none', border: 'none', color: hasDisagreed ? '#ef4444' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: 0, fontWeight: hasDisagreed ? 'bold' : 'normal' }}>
                        <ThumbsDown size={14} /> Disagree ({(c.disagrees || []).length})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Comment */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={newComments[selectedNotice.id] || ""} 
                onChange={(e) => setNewComments({ ...newComments, [selectedNotice.id]: e.target.value })}
                style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontSize: '0.9rem' }}
              />
              <button onClick={() => handleAddComment(selectedNotice.id)} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16}/> Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROW 1: NOTICES (Horizontal Slider) */}
      <div className="dashboard-row-full">
        <div className="feed-card notice-feed">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><Megaphone className="icon" /> Latest Notices</h3>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => scrollNotices('left')} className="btn-secondary" style={{ padding: '6px', borderRadius: '8px' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollNotices('right')} className="btn-secondary" style={{ padding: '6px', borderRadius: '8px' }}>
                <ChevronRight size={18} />
              </button>
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
                  // UPDATED: Light UI colors for the cards
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
                  {/* UPDATED: Black font for the content */}
                  <p style={{ marginTop: '12px', lineHeight: '1.5', color: '#0f172a' }}>{n.content}</p>
                </div>

                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
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
                    <MessageSquare size={14}/> 
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
              <h3><AlertTriangle className="icon" /> Community Issues</h3>
              <button className="btn-secondary" onClick={() => setPage('complaints')}>+ Raise Complaint</button>
            </div>
            <div className="card-content">
              {complaints.length === 0 ? <p style={{color:'#64748b', textAlign:'center'}}>No active issues reported.</p> : null}
              {complaints.map(c => {
                const myVote = userVotes[c.id]; 
                return (
                  <div key={c.id} className="complaint-item">
                    <div className="complaint-main">
                      <div className="complaint-text">
                        <strong>{c.title || "Issue"}</strong>
                        <p>{c.text}</p>
                        {c.imageUrl && (
                          <div className="complaint-thumbnail-wrapper">
                            <img src={c.imageUrl} alt="Evidence" className="complaint-thumbnail" onClick={() => setViewImage(c.imageUrl)} />
                            <span className="thumbnail-hint">(Click to view)</span>
                          </div>
                        )}
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                            <span style={{ marginRight: '10px' }}>By: {c.email.split('@')[0]}</span>
                            <span>• {new Date(c.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="vote-actions">
                      <button 
                        onClick={() => handleVote(c.id, c.voteCount, 'up')}
                        onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'up')}
                        className={`vote-btn up ${myVote === 'up' ? 'active-vote' : ''}`}
                        disabled={myVote === 'down'} 
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <span className={`vote-count ${myVote ? 'voted-text' : ''}`}>{c.voteCount || 0}</span>
                      <button 
                        onClick={() => handleVote(c.id, c.voteCount, 'down')} 
                        onDoubleClick={() => handleRemoveVote(c.id, c.voteCount, 'down')}
                        className={`vote-btn down ${myVote === 'down' ? 'active-vote' : ''}`}
                        disabled={myVote === 'up'} 
                      >
                        <ThumbsDown size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-col-right">
          <div className="feed-card amenity-feed">
            <div className="card-header">
              <h3><Calendar className="icon" /> Amenities Schedule</h3>
              <button className="btn-secondary" onClick={() => setPage('amenities')}>Book Now</button>
            </div>
            <div className="card-content" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '5px' }}>
              {bookings.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No upcoming bookings scheduled.</p>
              ) : (
                bookings.map((b, i) => (
                  <div key={b.id || i} className="booking-item">
                    <div className="booking-date">
                      <span className="day">{new Date(b.date).getDate()}</span>
                      <span className="month">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="booking-details">
                      <strong>{b.facility}</strong>
                      <p>{b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : (b.time || "-")}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#64748b', fontSize: '0.85rem' }}>
                          <User size={14} />
                          <span>Booked by: <b>{b.user || b.email}</b></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}