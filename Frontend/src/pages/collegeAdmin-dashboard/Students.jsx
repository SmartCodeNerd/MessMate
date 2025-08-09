import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/useUserStore';
import { toast } from 'react-toastify';

const Students = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', studentId: '', contactNumber: '' });
  const [editId, setEditId] = useState(null);
  const { users, loading, error, getAllStudents, createStudent, updateStudent, deleteStudent } = useUserStore();

  useEffect(() => {
    getAllStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateStudent(editId, formData);
        toast.success('Student updated successfully');
      } else {
        await createStudent(formData);
        toast.success('Student created successfully');
      }
      setFormData({ name: '', email: '', studentId: '', contactNumber: '' });
      setEditId(null);
      setShowForm(false);
      getAllStudents();
    } catch (err) {
      toast.error(error || 'Operation failed');
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      contactNumber: student.contactNumber,
    });
    setEditId(student._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      toast.success('Student deleted successfully');
      getAllStudents();
    } catch (err) {
      toast.error(error || 'Delete failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
          setFormData({ name: '', email: '', studentId: '', contactNumber: '' });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? 'Cancel' : 'Add Student'}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Student' : 'Add New Student'}</h2>
          <div onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : editId ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Student ID</th>
              <th className="border p-2">Contact Number</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((student) => (
              <tr key={student._id}>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.studentId}</td>
                <td className="border p-2">{student.contactNumber}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <p className="text-center mt-4">No students found.</p>
        )}
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Students;