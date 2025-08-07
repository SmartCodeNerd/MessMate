import axios from 'axios';

const getBaseUrl = () => {
  return import.meta.env.VITE_BASE_URL;
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(), // your backend base URL
  withCredentials: true,
});

export default axiosInstance;