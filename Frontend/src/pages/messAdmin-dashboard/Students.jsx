import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/useUserStore';
import { FaEye } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currPage === 'list' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-blue-900">
                Students List
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                View and manage student records.
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="2" className="p-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="2" className="p-4 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="p-4 text-center text-gray-500">
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <tr key={student._id}>
                          <td className="p-4 text-gray-800 font-semibold">
                            {student.name}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleView(student._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="View"
                              disabled={loading}
                            >
                              <FaEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {currPage === 'view' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Student Details
              </h2>
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Back</span>
              </button>
            </div>
            <div className="p-6">
              {loading && <p className="text-center text-gray-500">Loading...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {!loading && !error && !student && (
                <p className="text-center text-gray-500">Student not found.</p>
              )}
              {student && (
                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Student ID:</span>
                    <span>{student.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Contact Number:</span>
                    <span>{student.contactNumber || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessAdminStudents;