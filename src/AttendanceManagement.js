import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './styles/AttendanceHistory.css';

export default function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('https://tut-backend.onrender.com/api/students'),
      axios.get('https://tut-backend.onrender.com/api/students/attendance-records')
    ])
      .then(([studentsRes, attendanceRes]) => {
        setStudents(studentsRes.data);
        setAttendance(studentsRes.data.map(s => ({ studentId: s._id, status: 'Present' })));
        setAttendanceRecords(attendanceRes.data);
      })
      .catch(() => setMessage('Failed to fetch students or attendance records'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = (studentId, status) => {
    setAttendance(att => att.map(a => a.studentId === studentId ? { ...a, status } : a));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      await axios.post('https://tut-backend.onrender.com/api/students/attendance', { date, attendance });
      setStatus('success');
      setMessage('Attendance submitted!');
      setShowHistory(true);
    } catch (err) {
      setStatus('error');
      setMessage('Failed to submit attendance');
    }
  };

  const getAttendanceStats = (studentId) => {
    const records = attendanceRecords.filter(r => r.studentId === studentId);
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
    return { total, present, percent };
  };

  // Filtered dates
  const allDates = Array.from(new Set(attendanceRecords.map(r => r.date))).sort()
    .filter(date => (!filterStart || date >= filterStart) && (!filterEnd || date <= filterEnd));

  // Helper to get status for a student on a specific date
  const getStatusForDate = (studentId, date) => {
    const rec = attendanceRecords.find(r => r.studentId === studentId && r.date === date);
    return rec ? rec.status : '-';
  };

  // Export as CSV
  const exportCSV = () => {
    let csv = 'Name,Phone,' + allDates.join(',') + '\n';
    students.forEach(s => {
      csv += `"${s.name}","${s.phone}",` + allDates.map(date => getStatusForDate(s._id, date)).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'attendance.csv');
  };

  // Edit attendance cell
  const handleEditAttendance = async (studentId, date) => {
    setEditLoading(true);
    const rec = attendanceRecords.find(r => r.studentId === studentId && r.date === date);
    const newStatus = rec && rec.status === 'Present' ? 'Absent' : 'Present';
    try {
      await axios.post('https://tut-backend.onrender.com/api/students/attendance', {
        date,
        attendance: [{ studentId, status: newStatus }]
      });
      setAttendanceRecords(records => {
        const idx = records.findIndex(r => r.studentId === studentId && r.date === date);
        if (idx !== -1) {
          const updated = [...records];
          updated[idx] = { ...updated[idx], status: newStatus };
          return updated;
        } else {
          return [...records, { studentId, date, status: newStatus }];
        }
      });
    } catch (err) {
      alert('Failed to update attendance');
    }
    setEditLoading(false);
  };

  return (
    <div className="app-bg min-vh-100 py-4 position-relative">
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="container position-relative" style={{zIndex:2, maxWidth: 1100}}>
        <div className="bg-white rounded-4 shadow-lg p-5 mt-4">
          <button className="btn btn-secondary mb-4 fw-bold" onClick={() => navigate('/')}>← Back to Home</button>
          <h2 className="fw-bold mb-4 text-primary">Attendance Management</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4 d-flex align-items-center gap-3">
              <label className="fw-semibold">Attendance Date:</label>
              <input type="date" className="form-control" style={{maxWidth:200}} value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>
            ) : students.length === 0 ? (
              <div className="alert alert-info text-center">No students found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle beautiful-table">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.phone}</td>
                        <td>
                          <div className="d-flex gap-3">
                            <label className="fw-normal">
                              <input type="radio" name={`status-${s._id}`} value="Present" checked={attendance.find(a => a.studentId === s._id)?.status === 'Present'} onChange={() => handleStatus(s._id, 'Present')} /> Present
                            </label>
                            <label className="fw-normal">
                              <input type="radio" name={`status-${s._id}`} value="Absent" checked={attendance.find(a => a.studentId === s._id)?.status === 'Absent'} onChange={() => handleStatus(s._id, 'Absent')} /> Absent
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button type="submit" className="btn btn-primary fw-bold mt-3" disabled={status==='loading'}>
              {status === 'loading' ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
          {message && (
            <div className={`alert mt-4 text-center fw-bold ${status==='success' ? 'alert-success' : status==='error' ? 'alert-danger' : 'alert-info'}`}>{message}</div>
          )}
          <button className="btn btn-info fw-bold mb-4" style={{float:'right'}} onClick={()=>setShowHistory(v=>!v)}>
            {showHistory ? 'Hide Full Attendance' : 'View Full Attendance'}
          </button>
          {showHistory && attendanceRecords.length > 0 && (
            <div className="mt-5 attendance-history-section">
              <h4 className="fw-bold mb-3 text-secondary">Attendance Table (Full History)</h4>
              <div className="d-flex gap-3 align-items-center mb-3">
                <label>Start Date:</label>
                <input type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} />
                <label>End Date:</label>
                <input type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} />
                <button className="btn btn-success btn-sm fw-bold" onClick={exportCSV}>Export CSV</button>
              </div>
              <div className="table-responsive attendance-history-table-wrapper" style={{minWidth: '100%', overflowX: 'auto'}}>
                <table className="table table-bordered align-middle beautiful-table attendance-history-table" style={{minWidth: 900, width: 'max-content'}}>
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      {allDates.map(date => (
                        <th key={date}>{date}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td className="student-name-cell">{s.name}</td>
                        {allDates.map(date => {
                          const status = getStatusForDate(s._id, date);
                          return (
                            <td key={date}
                              className={status === 'Absent' ? 'table-danger attendance-cell' : status === 'Present' ? 'table-success attendance-cell' : 'attendance-cell'}
                              style={{ cursor: 'pointer', opacity: editLoading ? 0.5 : 1 }}
                              onClick={() => !editLoading && handleEditAttendance(s._id, date)}
                            >
                              {status}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .app-bg {
          background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') no-repeat center center fixed;
          background-size: cover;
        }
        .bg-overlay {
          background: rgba(20, 20, 40, 0.85);
          z-index: 1;
        }
        .beautiful-table {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(80, 17, 203, 0.08);
        }
        .beautiful-table th, .beautiful-table td {
          vertical-align: middle;
        }
        @media (max-width: 600px) {
          .container { padding-left: 0.2rem; padding-right: 0.2rem; }
          .bg-white { padding: 1rem 0.2rem !important; }
          .beautiful-table { font-size: 0.95rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.3rem 0.2rem; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .container { padding-left: 0.7rem; padding-right: 0.7rem; }
          .bg-white { padding: 2rem 0.7rem !important; }
          .beautiful-table { font-size: 1.05rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.5rem 0.4rem; }
        }
        @media (min-width: 901px) {
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          .bg-white { padding: 3rem 1.5rem !important; }
          .beautiful-table { font-size: 1.08rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.7rem 0.5rem; }
        }
      `}</style>
    </div>
  );
} 