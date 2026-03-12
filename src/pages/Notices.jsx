// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// import { Megaphone, Trash2, Edit2, Check } from 'lucide-react';

// export default function Notices({ role }) {
//   const [notices, setNotices] = useState([]);
//   const [newNotice, setNewNotice] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");

//   const fetchNotices = async () => {
//     const q = query(collection(db, "notices"), orderBy("date", "desc"));
//     const snapshot = await getDocs(q);
//     setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   useEffect(() => { fetchNotices(); }, []);

//   const postNotice = async () => {
//     if (!newNotice) return;
//     await addDoc(collection(db, "notices"), {
//       content: newNotice,
//       date: new Date().toISOString()
//     });
//     setNewNotice("");
//     fetchNotices();
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("Delete this notice?")) {
//       await deleteDoc(doc(db, "notices", id));
//       fetchNotices();
//     }
//   };

//   const startEdit = (id, currentText) => {
//     setEditingId(id);
//     setEditText(currentText);
//   };

//   const saveEdit = async (id) => {
//     await updateDoc(doc(db, "notices", id), { content: editText });
//     setEditingId(null);
//     fetchNotices();
//   };

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
//       {/* Create Notice Card (Only for Secretary) */}
//       {role === 'secretary' && (
//         <div className="feed-card" style={{ marginBottom: '30px' }}>
//           <div className="card-header">
//             <h3><Megaphone className="icon" /> Create New Notice</h3>
//           </div>
//           <div className="card-content">
//             <textarea 
//               placeholder="Type your notice here..." 
//               value={newNotice} 
//               onChange={(e) => setNewNotice(e.target.value)} 
//               rows="3"
//             />
//             <button className="btn-primary" onClick={postNotice} style={{ width: '100%' }}>
//               Post Notice
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Notices List Card */}
//       <div className="feed-card">
//         <div className="card-header">
//           <h3>📢 Notice Board</h3>
//         </div>
//         <div className="card-content">
//           {notices.map(notice => (
//             <div key={notice.id} className="notice-item" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              
//               <div style={{flex: 1}}>
//                 <span className="notice-date">{new Date(notice.date).toLocaleDateString()}</span>
//                 {editingId === notice.id ? (
//                   <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
//                     <input value={editText} onChange={e => setEditText(e.target.value)} style={{margin:0}} />
//                     <button onClick={() => saveEdit(notice.id)} className="btn-primary" style={{padding:'8px', borderRadius:'50%'}}>
//                       <Check size={16} />
//                     </button>
//                   </div>
//                 ) : (
//                   <p style={{marginTop:'5px'}}>{notice.content}</p>
//                 )}
//               </div>

//               {/* Edit/Delete Actions (Only Secretary) */}
//               {role === 'secretary' && (
//                 <div style={{display:'flex', gap:'10px', marginLeft:'20px'}}>
//                   <button onClick={() => startEdit(notice.id, notice.content)} style={{border:'none', background:'none', cursor:'pointer', color:'#64748b'}}>
//                     <Edit2 size={16} />
//                   </button>
//                   <button onClick={() => handleDelete(notice.id)} style={{border:'none', background:'none', cursor:'pointer', color:'#ef4444'}}>
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Megaphone, Trash2, Edit2, Check, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

