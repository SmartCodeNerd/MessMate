import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getUserName = () => {
        return user?.name || 'User';
    };

    const getUserInitial = () => {
        return user?.name?.charAt(0)?.toUpperCase() || 'U';
    };

    const getRoleDisplay = () => {
        const roleMap = {
            'Student': 'STUDENT',
            'Mess Admin': 'MESS ADMIN',
            'College Admin': 'COLLEGE ADMIN',
            'Super Admin': 'SUPER ADMIN',
        };
        return roleMap[user?.role] || 'USER';
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/", { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).replace(/(\d+)/, (match) => match.padStart(2, '0'));
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">MessMate</h1>
                {user && (
                    <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getRoleDisplay()}
                    </span>
                )}
            </div>
            {/* --- Header / Navigation ---
            <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <a href="/" className="text-2xl font-bold text-blue-900">MessMate</a>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a>
                        </nav>
                        <div className="w-24 md:block hidden"></div> 
                    </div>
                </div>
            </header> 
            */}
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm"><b>{formatDate()}       {formatTime()}</b></span>
                {user ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{getUserInitial()}</span>
                            </div>
                            <span className="text-gray-700 font-medium">{getUserName()}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Logout"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </>
                ) : (
                    <span className="text-gray-600">Not logged in</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;