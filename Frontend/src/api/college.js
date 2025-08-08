import axios from './axiosInstance';

const createCollege = (name, code) => {
  return axios.post('/college/create-college', { name, code });
};

const getColleges = () => {
  return axios.get('/college/get-colleges');
};

const getCollegeById = (id) => {
  return axios.get(`/college/get-college/${id}`);
};

const updateCollege = (id, updates) => {
  return axios.put(`/college/update-college?id=${id}`, updates);
};

const deleteCollege = (id) => {
  return axios.delete(`/college/delete-college/${id}`);
};

export {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};
