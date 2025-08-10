import React from 'react';
import useAuthStore from '../../stores/useAuthStore.js';
import { FaUser, FaEnvelope, FaIdCard, FaUniversity, FaPhone } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-steel-blue to-blue-600 p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-powder-blue flex items-center justify-center text-4xl border-4 border-white shadow-md">
            😊
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.name || 'N/A'}</h2>
          <p className="text-sm text-gray-200">{user?.role || 'N/A'}</p>
        </div>
        {/* Details Section */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaIdCard className="text-steel-blue text-lg" />
              <div>
                <p className="text-sm font-medium text-gray-600">Student ID</p>
                <p className="text-gray-800">{user?.studentId || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-steel-blue text-lg" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-800">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaUniversity className="text-steel-blue text-lg" />
              <div>
                <p className="text-sm font-medium text-gray-600">College</p>
                <p className="text-gray-800">{user?.collegeId?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-steel-blue text-lg" />
              <div>
                <p className="text-sm font-medium text-gray-600">Contact Number</p>
                <p className="text-gray-800">{user?.contactNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              className="px-6 py-2 bg-steel-blue text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
              disabled
            >
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;