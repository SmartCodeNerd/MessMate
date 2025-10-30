// stores/useAnalyticsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axiosInstance';

const useAnalyticsStore = create(
  (set, get) => ({
    analytics: null,
    loading: false,
    error: null,

    fetchAnalytics: async () => {
      set({ loading: true, error: null });
      try {
        const res = await axios.get('/analytics');
        set({ analytics: res.data.data, loading: false });
      } catch (err) {
        console.error('Analytics fetch error:', err);
        set({
          error: err.response?.data?.message || 'Failed to fetch analytics',
          loading: false,
        });
      }
    },

    clearAnalytics: () => {
      set({ analytics: null, error: null });
    },
  })
);

export default useAnalyticsStore;
