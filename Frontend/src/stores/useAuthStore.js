import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser, changePassword } from '../api/auth';
import axios from '../api/axiosInstance';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        // Inside login in the store
        try {
          console.log("Calling login API with:", email, password);
          const res = await loginUser(email, password);
          console.log("Login API response:", res);
          const { user, token } = res.data;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ user, token, loading: false });
        } catch (err) {
          console.error("Login error:", err);
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false,
          });
        }

      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logoutUser();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          // Remove token from axios headers
          delete axios.defaults.headers.common['Authorization'];

          set({ user: null, token: null, loading: false, error: null });
        }
      },

      changePassword: async ({ oldPassword, newPassword }) => {
        set({ loading: true, error: null });
        try {
          await changePassword({ oldPassword, newPassword });
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
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        error: state.error
        // Don't persist loading!
      }),
      onRehydrateStorage: () => (state) => {
        // Set axios header on rehydrate
        const token = state?.token;
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }
  )
);

export default useAuthStore;
