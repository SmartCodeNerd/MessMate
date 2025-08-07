// src/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login from "../pages/Login.jsx";
// import Home from './pages/Home';
// import StudentDashBoard from './pages/StudentDashBoard';
// import MessAdminDashBoard from './pages/MessAdminDashBoard';
// import CollegeAdminDashBoard from './pages/CollegeAdminDashBoard';
// import SuperAdminDashBoard from './pages/SuperAdminDashBoard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />, // default route
  }
//   {
//     path: '/home',
//     element: <Home />,
//   },
//   {
//     path: '/student-dashboard',
//     element: <StudentDashBoard />,
//   },
//   {
//     path: '/mess-admin-dashboard',
//     element: <MessAdminDashBoard />,
//   },
//   {
//     path: '/college-admin-dashboard',
//     element: <CollegeAdminDashBoard />,
//   },
//   {
//     path: '/super-admin-dashboard',
//     element: <SuperAdminDashBoard />,
//   },
]);

export default router;
