import axiosInstance from './axiosInstance';

const loginUser = (email, password) => {
  return axiosInstance.post('/api/auth/login', { email, password });
};

const logoutUser = () => {
  return axiosInstance.post('/api/auth/logout');
};

const changePassword = () => {
  return axiosInstance.put('/api/auth/change-password');
}

export {
  loginUser,
  logoutUser,
  changePassword
};