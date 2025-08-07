// src/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import StudentDashBoard from "../pages/StudentDashBoard.jsx"
import MessAdminDashBoard from "../pages/MessAdminDashBoard.jsx";
import CollegeAdminDashBoard from '../pages/CollegeAdminDashBoard.jsx';
import SuperAdminDashBoard from "../pages/SuperAdminDashBoard.jsx";

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
    element: <StudentDashBoard />,
  },
  {
    path: '/messadmin-dashboard',
    element: <MessAdminDashBoard />,
  },
  {
    path: '/collegeadmin-dashboard',
    element: <CollegeAdminDashBoard />,
  },
  {
    path: '/superadmin-dashboard',
    element: <SuperAdminDashBoard />,
  },
]);

export default router;
