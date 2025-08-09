import axios from "./axiosInstance.js" // adjust path based on your project structure

// Buy coupon
export const buyCoupon = async (couponData, token) => {
  const res = await axios.post("/coupon/buy-coupon", couponData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get logged-in user's coupons
export const getMyCoupons = async (token) => {
  const res = await axios.get("/coupon/get-my-coupon", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get all coupons (for admins)
export const getAllCoupons = async (token) => {
  const res = await axios.get("/coupon/get-all-coupons", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Validate coupon for a meal
export const validateCoupon = async (meal, token) => {
  const res = await axios.post("/coupon/validate-coupon", { meal }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
