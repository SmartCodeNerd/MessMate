import React from 'react';
import useAuthStore from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    'Purchase meal coupons',
    'Trade unused meals',
    'View weekly menus',
    'Track coupon history',
    'Secure Razorpay payments',
    'Role-based dashboards',
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MessMate</h1>
        <p className="text-lg text-gray-600 mb-6">
          A seamless coupon-based mess management system for college students.
        </p>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </button>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <li key={index} className="text-gray-600 bg-white p-3 rounded-lg shadow-sm">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;