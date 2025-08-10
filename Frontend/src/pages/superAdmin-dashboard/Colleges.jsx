import React, { useEffect, useState } from 'react';
import useCollegeStore from '../../stores/useCollegeStore.js';
import useUserStore from '../../stores/useUserStore.js';
import Swal from 'sweetalert2';

const Colleges = () => {
  const { colleges, loading, error, fetchColleges, createCollege, updateCollege, deleteCollege } = useCollegeStore();
  const { createCollegeAdmin } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [dropdownId, setDropdownId] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleAddCollege = () => {
    Swal.fire({
      title: 'Add College',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="College Name" required>
        <input id="swal-code" class="swal2-input" placeholder="College Code" required>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-white bg-opacity-90',
        container: 'bg-blur',
      },
      preConfirm: async () => {
        const name = document.getElementById('swal-name').value;
        const collegeCode = document.getElementById('swal-code').value;
        if (!name || !collegeCode) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        try {
          await createCollege(name, collegeCode);
          Swal.fire('Success', 'College created successfully!', 'success');
        } catch {
          Swal.fire('Error', error || 'Failed to create college', 'error');
        }
      },
    });
  };

  const handleAssignCollegeAdmin = (collegeName,collegeId) => {
    Swal.fire({
      title: 'Assign College Admin',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" required>
        <input id="swal-email" class="swal2-input" placeholder="Email" type="email" required>
        <input id="swal-contact" class="swal2-input" placeholder="Contact Number" required>
        <input id="swal-collegeId" class="swal2-input" value="${collegeName}" readonly>
        <input id="swal-role" class="swal2-input" value="College Admin" readonly>
      `,
      showCancelButton: true,
      confirmButtonText: 'Assign',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-white bg-opacity-90',
        container: 'bg-blur',
      },
      preConfirm: async () => {
        const name = document.getElementById('swal-name').value;
        const email = document.getElementById('swal-email').value;
        //const collegeId = document.getElementById('swal-collegeId').value;
        const contactNumber = document.getElementById('swal-contact').value;
        if (!name || !email || !contactNumber) {
          Swal.showValidationMessage('Name, email, and contact number are required');
          return false;
        }
        try {
          await createCollegeAdmin({ name, email, collegeId, contactNumber });
          Swal.fire('Success', 'College admin assigned successfully!', 'success');
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to assign college admin', 'error');
        }
      },
    });
  };

  const handleUpdateCollege = (id, name, code) => {
    Swal.fire({
      title: 'Update College',
      html: `
        <input id="swal-name" class="swal2-input" value="${name}" required>
        <input id="swal-code" class="swal2-input" value="${code}" required>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-white bg-opacity-90',
        container: 'bg-blur',
      },
      preConfirm: async () => {
        const name = document.getElementById('swal-name').value;
        const code = document.getElementById('swal-code').value;
        if (!name || !code) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        try {
          await updateCollege(id, { name, code });
          Swal.fire('Success', 'College updated successfully!', 'success');
        } catch {
          Swal.fire('Error', error || 'Failed to update college', 'error');
        }
      },
    });
  };

  const handleDeleteCollege = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      customClass: {
        container: 'bg-blur',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteCollege(id);
          Swal.fire('Deleted!', 'College has been deleted.', 'success');
        } catch {
          Swal.fire('Error', error || 'Failed to delete college', 'error');
        }
      }
    });
  };

  const handleViewCollege = (college) => {
    Swal.fire({
      title: 'College Details',
      html: `
        <div class="text-left p-4">
          <p><strong>Name:</strong> ${college.name || 'N/A'}</p>
          <p><strong>Code:</strong> ${college.code || 'N/A'}</p>
          <p><strong>ID:</strong> ${college._id || 'N/A'}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'bg-white bg-opacity-90',
        container: 'bg-blur',
      },
    });
  };

  const toggleDropdown = (id) => {
    setDropdownId(dropdownId === id ? null : id);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentColleges = colleges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-screen flex flex-col justify-start items-center bg-gray-100 text-gray-800 font-sans text-center p-5">
      <button
        className="mb-8 px-5 py-2.5 text-lg bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        onClick={handleAddCollege}
      >
        Add College
      </button>
      <div className="w-full max-w-3xl bg-white p-5 rounded shadow-md">
        <h2 className="text-4xl mb-4">Existing Colleges</h2>
        {loading ? (
          <p className="text-lg text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-lg text-gray-500">{error}</p>
        ) : colleges.length === 0 ? (
          <p className="text-lg text-gray-500">No colleges available.</p>
        ) : (
          <>
            <ul className="list-none p-0">
              {currentColleges.map((college) => (
                <li key={college._id} className="mb-2.5 text-lg flex items-center justify-between">
                  <span>{college.name} (Code: {college.code})</span>
                  <div className="relative">
                    <button
                      className="px-2.5 py-1.5 text-xl bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                      onClick={() => toggleDropdown(college._id)}
                    >
                      ⋮
                    </button>
                    {dropdownId === college._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            handleAssignCollegeAdmin(college.name,college._id);
                            toggleDropdown(null);
                          }}
                        >
                          Assign College Admin
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            handleViewCollege(college);
                            toggleDropdown(null);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            handleUpdateCollege(college._id, college.name, college.code);
                            toggleDropdown(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            handleDeleteCollege(college._id);
                            toggleDropdown(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-center gap-2.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none ${
                    currentPage === number ? 'bg-green-700' : ''
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Colleges;