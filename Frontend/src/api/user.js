import axios from './axiosInstance';

const createSuperAdmin = ({ name, email, password, contactNumber }) => {
  return axios.post('/create-superAdmin', { name, email, password, contactNumber });
};

const createCollegeAdmin = ({ name, email, collegeId, contactNumber }) => {
  return axios.post('/create-collegeAdmin', { name, email, collegeId, contactNumber });
};

const createMessAdmin = ({ name, email, contactNumber }) => {
  return axios.post('/create-messAdmin', { name, email, contactNumber });
};

const createStudent = ({ name, email, studentId, contactNumber }) => {
  return axios.post('/create-student', { name, email, studentId, contactNumber });
};

const updateUserDocuments = (userId, formData) => {
  return axios.patch('/update-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const updateSuperAdmin = (id, data) => {
  return axios.patch(`/update-superAdmin/${id}`, data);
};

const updateCollegeAdmin = (id, data) => {
  return axios.patch(`/update-collegeAdmin/${id}`, data);
};

const updateMessAdmin = (id, data) => {
  return axios.patch(`/update-messAdmin/${id}`, data);
};

const updateStudent = (id, data) => {
  return axios.patch(`/update-student/${id}`, data);
};

const deleteSuperAdmin = (id) => {
  return axios.delete(`/delete-superAdmin/${id}`);
};

const deleteCollegeAdmin = (id) => {
  return axios.delete(`/delete-collegeAdmin/${id}`);
};

const deleteMessAdmin = (id) => {
  return axios.delete(`/delete-messAdmin/${id}`);
};

const deleteStudent = (id) => {
  return axios.delete(`/delete-student/${id}`);
};

const getAllStudents = () => {
  return axios.get('/get-all-students');
};

export {
  createSuperAdmin,
  createCollegeAdmin,
  createMessAdmin,
  createStudent,
  updateUserDocuments,
  updateSuperAdmin,
  updateCollegeAdmin,
  updateMessAdmin,
  updateStudent,
  deleteSuperAdmin,
  deleteCollegeAdmin,
  deleteMessAdmin,
  deleteStudent,
  getAllStudents,
};