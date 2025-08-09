import axios from './axiosInstance';

const createSuperAdmin = ({ name, email, password, contactNumber }) => {
  return axios.post('/users/create-superAdmin', { name, email, password, contactNumber });
};

const createCollegeAdmin = ({ name, email, collegeId, contactNumber }) => {
  return axios.post('/users/create-collegeAdmin', { name, email, collegeId, contactNumber });
};

const createMessAdmin = ({ name, email, contactNumber }) => {
  return axios.post('/users/create-messAdmin', { name, email, contactNumber });
};

const createStudent = ({ name, email, studentId, contactNumber }) => {
  return axios.post('/users/create-student', { name, email, studentId, contactNumber });
};

const updateUserDocuments = (userId, formData) => {
  return axios.patch('/users/update-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const updateSuperAdmin = (id, data) => {
  return axios.patch(`/users/update-superAdmin/${id}`, data);
};

const updateCollegeAdmin = (id, data) => {
  return axios.patch(`/users/update-collegeAdmin/${id}`, data);
};

const updateMessAdmin = (id, data) => {
  return axios.patch(`/users/update-messAdmin/${id}`, data);
};

const updateStudent = (id, data) => {
  return axios.patch(`/users/update-student/${id}`, data);
};

const deleteSuperAdmin = (id) => {
  return axios.delete(`/users/delete-superAdmin/${id}`);
};

const deleteCollegeAdmin = (id) => {
  return axios.delete(`/users/delete-collegeAdmin/${id}`);
};

const deleteMessAdmin = (id) => {
  return axios.delete(`/users/delete-messAdmin/${id}`);
};

const deleteStudent = (id) => {
  return axios.delete(`/users/delete-student/${id}`);
};

const getAllStudents = () => {
  return axios.get('/users/get-all-students');
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