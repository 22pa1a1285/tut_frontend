import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  // Colors for class boxes
  const classColors = [
    'linear-gradient(135deg, #232526 0%, #414345 100%)', // 1-5 group
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // 6
    'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', // 7
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // 8
    'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)', // 9
    'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', // 10
  ];

  const handleClassClick = (cls) => {
    navigate(`/class/${cls}`);
  };

  return (
    <div className="app-bg min-vh-100 py-4 position-relative">
      {/* Overlay for dark effect */}
      <div className="bg-overlay position-absolute top-0 start-0 w-100 h-100"></div>
      <div className="position-relative" style={{zIndex:2}}>
        {/* Top Management Buttons */}
        <div className="container mb-5">
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center mb-4">
            <Link to="/add-student" className="btn btn-success btn-lg shadow fw-bold px-4">Add Student</Link>
            <button className="btn btn-warning btn-lg shadow fw-bold px-4 text-white" onClick={() => navigate('/fees-management')}>Fees Management</button>
            <button className="btn btn-info btn-lg shadow fw-bold px-4 text-white" onClick={() => navigate('/attendance-management')}>Attendance Management</button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="container mb-5">
          <div className="p-5 rounded-4 shadow-lg text-center bg-gradient" style={{background: 'linear-gradient(90deg, #232526 0%, #414345 100%)'}}>
            <h1 className="display-4 fw-bold text-white mb-3">Welcome to Tuition Management Dashboard</h1>
            <p className="lead text-white-50 mb-0">Effortlessly manage your classes, students, attendance, and fees!</p>
          </div>
        </div>

        {/* Classes Section */}
        <div className="container mb-5">
          <h2 className="mb-4 text-light fw-bold">Classes</h2>
          <div className="row g-4 mb-4">
            {/* Classes 1-5 in one box labeled 'Class 1-5' */}
            <div className="col-12">
              <div className="card h-100 border-0 shadow-lg class-group-card p-3 d-flex flex-column align-items-center justify-content-center class-clickable" style={{background: classColors[0], minHeight: 110, cursor: 'pointer'}} onClick={() => handleClassClick('1-5')}>
                <span className="display-6 fw-bold text-white">Class 1-5</span>
                <span className="text-white-50">Group</span>
              </div>
            </div>
          </div>
          {/* Classes 6-10 as individual boxes */}
          <div className="row g-4">
            {[6,7,8,9,10].map((cls, idx) => (
              <div className="col-6 col-md-4 col-lg-2" key={cls}>
                <div className="card h-100 border-0 shadow-sm class-card rounded-4 d-flex flex-column align-items-center justify-content-center class-clickable" style={{background: classColors[idx+1], minHeight: 110, cursor: 'pointer'}} onClick={() => handleClassClick(cls.toString())}>
                  <span className="display-6 fw-bold text-white">{cls}</span>
                  <span className="text-white-50">Class</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Custom CSS for effects and background */}
      <style>{`
        .app-bg {
          background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') no-repeat center center fixed;
          background-size: cover;
        }
        .bg-overlay {
          background: rgba(20, 20, 40, 0.85);
          z-index: 1;
        }
        .class-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .class-card:hover, .class-group-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 8px 32px rgba(106,17,203,0.15);
        }
        .class-group-card {
          background: linear-gradient(135deg, #232526 0%, #414345 100%) !important;
        }
        .bg-gradient {
          background: linear-gradient(90deg, #232526 0%, #414345 100%) !important;
        }
        .class-clickable:hover {
          box-shadow: 0 12px 36px rgba(80, 17, 203, 0.18) !important;
          filter: brightness(1.08);
        }
        .beautiful-table {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(80, 17, 203, 0.08);
        }
        .beautiful-table th, .beautiful-table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}

export default Dashboard; 