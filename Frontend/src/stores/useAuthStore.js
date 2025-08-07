// src/stores/useAuthStore.js
import { create } from 'zustand';
import { loginUser, logoutUser } from '../api/auth'; // <-- Import API functions

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await loginUser(email, password); // <-- Use imported function
      set({ user: res.data.user, token: res.data.token, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser(); // <-- Call logout API if needed
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
