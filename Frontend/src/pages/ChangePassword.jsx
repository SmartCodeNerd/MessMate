import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

// Helper component for the show/hide password button to keep the main component clean
const PasswordToggleButton = ({ show, toggle }) => (
    <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
    >
        {/* Use the imported React Icons */}
        {show ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
    </button>
);

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate new and confirm passwords
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      // Placeholder for API call to change password
      // await changePassword({ oldPassword, newPassword });
      setSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-5 px-4">
            <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-blue-900">Change Password</h2>
                        <p className="mt-2 text-base text-gray-600">Update your account password below.</p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* --- Dynamic Message Display --- */}
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center">
                                {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Old Password</label>
                                <div className="relative">
                                    <input
                                        id="old-password"
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Enter your old password"
                                    />
                                    <PasswordToggleButton show={showOldPassword} toggle={() => setShowOldPassword(!showOldPassword)} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Enter new password"
                                    />
                                    <PasswordToggleButton show={showNewPassword} toggle={() => setShowNewPassword(!showNewPassword)} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Confirm your new password"
                                    />
                                    <PasswordToggleButton show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;