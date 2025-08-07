// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from "./router/router.jsx"

const App = () => {
  return (
    <div className="app" style={{ backgroundColor: '#BFD7ED', color: '#2C3E50' }}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
