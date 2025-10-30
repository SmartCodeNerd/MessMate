import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axiosInstance';
import {
  createSuperAdmin,
  createCollegeAdmin,
  createMessAdmin,
  createStudent,
  updateUserDocuments,
  updateSuperAdmin,
  updateCollegeAdmin,
  updateMessAdmin,
  updateStudent,
  deleteSuperAdmin,
  deleteCollegeAdmin,
  deleteMessAdmin,
  deleteStudent,
  getAllStudents,
  getAllMembers,
} from '../api/user';

const useUserStore = create(
  persist(
    (set, get) => ({
      users: [],
      students: [],
      loading: false,
      error: null,

      createSuperAdmin: async ({ name, email, password, contactNumber }) => {
        set({ loading: true, error: null });
        try {
          const res = await createSuperAdmin({ name, email, password, contactNumber });
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to create super admin', loading: false });
          throw err;
        }
      },

      createCollegeAdmin: async ({ name, email, collegeId, contactNumber }) => {
        set({ loading: true, error: null });
        try {
          const res = await createCollegeAdmin({ name, email, collegeId, contactNumber });
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to create college admin', loading: false });
          throw err;
        }
      },

      createMessAdmin: async ({ name, email, contactNumber }) => {
        set({ loading: true, error: null });
        try {
          const res = await createMessAdmin({ name, email, contactNumber });
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to create mess admin', loading: false });
          throw err;
        }
      },

      createStudent: async ({ name, email, studentId, contactNumber }) => {
        set({ loading: true, error: null });
        try {
          const res = await createStudent({ name, email, studentId, contactNumber });
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to create student', loading: false });
          throw err;
        }
      },

      updateUserDocuments: async (userId, formData) => {
        set({ loading: true, error: null });
        try {
          const res = await updateUserDocuments(userId, formData);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to update documents', loading: false });
          throw err;
        }
      },

      updateSuperAdmin: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateSuperAdmin(id, data);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to update super admin', loading: false });
          throw err;
        }
      },

      updateCollegeAdmin: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateCollegeAdmin(id, data);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to update college admin', loading: false });
          throw err;
        }
      },

      updateMessAdmin: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateMessAdmin(id, data);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to update mess admin', loading: false });
          throw err;
        }
      },

      updateStudent: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateStudent(id, data);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to update student', loading: false });
          throw err;
        }
      },

      deleteSuperAdmin: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await deleteSuperAdmin(id);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to delete super admin', loading: false });
          throw err;
        }
      },

      deleteCollegeAdmin: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await deleteCollegeAdmin(id);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to delete college admin', loading: false });
          throw err;
        }
      },

      deleteMessAdmin: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await deleteMessAdmin(id);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to delete mess admin', loading: false });
          throw err;
        }
      },

      deleteStudent: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await deleteStudent(id);
          set({ loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to delete student', loading: false });
          throw err;
        }
      },

      getAllStudents: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getAllStudents();
          set({ students: res.data.data, loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch students', loading: false });
          throw err;
        }
      },

      getAllMembers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getAllMembers();
          set({ users: res.data.data, loading: false });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch Members', loading: false });
          throw err;
        }
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }
  )
);

export default useUserStore;