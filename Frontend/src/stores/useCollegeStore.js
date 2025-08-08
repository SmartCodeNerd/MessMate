import { create } from 'zustand';
import {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} from '../api/college';

const useCollegeStore = create((set) => ({
  colleges: [],
  selectedCollege: null,
  loading: false,
  error: null,

  fetchColleges: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getColleges();
      set({ colleges: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch colleges', loading: false });
    }
  },

  fetchCollegeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getCollegeById(id);
      set({ selectedCollege: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch college', loading: false });
    }
  },

  createCollege: async (name, code) => {
    set({ loading: true, error: null });
    try {
      await createCollege(name, code);
      await useCollegeStore.getState().fetchColleges();
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create college', loading: false });
    }
  },

  updateCollege: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await updateCollege(id, updates);
      await useCollegeStore.getState().fetchColleges();
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update college', loading: false });
    }
  },

  deleteCollege: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCollege(id);
      await useCollegeStore.getState().fetchColleges();
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete college', loading: false });
    }
  },
}));

export default useCollegeStore;
