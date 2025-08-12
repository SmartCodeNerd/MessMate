import axios from './axiosInstance';

const loginUser = (email, password) => {
  return axios.post('/auth/login', { email, password });
};

const logoutUser = () => {
  return axios.post('/auth/logout');
};

const changePassword = () => {
  return axios.put('/auth/change-password');
}

export {
  loginUser,
  logoutUser,
  changePassword
};