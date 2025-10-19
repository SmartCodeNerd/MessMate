import React, { useState, useEffect } from "react";
import useUserStore from "../../stores/useUserStore";
import Swal from "sweetalert2";
import { FaPlus, FaRegEye, FaEdit, FaTrash } from 'react-icons/fa';

const MessAdminManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
  });
  const [editId, setEditId] = useState(null);
  const {
    users,
    loading,
    error,
    getAllMembers,
    createMessAdmin,
    updateMessAdmin,
    deleteMessAdmin,
  } = useUserStore();

  useEffect(() => {
    if (!showForm) {
      getAllMembers(); // Fetch all users; filter for Mess Admins
    }
  }, [showForm]);

  const messAdmins = users.filter((user) => user.role === "Mess Admin");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editId) {
  //       await updateMessAdmin(editId, formData);
  //       Swal.fire("Success", "Mess Admin updated successfully", "success");
  //     } else {
  //       await createMessAdmin(formData);
  //       Swal.fire("Success", "Mess Admin created successfully", "success");
  //     }
  //     setFormData({ name: "", email: "", contactNumber: "" });
  //     setEditId(null);
  //     setShowForm(false);
  //   } catch (err) {
  //     Swal.fire("Error", error || "Operation failed", "error");
  //   }
  // };

  const handleAdd = () => {
        Swal.fire({
            title: 'Add New Mess Admin',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Name" required>
                <input id="swal-email" class="swal2-input" placeholder="Email" type="email" required>
                <input id="swal-contact" class="swal2-input" placeholder="Contact Number" required>
            `,
            showCancelButton: true,
            confirmButtonText: 'Create Admin',
            preConfirm: async () => {
                const name = document.getElementById('swal-name').value;
                const email = document.getElementById('swal-email').value;
                const contactNumber = document.getElementById('swal-contact').value;
                if (!name || !email || !contactNumber) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }
                try {
                    await createMessAdmin({ name, email, contactNumber });
                    Swal.fire('Success', 'Mess Admin created successfully', 'success');
                } catch (err) {
                    Swal.fire('Error', error || 'Operation failed', 'error');
                }
            }
        });
    };

  const handleEdit = (messAdmin) => {
    Swal.fire({
      title: "Edit Mess Admin",
      html: `
            <input id="swal-name" class="swal2-input" value="${messAdmin.name}" required>
            <input id="swal-email" class="swal2-input" value="${messAdmin.email}" type="email" required>
            <input id="swal-contact" class="swal2-input" value="${messAdmin.contactNumber}" required>
            `,
      showCancelButton: true,
      confirmButtonText: "Update Admin",
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const contactNumber = document.getElementById("swal-contact").value;
        if (!name || !email || !contactNumber) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }
        try {
          await updateMessAdmin(messAdmin._id, { name, email, contactNumber });
          Swal.fire("Success", "Mess Admin updated successfully", "success");
        } catch (err) {
          Swal.fire("Error", error || "Operation failed", "error");
        }
      },
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the Mess Admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMessAdmin(id);
          Swal.fire("Deleted!", "The Mess Admin has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error", error || "Delete failed", "error");
        }
      }
    });
  };

  const handleView = (messAdmin) => {
    Swal.fire({
      title: "Mess Admin Details",
      html: `
        <div class="text-left p-4">
          <p><strong>Name:</strong> ${messAdmin.name || "N/A"}</p>
          <p><strong>Email:</strong> ${messAdmin.email || "N/A"}</p>
          <p><strong>Contact Number:</strong> ${
            messAdmin.contactNumber || "N/A"
          }</p>
          <p><strong>ID:</strong> ${messAdmin._id || "N/A"}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  return (
    <>
            {/* Custom SweetAlert2 Styling */}
            <style>{`
                .swal2-popup { font-family: 'Inter', sans-serif; border-radius: 1rem !important; border: 1px solid #e5e7eb; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important; }
                .swal2-title { font-size: 1.5rem !important; font-weight: 700 !important; color: #1e3a8a !important; }
                .swal2-html-container { font-size: 1rem !important; }
                .swal2-input, .swal2-select { width: 80% !important; margin-left: auto; margin-right: auto; border-radius: 0.5rem !important; border: 1px solid #d1d5db !important; font-size: 1rem !important; }
                .swal2-input:focus, .swal2-select:focus { box-shadow: 0 0 0 2px #3b82f6 !important; border-color: #3b82f6 !important; }
                .swal2-confirm { background-color: #2563eb !important; border-radius: 0.5rem !important; font-weight: 600 !important; }
                .swal2-cancel { background-color: #e5e7eb !important; border-radius: 0.5rem !important; font-weight: 600 !important; }
                .swal2-confirm:hover, .swal2-cancel:hover { opacity: 0.9; }
            `}</style>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <main className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-blue-900">Mess Admin Management</h1>
                            <p className="mt-1 text-base text-gray-600">Add, view, and manage mess administrators.</p>
                        </div>
                        <button onClick={handleAdd} className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center space-x-2 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                            <FaPlus />
                            <span>Add Mess Admin</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Email</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
                                    ) : error ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-red-500">{error}</td></tr>
                                    ) : messAdmins.length === 0 ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-500">No Mess Admins found.</td></tr>
                                    ) : (
                                        messAdmins.map((messAdmin) => (
                                            <tr key={messAdmin._id}>
                                                <td className="p-4 font-semibold text-gray-800">{messAdmin.name}</td>
                                                <td className="p-4 text-gray-600 hidden md:table-cell">{messAdmin.email}</td>
                                                <td className="p-4 text-gray-600 hidden lg:table-cell">{messAdmin.contactNumber}</td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <button onClick={() => handleView(messAdmin)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="View"><FaRegEye /></button>
                                                        <button onClick={() => handleEdit(messAdmin)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors" title="Edit"><FaEdit /></button>
                                                        <button onClick={() => handleDelete(messAdmin._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete"><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default MessAdminManagement;
