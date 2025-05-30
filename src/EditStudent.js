import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const classOptions = [
  { label: 'Class 1', value: '1' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 3', value: '3' },
  { label: 'Class 4', value: '4' },
  { label: 'Class 5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    class: '',
    dateOfJoining: '',
    address: '',
    phone: '',
    paidAdvance: '',
    photo: ''
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`https://tut-backend.onrender.com/api/students/${id}`)
      .then(res => setForm(res.data))
      .catch(() => setError('Failed to fetch student'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleRadio = e => {
    setForm(f => ({ ...f, paidAdvance: e.target.value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await axios.put(`https://tut-backend.onrender.com/api/students/${id}`, form);
      setStatus('success');
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="app-bg min-vh-100 d-flex align-items-center justify-content-center position-relative">
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="container position-relative" style={{zIndex:2, maxWidth: 500}}>
        <div className="bg-white rounded-4 shadow-lg p-5 mt-4">
          <button className="btn btn-secondary mb-4 fw-bold" onClick={() => navigate(-1)}>&larr; Back</button>
          <h2 className="mb-4 text-center fw-bold text-primary">Edit Student</h2>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Class</label>
                <select className="form-select" name="class" value={form.class} onChange={handleChange} required>
                  <option value="">Select Class</option>
                  {classOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Date Of Joining</label>
                <input type="date" className="form-control" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Address</label>
                <textarea className="form-control" name="address" value={form.address} onChange={handleChange} rows={2} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} required pattern="[0-9]{10,}" maxLength={15} placeholder="Enter phone number" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold d-block mb-2">Paid Advance</label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="paidAdvance" value="Yes" checked={form.paidAdvance === 'Yes'} onChange={handleRadio} required />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="paidAdvance" value="No" checked={form.paidAdvance === 'No'} onChange={handleRadio} required />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Photo (optional)</label>
                <input type="file" accept="image/*" capture="environment" className="form-control" onChange={handlePhotoChange} />
                {form.photo && (
                  <div className="mt-2 text-center">
                    <img src={form.photo} alt="Preview" style={{maxWidth:100, maxHeight:100, borderRadius:'50%', boxShadow:'0 2px 8px #0002'}} />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold position-relative" disabled={status==='loading'}>
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
          {status === 'success' && (
            <div className="alert alert-success mt-4 text-center fw-bold">Student updated successfully!</div>
          )}
          {status === 'error' && (
            <div className="alert alert-danger mt-4 text-center fw-bold">{error}</div>
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
        @media (max-width: 600px) {
          .container { padding-left: 0.2rem; padding-right: 0.2rem; }
          .bg-white { padding: 1rem 0.2rem !important; }
          .form-control, .form-select, .btn { font-size: 0.95rem; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .container { padding-left: 0.7rem; padding-right: 0.7rem; }
          .bg-white { padding: 2rem 0.7rem !important; }
          .form-control, .form-select, .btn { font-size: 1.05rem; }
        }
        @media (min-width: 901px) {
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          .bg-white { padding: 3rem 1.5rem !important; }
          .form-control, .form-select, .btn { font-size: 1.08rem; }
        }
      `}</style>
    </div>
  );
} 