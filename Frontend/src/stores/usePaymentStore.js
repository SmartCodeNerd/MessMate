import { create } from 'zustand';
import { createOrder, verifyPayment, getMyPayments } from '../api/payment';

const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  payments: [],
  currentOrder: null,

  // Create a new Razorpay order
  createNewOrder: async (amount, purpose) => {
    set({ loading: true, error: null });
    try {
      const res = await createOrder(amount, purpose);
      set({ currentOrder: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create order',
        loading: false,
      });
      throw err;
    }
  },

  // Verify payment after Razorpay success
  verifyPaymentStatus: async (paymentData) => {
    set({ loading: true, error: null });
    try {
      const res = await verifyPayment(paymentData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Payment verification failed',
        loading: false,
      });
      throw err;
    }
  },

  // Fetch logged-in user's payments
  fetchMyPayments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getMyPayments();
      set({ payments: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch payments',
        loading: false,
      });
    }
  },
}));

export default usePaymentStore;
