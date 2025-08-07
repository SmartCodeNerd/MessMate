import axios from './axiosInstance';

export const loginUser = (email, password) => {
  return axios.post('/auth/login', { email, password });
};

export const logoutUser = () => {
  return axios.post('/auth/logout');
};
