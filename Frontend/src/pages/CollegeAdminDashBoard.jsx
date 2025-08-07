import React from 'react';


const CollegeAdminDashboard = () => {
  return (
    <div className="dashboard" style={{ backgroundColor: '#F8F9FA', color: '#2C3E50' }}>
      <h2>College Admin Dashboard</h2>
      <div>Usage Stats</div>
      <div>Student List</div>
      <button style={{ backgroundColor: '#6C8EBF', color: '#F8F9FA' }}>Download Reports</button>
    </div>
  );
};

export default CollegeAdminDashboard;