import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ClassStudentsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`http://localhost:5000/api/students/by-class?class=${classId}`)
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to fetch students'))
      .finally(() => setLoading(false));
  }, [classId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(students => students.filter(s => s._id !== id));
      setSuccessMsg('Student deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 1500);
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  return (
    <div className="app-bg min-vh-100 py-4 position-relative">
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="container position-relative" style={{zIndex:2, maxWidth: 900}}>
        <div className="bg-white rounded-4 shadow-lg p-5 mt-4">
          <button className="btn btn-secondary mb-4 fw-bold" onClick={() => navigate(-1)}>&larr; Back</button>
          <h2 className="fw-bold mb-4 text-primary">Students in Class {classId}</h2>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : students.length === 0 ? (
            <div className="alert alert-info text-center">No students found in this class.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle beautiful-table">
                <thead className="table-primary">
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Date Of Joining</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Paid Advance</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={idx}>
                      <td>
                        {student.photo ? (
                          <img src={student.photo} alt="Student" style={{width:40, height:40, borderRadius:'50%', objectFit:'cover', boxShadow:'0 1px 4px #0002'}} />
                        ) : (
                          <div style={{width:40, height:40, borderRadius:'50%', background:'#e0e7ef', display:'flex', alignItems:'center', justifyContent:'center', color:'#888', fontWeight:600, fontSize:18}}>
                            <span role="img" aria-label="No Photo">👤</span>
                          </div>
                        )}
                      </td>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td>{student.dateOfJoining}</td>
                      <td>{student.address}</td>
                      <td>{student.phone}</td>
                      <td>{student.paidAdvance}</td>
                      <td><button className="btn btn-sm btn-primary fw-bold" onClick={() => navigate(`/edit-student/${student._id}`)}>Edit</button></td>
                      <td><button className="btn btn-sm btn-danger fw-bold" onClick={() => handleDelete(student._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success text-center fw-bold mb-3">{successMsg}</div>
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