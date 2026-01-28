import React, { useEffect, useState } from "react";
import { useRef } from "react";
import useCollegeStore from "../../stores/useCollegeStore.js";
import useUserStore from "../../stores/useUserStore.js";
import Swal from "sweetalert2";
import { FaPlus, FaUserShield } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

const Colleges = () => {
  const {
    colleges,
    loading,
    error,
    fetchColleges,
    createCollege,
    updateCollege,
    deleteCollege,
  } = useCollegeStore();
  const { createCollegeAdmin } = useUserStore();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(5);
  const [dropdownId, setDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCollege = () => {
    Swal.fire({
      title: "Add College",
      html: `
          <input id="swal-name" class="swal2-input" placeholder="College Name" required>
          <input id="swal-code" class="swal2-input" placeholder="College Code" required>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value;
        const collegeCode = document.getElementById("swal-code").value;
        if (!name || !collegeCode) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }
        try {
          await createCollege(name, collegeCode);
        } catch (err) {
          Swal.fire("Error", error || "Failed to create college", "error");
        }
      },
    });
  };

  const handleAssignCollegeAdmin = () => {
    Swal.fire({
      title: "Assign College Admin",
      html: `
            <input id="swal-name" class="swal2-input" placeholder="Name" required>
            <input id="swal-email" class="swal2-input" placeholder="Email" type="email" required>
            <input id="swal-contact" class="swal2-input" placeholder="Contact Number" required>
            
            <select id="swal-collegeId" class="swal2-select" required>
        ${colleges.map(c => `<option value="${c._id}">${c.name} (${c.code})</option>`).join('')}
      </select>
            <input id="swal-role" class="swal2-input" value="College Admin" readonly>
            `,
      showCancelButton: true,
      confirmButtonText: "Assign",
      cancelButtonText: "Cancel",
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const contactNumber = document.getElementById("swal-contact").value;
        const collegeId = document.getElementById("swal-collegeId").value;
        if (!name || !email || !contactNumber || !collegeId) {
          Swal.showValidationMessage(
            "All Fields are required"
          );
          return false;
        }
        try {
          await createCollegeAdmin({ name, email, collegeId, contactNumber });
          Swal.fire(
            "Success",
            "College admin assigned successfully!",
            "success"
          );
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "Failed to assign college admin",
            "error"
          );
        }
      },
    });
  };

  const handleUpdateCollege = (id, name, code) => {
    Swal.fire({
      title: "Update College",
      html: `
                <input id="swal-name" class="swal2-input" value="${name}" required>
                <input id="swal-code" class="swal2-input" value="${code}" required>
            `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: async () => {
        const newName = document.getElementById("swal-name").value;
        const newCode = document.getElementById("swal-code").value;
        if (!newName || !newCode) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }
        try {
          await updateCollege(id, { name: newName, code: newCode });
          Swal.fire("Success", "College updated successfully!", "success");
        } catch {
          Swal.fire("Error", error || "Failed to update college", "error");
        }
      },
    });
  };

  const handleDeleteCollege = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteCollege(id);
          Swal.fire("Deleted!", "College has been deleted.", "success");
        } catch {
          Swal.fire("Error", error || "Failed to delete college", "error");
        }
      }
    });
  };

  return (
    <>
      {/* --- Custom SweetAlert2 Styling --- */}
      {/* It's best practice to move this to a global CSS file */}
      <style>{`
          .swal2-popup {
              font-family: 'Inter', sans-serif;
              border-radius: 1rem !important;
              border: 1px solid #e5e7eb;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
          }
          .swal2-title {
              font-size: 1.5rem !important;
              font-weight: 700 !important;
              color: #1e3a8a !important;
          }
          .swal2-html-container {
              font-size: 1rem !important;
          }
          .swal2-input, .swal2-select {
              border-radius: 0.5rem !important;
              border: 1px solid #d1d5db !important;
              font-size: 1rem !important;
          }
          .swal2-input:focus, .swal2-select:focus {
              box-shadow: 0 0 0 2px #3b82f6 !important;
              border-color: #3b82f6 !important;
          }
          .swal2-confirm {
              background-color: #2563eb !important;
              border-radius: 0.5rem !important;
              font-weight: 600 !important;
          }
          .swal2-cancel {
              background-color: #e5e7eb !important;
              border-radius: 0.5rem !important;
              font-weight: 600 !important;
          }
          .swal2-confirm:hover, .swal2-cancel:hover {
              opacity: 0.9;
          }
        `}</style>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-blue-900">
              College Management
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Add colleges and assign administrators in two simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800">
                  Add a New College
                </h3>
                <p className="text-gray-600 mt-1 mb-4">
                  Create a new college entry in the system.
                </p>
                <button
                  onClick={handleAddCollege}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaPlus />
                  <span>Add College</span>
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800">
                  Assign an Administrator
                </h3>
                <p className="text-gray-600 mt-1 mb-4">
                  Select a college and assign a new admin.
                </p>
                <button
                  onClick={handleAssignCollegeAdmin}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaUserShield />
                  <span>Assign Admin</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Existing Colleges
              </h2>
              <p className="text-gray-600 mt-1">
                A list of all colleges currently in the system.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      College Name
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell text-center">
                      College Code
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : colleges.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No colleges found.
                      </td>
                    </tr>
                  ) : (
                    colleges.map((college, index) => (
                      <tr key={college._id}>
                        <td className="p-4 text-gray-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="p-4 text-gray-800 font-semibold">
                          {college.name}
                        </td>
                        <td className="p-4 text-gray-600 hidden sm:table-cell text-center">
                          {college.code}
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className="relative inline-block"
                            ref={
                              dropdownId === college._id ? dropdownRef : null
                            }
                          >
                            <button
                              onClick={() =>
                                setDropdownId(
                                  dropdownId === college._id
                                    ? null
                                    : college._id
                                )
                              }
                              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                              <FiMoreVertical size={20} />
                            </button>
                            {dropdownId === college._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleUpdateCollege(
                                      college._id,
                                      college.name,
                                      college.code
                                    );
                                    setDropdownId(null);
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteCollege(college._id);
                                    setDropdownId(null);
                                  }}
                                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </a>
                              </div>
                            )}
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

export default Colleges;
