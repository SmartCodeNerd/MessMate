import React from 'react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="dashboard" style={{ backgroundColor: '#F8F9FA', color: '#2C3E50' }}>
      <h2>Student Dashboard</h2>
      <div>Weekly Calendar</div>
      <div>Meal Selector</div>
      <div>Amount Calculator</div>
      <div>Coupon Summary</div>
      <button style={{ backgroundColor: '#6C8EBF', color: '#F8F9FA' }}>Buy Coupon</button>
      <div>My Coupons</div>
      <button style={{ backgroundColor: '#6C8EBF', color: '#F8F9FA' }}>Trade Coupon</button>
      <div>Trade Marketplace</div>
    </div>
  );
};

export default StudentDashboard;