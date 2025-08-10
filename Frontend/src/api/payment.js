import axios from './axiosInstance';

// Create order
export const createOrder = (amount, purpose) => {
  return axios.post('/payment/create-order', { amount, purpose });
};

// Verify payment
export const verifyPayment = (paymentData) => {
  return axios.post('/payment/verify', paymentData);
};

// Get user's payment history
export const getMyPayments = () => {
  return axios.get('/payment/my-payments');
};
