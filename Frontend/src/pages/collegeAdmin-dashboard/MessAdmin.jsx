import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/useUserStore';
import Swal from 'sweetalert2';

const MessAdminManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', contactNumber: '' });
  const [editId, setEditId] = useState(null);
  const { users, loading, error, getAllMembers, createMessAdmin, updateMessAdmin, deleteMessAdmin } = useUserStore();

  useEffect(() => {
    if (!showForm) {
      getAllMembers(); // Fetch all users; filter for Mess Admins
    }
  }, [showForm]);
  const messAdmins = users.filter(user => user.role === 'Mess Admin');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateMessAdmin(editId, formData);
        Swal.fire('Success', 'Mess Admin updated successfully', 'success');
      } else {
        await createMessAdmin(formData);
        Swal.fire('Success', 'Mess Admin created successfully', 'success');
      }
      setFormData({ name: '', email: '', contactNumber: '' });
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      Swal.fire('Error', error || 'Operation failed', 'error');
    }
  };

  const handleEdit = (messAdmin) => {
    setFormData({
      name: messAdmin.name,
      email: messAdmin.email,
      contactNumber: messAdmin.contactNumber,
    });
    setEditId(messAdmin._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the Mess Admin.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        console.log("Id",id);
        await deleteMessAdmin(id);
        Swal.fire('Success', 'Mess Admin deleted successfully', 'success');
        getAllStudents(); // Refresh user list
      } catch (err) {
        Swal.fire('Error', error || 'Delete failed', 'error');
      }
    }
  };

  const handleView = (messAdmin) => {
    Swal.fire({
      title: 'Mess Admin Details',
      html: `
        <div class="text-left p-4">
          <p><strong>Name:</strong> ${messAdmin.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${messAdmin.email || 'N/A'}</p>
          <p><strong>Contact Number:</strong> ${messAdmin.contactNumber || 'N/A'}</p>
          <p><strong>ID:</strong> ${messAdmin._id || 'N/A'}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'bg-white bg-opacity-90',
        container: 'bg-blur',
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Mess Admin
        </button>
      )}

      {showForm && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Mess Admin' : 'Add New Mess Admin'}</h2>
          <div className="space-y-4">
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
              <label className="block text-sm font-medium">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : editId ? 'Update Mess Admin' : 'Create Mess Admin'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setFormData({ name: '', email: '', contactNumber: '' });
                }}
                className="text-blue-500 hover:underline"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Contact Number</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messAdmins.map((messAdmin) => (
                <tr key={messAdmin._id}>
                  <td className="border p-2">{messAdmin.name}</td>
                  <td className="border p-2">{messAdmin.email}</td>
                  <td className="border p-2">{messAdmin.contactNumber}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(messAdmin)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleView(messAdmin)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(messAdmin._id)}
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
          {messAdmins.length === 0 && !loading && (
            <p className="text-center mt-4">No Mess Admins found.</p>
          )}
          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MessAdminManagement;