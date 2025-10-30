import React, { useState, useEffect } from "react";
import useUserStore from "../../stores/useUserStore";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FaPlus, FaRegEye, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";

const StudentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    contactNumber: "",
  });
  const [editId, setEditId] = useState(null);
  const {
    students,
    loading,
    error,
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useUserStore();

  useEffect(() => {
    if (!showForm) {
      getAllStudents();
    }
  }, [showForm]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editId) {
  //       await updateStudent(editId, formData);
  //       Swal.fire('Success', 'Student updated successfully', 'success');
  //     } else {
  //       await createStudent(formData);
  //       Swal.fire('Success', 'Student created successfully', 'success');
  //     }
  //     setFormData({ name: '', email: '', studentId: '', contactNumber: '' });
  //     setEditId(null);
  //     setShowForm(false);
  //   } catch (err) {
  //     Swal.fire('Error', error || 'Operation failed', 'error');
  //   }
  // };

  const handleAdd = () => {
    Swal.fire({
      title: "Add New Student",
      html: `
                <input id="swal-name" class="swal2-input" placeholder="Name" required>
                <input id="swal-email" class="swal2-input" placeholder="Email" type="email" required>
                <input id="swal-studentId" class="swal2-input" placeholder="Student ID" required>
                <input id="swal-contact" class="swal2-input" placeholder="Contact Number" required>
            `,
      showCancelButton: true,
      confirmButtonText: "Create Student",
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const studentId = document.getElementById("swal-studentId").value;
        const contactNumber = document.getElementById("swal-contact").value;
        if (!name || !email || !studentId) {
          Swal.showValidationMessage(
            "Name, email, and Student ID are required"
          );
          return false;
        }
        try {
          await createStudent({ name, email, studentId, contactNumber });
          Swal.fire("Success", "Student created successfully", "success");
        } catch (err) {
          Swal.fire("Error", error || "Operation failed", "error");
        }
      },
    });
  };

  const handleEdit = (student) => {
    Swal.fire({
      title: "Edit Student",
      html: `
                <input id="swal-name" class="swal2-input" value="${student.name}" required>
                <input id="swal-email" class="swal2-input" value="${student.email}" type="email" required>
                <input id="swal-studentId" class="swal2-input" value="${student.studentId}" required>
                <input id="swal-contact" class="swal2-input" value="${student.contactNumber}" required>
            `,
      showCancelButton: true,
      confirmButtonText: "Update Student",
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const studentId = document.getElementById("swal-studentId").value;
        const contactNumber = document.getElementById("swal-contact").value;
        if (!name || !email || !studentId) {
          Swal.showValidationMessage(
            "Name, email, and Student ID are required"
          );
          return false;
        }
        try {
          await updateStudent(student._id, {
            name,
            email,
            studentId,
            contactNumber,
          });
          Swal.fire("Success", "Student updated successfully", "success");
        } catch (err) {
          Swal.fire("Error", error || "Operation failed", "error");
        }
      },
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the student.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStudent(id);
          Swal.fire("Deleted!", "The student has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error", error || "Delete failed", "error");
        }
      }
    });
  };

  const handleView = (student) => {
    Swal.fire({
      title: "Student Details",
      html: `
                <div class="text-left p-4 space-y-2">
                    <p><strong>Name:</strong> ${student.name || "N/A"}</p>
                    <p><strong>Email:</strong> ${student.email || "N/A"}</p>
                    <p><strong>Student ID:</strong> ${
                      student.studentId || "N/A"
                    }</p>
                    <p><strong>Contact:</strong> ${
                      student.contactNumber || "N/A"
                    }</p>
                </div>
            `,
      confirmButtonText: "Close",
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Assuming your Excel has columns: 'name', 'email', 'studentId', 'contactNumber'
        // You would now call your store function to handle the bulk create
        // createStudentsFromExcel(json);
        console.log(json);

        Swal.fire({
          title: "File Uploaded!",
          text: `${json.length} student records found in the file. Do you want to process them?`,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes, process!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Here you would trigger the actual API call
            createStudentsFromExcel(json);
            Swal.fire(
              "Processing!",
              "Student data is being processed.",
              "success"
            );
          }
        });
      };
      reader.readAsArrayBuffer(file);
    }
    // Reset the file input so the same file can be re-uploaded
    event.target.value = null;
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
              <h1 className="text-3xl font-extrabold text-blue-900">
                Student Management
              </h1>
              <p className="mt-1 text-base text-gray-600">
                Add, view, and manage student records.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaPlus />
                <span>Add Student</span>
              </button>
              <label className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                <FaFileExcel />
                <span>Bulk Add via Excel</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                      Student ID
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
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
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id}>
                        <td className="p-4 font-semibold text-gray-800">
                          {student.name}
                        </td>
                        <td className="p-4 text-gray-600 hidden md:table-cell">
                          {student.email}
                        </td>
                        <td className="p-4 text-gray-600 hidden lg:table-cell">
                          {student.studentId}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <button
                              onClick={() => handleView(student)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="View"
                            >
                              <FaRegEye />
                            </button>
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
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

export default StudentManagement;
