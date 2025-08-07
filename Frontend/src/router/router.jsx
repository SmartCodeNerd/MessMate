// src/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import StudentDashBoard from "../pages/StudentDashBoard.jsx"
import MessAdminDashBoard from "../pages/MessAdminDashBoard.jsx";
import CollegeAdminDashBoard from '../pages/CollegeAdminDashBoard.jsx';
import SuperAdminDashBoard from "../pages/SuperAdminDashBoard.jsx";
import ProtectedRoute from './protectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/student-dashboard',
    element: (
      <ProtectedRoute role="Student">
        <StudentDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/messadmin-dashboard',
    element: (
      <ProtectedRoute role="Mess Admin">
        <MessAdminDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/collegeadmin-dashboard',
    element: (
      <ProtectedRoute role="College Admin">
        <CollegeAdminDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/superadmin-dashboard',
    element: (
      <ProtectedRoute role="Super Admin">
        <SuperAdminDashBoard />
      </ProtectedRoute>
    ),
  },
]);

export default router;