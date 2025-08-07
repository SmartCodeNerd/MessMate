import React from 'react';

const Analytics = () => {
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fa',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  };

  const headingStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const subTextStyle = {
    fontSize: '1.2rem',
    color: '#666',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>🚧 Coming Soon!</h1>
      <p style={subTextStyle}>
        The Dashboard feature is under construction. Stay tuned!
      </p>
    </div>
  );
};

export default Analytics;
