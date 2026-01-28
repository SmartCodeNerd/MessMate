import axios from './axiosInstance';

const getAnalytics = () => {
  return axios.get('/analytics');
};

export { getAnalytics };
