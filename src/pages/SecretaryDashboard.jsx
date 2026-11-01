import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Calendar, Megaphone, AlertTriangle, X, CheckCircle, User, MessageSquare, Reply, Send, ChevronLeft, ChevronRight, Clock, ArrowUpDown } from 'lucide-react';
import '../App.css';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SecretaryDashboard({ setPage, user }) {
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Tab & Order State for Amenities Schedule
  const [amenityTab, setAmenityTab] = useState('upcoming'); // 'upcoming', 'today', 'future', 'all', 'past'
  const [sortOrder, setSortOrder] = useState('future_first'); // 'future_first' (future on top) or 'today_first'

  // Calendar Month & Year State
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Notice Details / Comments Modal State
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const selectedNotice = notices.find(n => n.id === selectedNoticeId);
  
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({}); 

  const noticeScrollRef = useRef(null);

  // Real-time synchronization for Notices, Complaints, and Bookings
  useEffect(() => {
    // 1. Real-time notices
    const qNotices = query(collection(db, "notices"), orderBy("date", "desc"));
    const unsubNotices = onSnapshot(qNotices, (snap) => {
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error fetching notices:", err));

    // 2. Real-time complaints
    const qComplaints = query(collection(db, "complaints"), orderBy("voteCount", "desc"));
    const unsubComplaints = onSnapshot(qComplaints, (snap) => {
      setComplaints(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error fetching complaints:", err));

    // 3. Real-time bookings
    const qBookings = query(collection(db, "bookings"), orderBy("date", "asc"));
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error fetching bookings:", err));

    return () => {
      unsubNotices();
      unsubComplaints();
      unsubBookings();
    };
  }, []);

  const handleTaskCompleted = async (id) => {
    if (window.confirm("Mark this complaint as resolved?")) {
      await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
    }
  };

  const handleReply = async (noticeId, commentId) => {
    const replyText = replyInputs[commentId];
    if (!replyText || !replyText.trim()) return;

    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;
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

  // Calendar Navigation Handlers
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
    setSelectedCalendarDate(null);
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
    setSelectedCalendarDate(null);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setCalMonth(today.getMonth());
    setCalYear(today.getFullYear());
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedCalendarDate(`${today.getFullYear()}-${m}-${d}`);
  };

  // Current Date String in Local YYYY-MM-DD
  const getTodayDateStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayDateStr();

  // Helper to compare timing (e.g. "09:00", "13:30")
  const compareTime = (a, b) => {
    const tA = a.startTime || a.time || "";
    const tB = b.startTime || b.time || "";
    return tA.localeCompare(tB);
  };

  // 1. Current Date (Today's) Bookings - sorted strictly by timing
  const todayBookings = bookings
    .filter(b => b.date === todayStr)
    .sort(compareTime);

  // 2. Future Dates Bookings - sorted by date, and on the same date by timing
  const futureBookings = bookings
    .filter(b => b.date && b.date > todayStr)
    .sort((a, b) => {
      const dComp = a.date.localeCompare(b.date);
      if (dComp !== 0) return dComp;
      return compareTime(a, b);
    });

  // 3. Past Bookings - sorted with latest past first
  const pastBookings = bookings
    .filter(b => !b.date || b.date < todayStr)
    .sort((a, b) => {
      const dComp = (b.date || "").localeCompare(a.date || "");
      if (dComp !== 0) return dComp;
      return compareTime(b, a);
    });

  // Determine displayed bookings based on active tab and sortOrder
  let displayedBookings = [];
  if (amenityTab === 'today') {
    displayedBookings = todayBookings;
  } else if (amenityTab === 'future') {
    displayedBookings = futureBookings;
  } else if (amenityTab === 'past') {
    displayedBookings = pastBookings;
  } else if (amenityTab === 'all') {
    displayedBookings = sortOrder === 'future_first'
      ? [...futureBookings, ...todayBookings, ...pastBookings]
      : [...todayBookings, ...futureBookings, ...pastBookings];
  } else {
    // Default 'upcoming':
    displayedBookings = sortOrder === 'future_first'
      ? [...futureBookings, ...todayBookings]
      : [...todayBookings, ...futureBookings];
  }

  // Generate Year Options (-5 to +5 years around current year)
  const currentSystemYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentSystemYear - 5; y <= currentSystemYear + 5; y++) {
    yearOptions.push(y);
  }

  // Calendar Grid Calculation
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  // Helper to get bookings for a given day in the calendar (sorted by timing)
  const getBookingsForDay = (day) => {
    const m = String(calMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const checkDate = `${calYear}-${m}-${d}`;
    return bookings.filter(b => b.date === checkDate).sort(compareTime);
  };

  // Check if given day is Today
  const checkIsToday = (day) => {
    const today = new Date();
    return today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
  };

  // Bookings in the currently viewed month
  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const currentMonthBookings = bookings
    .filter(b => b.date && b.date.startsWith(monthPrefix))
    .sort((a, b) => {
      const dComp = a.date.localeCompare(b.date);
      if (dComp !== 0) return dComp;
      return compareTime(a, b);
    });

  // Bookings on the currently clicked date (sorted by timing)
  const selectedDateBookings = selectedCalendarDate 
    ? bookings.filter(b => b.date === selectedCalendarDate).sort(compareTime)
    : [];

  const activeComplaints = complaints.filter(c => c.status !== 'Resolved');
  const solvedComplaints = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="dashboard-feed">
      
      {/* Evidence Image Modal */}
      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setViewImage(null)}><X size={24} /></button>
            <img src={viewImage} alt="Full View" className="modal-image" />
          </div>
        </div>
      )}

      {/* 12-MONTH CALENDAR MODAL WITH CHANGEABLE YEARS */}
      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{
              background: '#ffffff', 
              padding: '25px', 
              borderRadius: '20px', 
              maxWidth: '560px', 
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <button className="close-modal-btn" onClick={() => setShowCalendar(false)}><X size={24} /></button>
            
            {/* Calendar Title & Month/Year Header */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f46e5' }}>
                <Calendar size={22} />
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1e293b' }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </h3>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                {currentMonthBookings.length} {currentMonthBookings.length === 1 ? 'amenity booking' : 'amenity bookings'} in this month
              </p>
            </div>

            {/* Navigation & Controls Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '18px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              flexWrap: 'wrap'
            }}>
              {/* Prev Month Button */}
              <button 
                onClick={handlePrevMonth}
                title="Previous Month"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600',
                  color: '#334155'
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {/* Month Dropdown (12 Months) & Year Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select 
                  value={calMonth} 
                  onChange={e => {
                    setCalMonth(Number(e.target.value));
                    setSelectedCalendarDate(null);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: '600',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx} value={idx}>{name}</option>
                  ))}
                </select>

                <select 
                  value={calYear} 
                  onChange={e => {
                    setCalYear(Number(e.target.value));
                    setSelectedCalendarDate(null);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: '600',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <button
                  onClick={handleResetToToday}
                  style={{
                    background: '#e0e7ff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    color: '#4338ca',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Today
                </button>
              </div>

              {/* Next Month Button */}
              <button 
                onClick={handleNextMonth}
                title="Next Month"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600',
                  color: '#334155'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Day of Week Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} style={{ fontWeight: '700', fontSize: '0.8rem', color: i === 0 || i === 6 ? '#ef4444' : '#64748b' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
              {/* Blank offset cells */}
              {[...Array(firstDayOfWeek)].map((_, i) => (
                <div key={`blank-${i}`} style={{ padding: '10px 0', visibility: 'hidden' }}></div>
              ))}

              {/* Actual Month Days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDay(day);
                const isBooked = dayBookings.length > 0;
                const isToday = checkIsToday(day);

                const m = String(calMonth + 1).padStart(2, '0');
                const d = String(day).padStart(2, '0');
                const dateKey = `${calYear}-${m}-${d}`;
                const isSelected = selectedCalendarDate === dateKey;

                let bg = '#f8fafc';
                let textColor = '#334155';
                let border = '1px solid #e2e8f0';

                if (isSelected) {
                  bg = '#4f46e5';
                  textColor = '#ffffff';
                  border = '2px solid #3730a3';
                } else if (isBooked) {
                  bg = '#fee2e2';
                  textColor = '#991b1b';
                  border = '1px solid #f87171';
                } else if (isToday) {
                  bg = '#e0e7ff';
                  textColor = '#3730a3';
                  border = '2px solid #6366f1';
                }

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedCalendarDate(isSelected ? null : dateKey)}
                    style={{
                      padding: '8px 2px',
                      borderRadius: '10px', 
                      background: bg,
                      color: textColor,
                      fontWeight: isBooked || isToday || isSelected ? '700' : '500',
                      border: border,
                      cursor: 'pointer',
                      position: 'relative',
                      minHeight: '44px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    title={isBooked ? `${dayBookings.length} booking(s) on ${dateKey}` : `${dateKey}`}
                  >
                    <span style={{ fontSize: '0.95rem', lineHeight: '1' }}>{day}</span>
                    {isBooked && (
                      <span style={{
                        marginTop: '3px',
                        fontSize: '0.65rem',
                        background: isSelected ? '#ffffff' : '#ef4444',
                        color: isSelected ? '#4f46e5' : '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '8px',
                        fontWeight: '800'
                      }}>
                        {dayBookings.length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', fontSize: '0.78rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                <span>Booked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
                <span>Today</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e2e8f0', border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
                <span>Available</span>
              </div>
            </div>

            {/* Bookings Details Panel for Selected Date or Selected Month */}
            <div style={{ marginTop: '20px', borderTop: '2px dashed #e2e8f0', paddingTop: '15px' }}>
              {selectedCalendarDate ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
                      Bookings on <b>{selectedCalendarDate}</b>
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      background: selectedDateBookings.length > 0 ? '#fee2e2' : '#f1f5f9',
                      color: selectedDateBookings.length > 0 ? '#991b1b' : '#64748b',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '700'
                    }}>
                      {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'Slot' : 'Slots'}
                    </span>
                  </div>

                  {selectedDateBookings.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      No amenities booked for this date.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                      {selectedDateBookings.map((b, idx) => (
                        <div 
                          key={b.id || idx}
                          style={{
                            padding: '10px 12px',
                            background: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.9rem' }}>{b.facility}</strong>
                            <small style={{ color: '#64748b', fontSize: '0.8rem' }}>By: {b.user || b.email}</small>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                            <Clock size={12} /> {b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : (b.time || "-")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                      {MONTH_NAMES[calMonth]} {calYear} Schedule Overview
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click any date to see slots</span>
                  </div>
                  {currentMonthBookings.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      No bookings recorded for {MONTH_NAMES[calMonth]} {calYear}.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                      {currentMonthBookings.map((b, idx) => (
                        <div key={b.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem' }}>
                          <div>
                            <b style={{ color: '#1e293b' }}>{b.date?.split('-')[2]} {MONTH_NAMES[calMonth].substring(0, 3)}:</b> <span style={{ color: '#4f46e5', fontWeight: '600' }}>{b.facility}</span> ({b.startTime} - {b.endTime})
                          </div>
                          <small style={{ color: '#64748b' }}>{b.user || b.email}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Notice Details & Secretary Comments Modal */}
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

        {/* RIGHT COLUMN: AMENITIES SCHEDULE (ORGANIZED BY CURRENT DATE, TIMING & FUTURE DATES ON TOP) */}
        <div className="dashboard-col-right">
          <div className="feed-card amenity-feed">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar className="icon" />
                  <h3 style={{ margin: 0 }}>Amenities Schedule</h3>
                  <span style={{
                    background: '#e0e7ff',
                    color: '#4338ca',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {displayedBookings.length}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                  📅 Today: <b>{new Date().toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</b>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="btn-secondary" onClick={() => setShowCalendar(true)} style={{ padding: '7px 12px', fontSize: '0.85rem' }}>
                  View Calendar
                </button>
                <button className="btn-primary" onClick={() => setPage('amenities')} style={{ padding: '7px 12px', fontSize: '0.85rem' }}>
                  Book Now
                </button>
              </div>
            </div>

            {/* Filter Tabs & Order Toggle Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '10px 15px', 
              background: '#f8fafc', 
              borderBottom: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'upcoming', label: `Upcoming (${todayBookings.length + futureBookings.length})` },
                  { key: 'today', label: `Today (${todayBookings.length})` },
                  { key: 'future', label: `Future (${futureBookings.length})` },
                  { key: 'all', label: `All (${bookings.length})` },
                  { key: 'past', label: `Past (${pastBookings.length})` }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setAmenityTab(tab.key)}
                    style={{
                      background: amenityTab === tab.key ? '#4f46e5' : '#ffffff',
                      color: amenityTab === tab.key ? '#ffffff' : '#475569',
                      border: '1px solid',
                      borderColor: amenityTab === tab.key ? '#4f46e5' : '#cbd5e1',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Order Toggle (Future Dates on Top vs Today on Top) */}
              {(amenityTab === 'upcoming' || amenityTab === 'all') && (
                <button
                  onClick={() => setSortOrder(prev => prev === 'future_first' ? 'today_first' : 'future_first')}
                  title="Toggle Display Order"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <ArrowUpDown size={12} />
                  {sortOrder === 'future_first' ? '⚡ Future Dates Top' : '📅 Today Top'}
                </button>
              )}
            </div>

            {/* Bookings Feed Content */}
            <div className="card-content" style={{ maxHeight: '420px', overflowY: 'auto', padding: '15px' }}>
              {displayedBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8' }}>
                  <Calendar size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {amenityTab === 'today' ? "No bookings scheduled for today." : 
                     amenityTab === 'future' ? "No future bookings found." : 
                     "No amenities booked yet."}
                  </p>
                </div>
              ) : (
                displayedBookings.map((b, i) => {
                  const dateObj = new Date(b.date);
                  const isValidDate = !isNaN(dateObj.getTime());
                  const day = isValidDate ? dateObj.getDate() : (b.date?.split('-')[2] || '--');
                  const month = isValidDate ? dateObj.toLocaleString('default', { month: 'short' }) : 'DATE';

                  const isToday = b.date === todayStr;
                  const isFuture = b.date && b.date > todayStr;
                  const isPast = !b.date || b.date < todayStr;

                  return (
                    <div 
                      key={b.id || i} 
                      className="booking-item"
                      style={{
                        borderColor: isToday ? '#86efac' : isFuture ? '#c7d2fe' : '#e2e8f0',
                        background: isToday ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div 
                        className="booking-date"
                        style={{
                          background: isToday 
                            ? 'linear-gradient(135deg, #16a34a, #22c55e)' 
                            : isFuture 
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                            : 'linear-gradient(135deg, #64748b, #94a3b8)'
                        }}
                      >
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                      </div>
                      <div className="booking-details" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{b.facility}</strong>
                          {isToday && (
                            <span style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #86efac',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontWeight: '800'
                            }}>
                              TODAY
                            </span>
                          )}
                          {isFuture && (
                            <span style={{
                              background: '#e0e7ff',
                              color: '#4338ca',
                              border: '1px solid #c7d2fe',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontWeight: '700'
                            }}>
                              UPCOMING
                            </span>
                          )}
                          {isPast && (
                            <span style={{
                              background: '#f1f5f9',
                              color: '#64748b',
                              border: '1px solid #e2e8f0',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontWeight: '600'
                            }}>
                              PAST
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0', color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} style={{ color: '#6366f1' }} />
                          <b>{b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : (b.time || "-")}</b>
                        </p>
                        <small style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={13} /> By: {b.user || b.email}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
