import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddStudent from './AddStudent';
import ClassStudentsPage from './ClassStudentsPage';
import EditStudent from './EditStudent';
import FeeManagement from './FeeManagement';
import AttendanceManagement from './AttendanceManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/class/:classId" element={<ClassStudentsPage />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/fees-management" element={<FeeManagement />} />
        <Route path="/attendance-management" element={<AttendanceManagement />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;