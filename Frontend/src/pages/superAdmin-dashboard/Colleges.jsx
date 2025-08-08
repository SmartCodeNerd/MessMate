import React, { useEffect } from 'react';
import useCollegStore from "../../stores/useCollegeStore.js"
import Swal from 'sweetalert2';

const Colleges = () => {
  const { colleges, loading, error, fetchColleges, createCollege } = useCollegStore();

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const collegeCode = e.target.collegeCode.value;

    try {
      await createCollege(name, collegeCode);
      Swal.fire('Success', 'College created successfully!', 'success');
      e.target.reset();
    } catch {
      Swal.fire('Error', error || 'Failed to create college', 'error');
    }
  };

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

  const buttonStyle = {
    marginBottom: '2rem',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const formStyle = {
    marginBottom: '2rem',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    display: 'block',
    width: '300px',
    padding: '8px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const collegesListStyle = {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => {}}>
        Add College
      </button>
      <form style={formStyle} onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          type="text"
          name="name"
          placeholder="College Name"
          required
        />
        <input
          style={inputStyle}
          type="text"
          name="collegeCode"
          placeholder="College Code"
          required
        />
        <button style={buttonStyle} type="submit">
          Submit
        </button>
      </form>
      <div style={collegesListStyle}>
        <h2 style={headingStyle}>Existing Colleges</h2>
        {loading ? (
          <p style={subTextStyle}>Loading...</p>
        ) : error ? (
          <p style={subTextStyle}>{error}</p>
        ) : colleges.length === 0 ? (
          <p style={subTextStyle}>No colleges available.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {colleges.map((college) => (
              <li key={college.id} style={{ margin: '10px 0', fontSize: '1.1rem' }}>
                {college.name} (Code: {college.code})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Colleges;