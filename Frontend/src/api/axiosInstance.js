import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL, // your backend base URL
  withCredentials: true,
});

export default axiosInstance;