import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/useUserStore';

const MessAdminStudents = () => {
  const [currPage, setCurrPage] = useState('list');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, error, getAllStudents } = useUserStore();

  useEffect(() => {
    if (currPage === 'list') {
      getAllStudents();
    }
  }, [currPage]);

  const handleView = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrPage('view');
  };

  const handleBack = () => {
    setSelectedStudentId(null);
    setCurrPage('list');
  };

  const filteredStudents = users.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const student = users.find((s) => s._id === selectedStudentId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {currPage === 'list' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Students List</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleView(student._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        disabled={loading}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && !loading && (
              <p className="text-center mt-4">No students found.</p>
            )}
            {loading && <p className="text-center mt-4">Loading...</p>}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        </>
      )}

      {currPage === 'view' && (
        <div className="p-4 border rounded">
          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {!loading && !error && !student && (
            <p className="text-center mt-4">Student not found.</p>
          )}
          {student && (
            <>
              <h2 className="text-xl font-semibold mb-4">{student.name}</h2>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Contact Number:</strong> {student.contactNumber || 'N/A'}</p>
              <button
                onClick={handleBack}
                className="mt-4 text-blue-500 hover:underline"
              >
                Back
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessAdminStudents;