import axios from './axiosInstance.js'; // Adjust path based on your project structure

export const listCouponForTrade = async (tradeData, token) => {
  const res = await axios.post('/couponTrade/create-trade', tradeData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAvailableCouponsForTrade = async (token) => {
  const res = await axios.get('/couponTrade/get-trades', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const buyCouponFromTrade = async (tradeId,paymentId,token) => {
  const res = await axios.post('/couponTrade/buy-trade', { tradeId,paymentId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyCouponListings = async (token) => {
  const res = await axios.get('/couponTrade/get-my-trades', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyCouponPurchases = async (token) => {
  const res = await axios.get('/couponTrade/get-my-purchases', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const cancelCouponListing = async (tradeId, token) => {
  const res = await axios.patch(`/couponTrade/cancel-trade/${tradeId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllCouponTrades = async (token) => {
  const res = await axios.get('/couponTrade/get-all-trade', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
