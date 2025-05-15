import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

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

export default function AddStudent() {
  const [form, setForm] = useState({
    name: '',
    class: '',
    dateOfJoining: '',
    address: '',
    phone: '',
    paidAdvance: '',
    photo: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      await axios.post('http://localhost:5000/api/students', form);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1500);
      setForm({
        name: '',
        class: '',
        dateOfJoining: '',
        address: '',
        phone: '',
        paidAdvance: '',
        photo: ''
      });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong!');
      console.log(err);
    }
  };

  return (
    <div className="app-bg min-vh-100 d-flex align-items-center justify-content-center position-relative">
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="container position-relative" style={{zIndex:2, maxWidth: 500}}>
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
          className="bg-white rounded-4 shadow-lg p-5"
        >
          <button className="btn btn-secondary mb-4 fw-bold" onClick={() => navigate('/')}>← Back to Home</button>
          <h2 className="mb-4 text-center fw-bold text-primary">Add Student</h2>
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
              {status === 'loading' ? 'Submitting...' : 'Add Student'}
            </button>
          </form>
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="alert alert-success mt-4 text-center fw-bold"
              >
                Student added successfully!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="alert alert-danger mt-4 text-center fw-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Custom CSS for background reuse */}
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