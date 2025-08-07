import { create } from 'zustand';
import { loginUser, logoutUser, changePassword } from '../api/auth'; // Placeholder for API functions

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await loginUser(email, password); // Placeholder API call
      set({ user: res.data.user, token: res.data.token, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
    }
  },

logout: async () => {
  set({ loading: true, error: null });
  try {
    await logoutUser(); // API call to backend (optional but good practice)
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    set({ user: null, token: null, loading: false, error: null });
  }
},


  changePassword: async ({ oldPassword, newPassword }) => {
    set({ loading: true, error: null });
    try {
      await changePassword({ oldPassword, newPassword }); // Placeholder API call
      set({ loading: false });
      return { success: true, message: 'Password changed successfully' };
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to change password',
        loading: false,
      });
      throw err;
    }
  },
}));

export default useAuthStore;