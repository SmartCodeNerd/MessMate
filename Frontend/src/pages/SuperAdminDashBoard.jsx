import React, { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import ChangePassword from './ChangePassword';
import Colleges from './superAdmin-dashboard/Colleges';
import Dashboard from './superAdmin-dashboard/Dashboard';
import Profile from './superAdmin-dashboard/Profile.jsx';
import Analytics from "./superAdmin-dashboard/Analytics.jsx";
import Navbar from '../components/Navbar.jsx';


const SuperAdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const sections = {
    Dashboard,
    Colleges,
    Analytics,
    'Change Password': ChangePassword,
    Profile
  };

  const sidebarSections = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'colleges', label: 'Colleges', icon: '🏫' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'change-password', label: 'Change Password', icon: '🔒' },
    { id: 'profile', label: 'Profile', icon: '👤' }, // Added Profile section
  ];

  const ActiveComponent = sections[activeSection] || Dashboard;

  const handleLogout = () => {
    logout();
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsSidebarOpen(false);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsSidebarOpen(!isPinned); // Keep sidebar open if pinning, collapse if unpinning
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out relative ${
            isSidebarOpen ? 'w-64' : 'w-16'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-6 space-y-2">
            {sidebarSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.label)}
                className={`w-full flex items-center py-3 rounded-lg text-left transition-colors relative ${
                  activeSection === section.label
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${isSidebarOpen ? 'px-4 space-x-3' : 'justify-center'}`}
              >
                <span className="text-lg flex-shrink-0">{section.icon}</span>
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap overflow-hidden">
                    {section.label}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Collapse Button */}
          <div
            className={`absolute bottom-4 w-full flex ${
              isSidebarOpen && !isPinned ? 'justify-center' : 'justify-end pr-4'
            } transition-all duration-300 ease-in-out`}
          >
            <button
              onClick={togglePin}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isPinned ? 'rotate-180' : ''
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
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;