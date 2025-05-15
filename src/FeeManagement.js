import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const MONTHS = [
  'June', 'July', 'August', 'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May'
];

function getMonthYearListFromJune() {
    const startYear = 2025;
    const result = [];
  
    for (let i = 0; i < 13; i++) {
      const index = i % 12;
      const year = startYear + Math.floor((5 + i) / 12); // start from June (index 5)
      const month = MONTHS[index];
      result.push({
        month,
        year,
        key: `${month}${year}`
      });
    }
  
    return result;
  }
  

export default function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  const scrollTable = (dir) => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get('https://tut-backend.onrender.com/api/students/fees')
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to fetch students'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckbox = (studentIdx, key) => {
    setStudents(students => students.map((s, idx) => {
      if (idx !== studentIdx) return s;
      const newFees = {
        ...s.fees,
        [key]: {
          paid: !(s.fees?.[key]?.paid),
          paidDate: !(s.fees?.[key]?.paid) ? new Date() : null
        }
      };
      return { ...s, fees: newFees };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await Promise.all(students.map(s =>
        axios.put(`https://tut-backend.onrender.com/api/students/${s._id}/fees`, { fees: s.fees })
      ));
      setSuccess('Changes saved successfully!');
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      setError('Failed to save changes');
    }
    setSaving(false);
  };

  return (
    <div className="app-bg min-vh-100 py-4 position-relative">
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="container position-relative" style={{ zIndex: 2, width: '100vw', maxWidth: '100vw' }}>
        <button className="btn btn-secondary mb-4 fw-bold" onClick={() => navigate('/')}>← Back to Home</button>
        <div ref={tableWrapperRef} className="bg-white rounded-4 shadow-lg p-4 mt-4 fee-table-wrapper">
          <div className="mb-2 text-secondary" style={{ fontSize: '1rem' }}>
            <b>Tip:</b> Scroll horizontally to see all months →
          </div>
          <h2 className="fw-bold mb-4 text-primary">Fee Management</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered align-middle beautiful-table fee-table-scroll">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Date of Joining</th>
                      <th>Phone</th>
                      {getMonthYearListFromJune().map(({ month, year, key }) => (
                        <th key={key}>{month} {year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, sIdx) => {
                      const months = getMonthYearListFromJune();
                      const rowClass = student.paidAdvance === 'Yes' ? 'paid-advance' : 'not-paid-advance';
                      const nameClass = student.paidAdvance === 'Yes' ? 'name-cell paid-advance' : 'name-cell not-paid-advance';
                      const joinDate = new Date(student.dateOfJoining);
                      return (
                        <tr key={student._id} className={rowClass}>
                          <td className={nameClass}>{student.name}</td>
                          <td>{student.class}</td>
                          <td>{student.dateOfJoining}</td>
                          <td>{student.phone}</td>
                          {months.map(({ month, year, key }) => {
                            const joinDate = new Date(student.dateOfJoining);
                            const paid = student.fees?.[key]?.paid;
                            return (
                              <td key={key} style={{ minWidth: 90 }}>
                                <label className="custom-checkbox">
                                  <input type="checkbox" checked={!!paid} onChange={() => handleCheckbox(sIdx, key)} />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-primary fw-bold mt-3" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {success && <div className="alert alert-success mt-3 text-center fw-bold">{success}</div>}
            </>
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
          border-radius: 1.2rem;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(80, 17, 203, 0.10);
          background: rgba(255,255,255,0.85);
          border: 1.5px solid #e3e8f0;
          backdrop-filter: blur(6px);
        }
        .beautiful-table th, .beautiful-table td {
          vertical-align: middle;
          font-size: 1.08rem;
        }
        .beautiful-table thead.table-primary th {
          background: linear-gradient(90deg, #a18cd1 0%, #43cea2 100%) !important;
          color: #23272f;
          font-weight: 700;
          border-bottom: 3px solid #a18cd1;
          letter-spacing: 0.5px;
        }
        .beautiful-table tbody tr.paid-advance {
          background: #e6fbe6 !important;
        }
        .beautiful-table tbody tr.not-paid-advance {
          background: #ffeaea !important;
        }
        .beautiful-table tbody tr {
          transition: background 0.18s, box-shadow 0.18s;
        }
        .beautiful-table tbody tr:hover {
          background: #f3f3fa !important;
          box-shadow: 0 2px 12px #a18cd133;
        }
        .beautiful-table td {
          background: rgba(255,255,255,0.85);
          border-bottom: 1.5px solid #e3e8f0;
          color: #23272f;
        }
        .beautiful-table th, .beautiful-table td {
          border-right: 1.5px solid #e3e8f0;
        }
        .beautiful-table th:last-child, .beautiful-table td:last-child {
          border-right: none;
        }
        .beautiful-table td.name-cell.paid-advance {
          color: #1ca97a !important;
          font-weight: bold;
        }
        .beautiful-table td.name-cell.not-paid-advance {
          color: #e74c3c !important;
          font-weight: bold;
        }
        .custom-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
        }
        .custom-checkbox input[type="checkbox"] {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .custom-checkbox .checkmark {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: #f3f3fa;
          border: 2px solid #bdbdbd;
          display: inline-block;
          position: relative;
          transition: background 0.2s, border 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px #a18cd122;
        }
        .custom-checkbox input[type="checkbox"]:checked + .checkmark {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          border-color: #1ca97a;
          box-shadow: 0 0 0 2px #43cea233;
        }
        .custom-checkbox .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        .custom-checkbox input[type="checkbox"]:checked + .checkmark:after {
          display: block;
        }
        .custom-checkbox .checkmark:after {
          left: 7px;
          top: 3px;
          width: 7px;
          height: 14px;
          border: solid #fff;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }
        .fee-table-wrapper {
          overflow-x: auto !important;
          overflow-y: auto;
          max-height: 70vh;
          min-height: 300px;
          border-bottom: 2px solid #e3e8f0;
          scrollbar-color: #a18cd1 #e3e8f0;
          scrollbar-width: thin;
        }
        .fee-table-scroll {
          min-width: 1200px;
        }
        .fee-table-scroll th, .fee-table-scroll td {
          white-space: nowrap;
        }
        .fee-table-scroll th {
          position: sticky;
          top: 0;
          background: #f3f3fa;
          z-index: 2;
          border-bottom: 2px solid #a18cd1;
        }
        .fee-table-wrapper::-webkit-scrollbar {
          height: 14px;
          background: #e3e8f0;
        }
        .fee-table-wrapper::-webkit-scrollbar-thumb {
          background: #a18cd1;
          border-radius: 6px;
        }
        .fee-table-wrapper::-webkit-scrollbar-track {
          background: #e3e8f0;
        }
        @media (max-width: 600px) {
          .container { padding-left: 0.2rem; padding-right: 0.2rem; }
          .fee-table-wrapper { padding: 0.5rem 0.2rem !important; }
          .beautiful-table { font-size: 0.95rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.3rem 0.2rem; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .container { padding-left: 0.7rem; padding-right: 0.7rem; }
          .fee-table-wrapper { padding: 1rem 0.7rem !important; }
          .beautiful-table { font-size: 1.05rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.5rem 0.4rem; }
        }
        @media (min-width: 901px) {
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          .fee-table-wrapper { padding: 2rem 1.5rem !important; }
          .beautiful-table { font-size: 1.08rem; }
          .beautiful-table th, .beautiful-table td { padding: 0.7rem 0.5rem; }
        }
      `}</style>
    </div>
  );
}
