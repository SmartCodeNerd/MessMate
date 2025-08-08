import { create } from "zustand";
import {
  buyCoupon,
  getMyCoupons,
  getAllCoupons,
  validateCoupon,
} from "../services/coupon"; // adjust path based on your structure

const useCouponStore = create((set, get) => ({
  myCoupons: [],
  allCoupons: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchMyCoupons: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getMyCoupons(token);
      set({ myCoupons: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to fetch", loading: false });
    }
  },

  fetchAllCoupons: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllCoupons(token);
      set({ allCoupons: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to fetch", loading: false });
    }
  },

  purchaseCoupon: async (couponData, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await buyCoupon(couponData, token);
      set({ successMessage: res.message, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Coupon purchase failed", loading: false });
    }
  },

  validateMyCoupon: async (meal, token) => {
    set({ loading: true, error: null });
    try {
      const res = await validateCoupon(meal, token);
      set({ successMessage: res.message, loading: false });
      return res;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Coupon validation failed", loading: false });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useCouponStore;