export default function Notices({ role, user }) {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // --- NEW STATES FOR COMMENTS ---
  const [newComments, setNewComments] = useState({});
  const [expandedNotices, setExpandedNotices] = useState({});

  const fetchNotices = async () => {
    const q = query(collection(db, "notices"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchNotices(); }, []);

  const postNotice = async () => {
    if (!newNotice) return;
    await addDoc(collection(db, "notices"), {
      content: newNotice,
      date: new Date().toISOString(),
      comments: [] // Initialize empty comments array
    });
    setNewNotice("");
    fetchNotices();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this notice?")) {
      await deleteDoc(doc(db, "notices", id));
      fetchNotices();
    }
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "notices", id), { content: editText });
    setEditingId(null);
    fetchNotices();
  };

  // --- NEW COMMENT & VOTING LOGIC ---
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

  const handleVote = async (noticeId, commentId, voteType) => {
    if (!user) return;
    
    const notice = notices.find(n => n.id === noticeId);
    const noticeRef = doc(db, "notices", noticeId);
    const userInfo = { name: user.name || user.email || 'Citizen', email: user.email };

    const updatedComments = (notice.comments || []).map(c => {
      if (c.id !== commentId) return c; 

      const hasAgreed = (c.agrees || []).some(u => u.email === userInfo.email);
      const hasDisagreed = (c.disagrees || []).some(u => u.email === userInfo.email);

      // Remove user from both arrays first to reset their vote
      let newAgrees = (c.agrees || []).filter(u => u.email !== userInfo.email);
      let newDisagrees = (c.disagrees || []).filter(u => u.email !== userInfo.email);

      // Add vote if clicking for the first time or switching sides
      if (voteType === 'agree' && !hasAgreed) {
        newAgrees.push(userInfo);
      } else if (voteType === 'disagree' && !hasDisagreed) {
        newDisagrees.push(userInfo);
      }

      return { ...c, agrees: newAgrees, disagrees: newDisagrees };
    });

    await updateDoc(noticeRef, { comments: updatedComments });
    fetchNotices();
  };

  const toggleExpandComments = (noticeId) => {
    setExpandedNotices(prev => ({ ...prev, [noticeId]: !prev[noticeId] }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Create Notice Card (Only for Secretary) */}
      {role === 'secretary' && (
        <div className="feed-card" style={{ marginBottom: '30px' }}>
          <div className="card-header">
            <h3><Megaphone className="icon" /> Create New Notice</h3>
          </div>
          <div className="card-content">
            <textarea 
              placeholder="Type your notice here..." 
              value={newNotice} 
              onChange={(e) => setNewNotice(e.target.value)} 
              rows="3"
            />
            <button className="btn-primary" onClick={postNotice} style={{ width: '100%' }}>
              Post Notice
            </button>
          </div>
        </div>
      )}

      {/* Notices List Card */}
      <div className="feed-card">
        <div className="card-header">
          <h3>📢 Notice Board</h3>
        </div>
        <div className="card-content">
          {notices.map(notice => (
            <div key={notice.id} className="notice-item" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              
              <div style={{flex: 1}}>
                <span className="notice-date">{new Date(notice.date).toLocaleDateString()}</span>
                {editingId === notice.id ? (
                  <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                    <input value={editText} onChange={e => setEditText(e.target.value)} style={{margin:0}} />
                    <button onClick={() => saveEdit(notice.id)} className="btn-primary" style={{padding:'8px', borderRadius:'50%'}}>
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <p style={{marginTop:'5px'}}>{notice.content}</p>
                )}

                {/* --- NEW: COMMENTS & VOTES SECTION INJECTED HERE --- */}
                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  
                  {/* Secretary View: See counts and detailed voter names */}
                  {role === 'secretary' && (
                    <div>
                      <button onClick={() => toggleExpandComments(notice.id)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MessageSquare size={16} /> 
                        {expandedNotices[notice.id] ? 'Hide Comments' : `View Comments ( ${(notice.comments || []).length} )`}
                      </button>

                      {expandedNotices[notice.id] && (
                        <div style={{ marginTop: '10px' }}>
                          {(notice.comments || []).length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No comments yet.</p>}
                          {(notice.comments || []).map(c => (
                            <div key={c.id} style={{ marginBottom: '10px', padding: '10px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '6px' }}>
                              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>{c.authorName}:</strong> {c.text}</p>
                              <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '4px' }}>
                                <strong>Agree ({(c.agrees || []).length}):</strong> {(c.agrees || []).map(u => u.name).join(', ') || 'None'}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '2px' }}>
                                <strong>Disagree ({(c.disagrees || []).length}):</strong> {(c.disagrees || []).map(u => u.name).join(', ') || 'None'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Citizen View: Add comments and interact with Agree/Disagree */}
                  {role === 'citizen' && (
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MessageSquare size={16}/> Comments ({(notice.comments || []).length})
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                        {(notice.comments || []).map(c => {
                          const hasAgreed = (c.agrees || []).some(u => u.email === user?.email);
                          const hasDisagreed = (c.disagrees || []).some(u => u.email === user?.email);

                          return (
                            <div key={c.id} style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '6px' }}>
                              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>{c.authorName}:</strong> {c.text}</p>
                              
                              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                                <button 
                                  onClick={() => handleVote(notice.id, c.id, 'agree')} 
                                  style={{ background: 'none', border: 'none', color: hasAgreed ? '#22c55e' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', padding: 0, fontWeight: hasAgreed ? 'bold' : 'normal' }}>
                                  <ThumbsUp size={14} /> Agree ({(c.agrees || []).length})
                                </button>
                                
                                <button 
                                  onClick={() => handleVote(notice.id, c.id, 'disagree')} 
                                  style={{ background: 'none', border: 'none', color: hasDisagreed ? '#ef4444' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', padding: 0, fontWeight: hasDisagreed ? 'bold' : 'normal' }}>
                                  <ThumbsDown size={14} /> Disagree ({(c.disagrees || []).length})
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          value={newComments[notice.id] || ""} 
                          onChange={(e) => setNewComments({ ...newComments, [notice.id]: e.target.value })}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
                        />
                        <button onClick={() => handleAddComment(notice.id)} className="btn-primary" style={{ padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Send size={14}/> Post
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Edit/Delete Actions (Only Secretary) */}
              {role === 'secretary' && (
                <div style={{display:'flex', gap:'10px', marginLeft:'20px'}}>
                  <button onClick={() => startEdit(notice.id, notice.content)} style={{border:'none', background:'none', cursor:'pointer', color:'#64748b'}}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(notice.id)} style={{border:'none', background:'none', cursor:'pointer', color:'#ef4444'}}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}