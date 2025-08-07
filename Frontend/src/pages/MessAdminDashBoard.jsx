import React, { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import Navbar from '../components/Navbar';
import Dashboard from './messAdmin-dashboard/Dashboard';
import Students from './messAdmin-dashboard/Students';
import Analytics from './messAdmin-dashboard/Analytics';
import Profile from './messAdmin-dashboard/Profile';

const MessAdminDashBoard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sections = {
    Dashboard,
    Students,
    'Mark Meals': Analytics, // Using Analytics as a placeholder for Mark Meals
    Profile,
  };

  const sidebarSections = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'mark-meals', label: 'Mark Meals', icon: '✅' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const ActiveComponent = sections[activeSection] || Dashboard;

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <h2 className="text-xl font-bold text-gray-800">MessMate</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isSidebarOpen ? '' : 'rotate-180'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-2">
            {sidebarSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.label
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                {isSidebarOpen && <span className="font-medium">{section.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default MessAdminDashBoard;