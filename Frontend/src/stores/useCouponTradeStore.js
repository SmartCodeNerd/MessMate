import { create } from 'zustand';
import {
  listCouponForTrade,
  getAvailableCouponsForTrade,
  buyCouponFromTrade,
  getMyCouponListings,
  getMyCouponPurchases,
  cancelCouponListing,
  getAllCouponTrades,
} from '../api/couponTrade.js';

const useCouponTradeStore = create((set, get) => ({
  myListings: [],
  myPurchases: [],
  availableTrades: [],
  allTrades: [],
  loading: false,
  error: null,
  successMessage: null,

  listCouponForTrade: async (tradeData, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await listCouponForTrade(tradeData, token);
      set({ successMessage: res.message, loading: false });
      get().fetchMyCouponListings(token); // Refresh listings
      return res;
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to list coupon for trade', loading: false });
      throw error;
    }
  },

  fetchAvailableCouponsForTrade: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getAvailableCouponsForTrade(token);
      set({ availableTrades: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to fetch available trades', loading: false });
    }
  },

  buyCouponFromTrade: async (tradeId, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await buyCouponFromTrade(tradeId, token);
      set({ successMessage: res.message, loading: false });
      get().fetchMyCouponPurchases(token); // Refresh purchases
      get().fetchAvailableCouponsForTrade(token); // Refresh available trades
      return res;
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to buy coupon', loading: false });
      throw error;
    }
  },

  fetchMyCouponListings: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getMyCouponListings(token);
      set({ myListings: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to fetch my listings', loading: false });
    }
  },

  fetchMyCouponPurchases: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getMyCouponPurchases(token);
      set({ myPurchases: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to fetch my purchases', loading: false });
    }
  },

  cancelCouponListing: async (tradeId, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await cancelCouponListing(tradeId, token);
      set({ successMessage: res.message, loading: false });
      get().fetchMyCouponListings(token); // Refresh listings
      return res;
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to cancel listing', loading: false });
      throw error;
    }
  },

  fetchAllCouponTrades: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllCouponTrades(token);
      set({ allTrades: res.data, loading: false });
    } catch (error) {
      set({ error: error?.response?.data?.message || 'Failed to fetch all trades', loading: false });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useCouponTradeStore;