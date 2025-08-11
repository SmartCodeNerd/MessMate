import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useCouponStore from '../../stores/useCouponStore.js';
import useAuthStore from '../../stores/useAuthStore.js';

const CouponHistory = () => {
  const { token } = useAuthStore();
  const { fetchMyCoupons, myCoupons, loading: couponLoading, error: couponError } = useCouponStore();
  const [expandedCoupon, setExpandedCoupon] = useState(null);

  useEffect(() => {
    if (token) {
      fetchMyCoupons(token);
    }
  }, [token, fetchMyCoupons]);

  useEffect(() => {
    if (couponError) {
      Swal.fire('Error!', couponError, 'error');
    }
  }, [couponError]);

  // Debug: Log myCoupons to inspect data
  console.log('myCoupons:', myCoupons);

  const toggleCouponDetails = (couponId) => {
    setExpandedCoupon(expandedCoupon === couponId ? null : couponId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getMealCounts = (meals) => {
    const counts = { Breakfast: 0, Lunch: 0, Dinner: 0 };
    meals.forEach((day) => {
      if (day.breakfast?.selected !== 'NOT_BOUGHT') counts.Breakfast++;
      if (day.lunch?.selected !== 'NOT_BOUGHT') counts.Lunch++;
      if (day.dinner?.selected !== 'NOT_BOUGHT') counts.Dinner++;
    });
    console.log('Meal Counts:', counts); // Debug: Log meal counts
    return counts;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-steel-blue mb-2">Coupon Purchase History</h2>
      <p className="text-lg text-gray-600 mb-6">View your past coupon purchases</p>
      {couponLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      {!couponLoading && myCoupons.length === 0 && (
        <p className="text-lg font-semibold text-steel-blue text-center">
          No coupon purchases found.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCoupons.map((coupon) => {
          const mealCounts = getMealCounts(coupon.meals || []);
          return (
            <div
              key={coupon._id}
              className="bg-white shadow-md rounded-lg p-4 border border-powder-blue"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-steel-blue">
                  Week: {formatDate(coupon.weekStartDate)} - {formatDate(coupon.weekEndDate)}
                </h3>
                <p className="text-gray-600 text-sm">
                  Total Amount: ₹{coupon.totalAmount || 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">
                  Payment Status: {coupon.paymentStatus ? coupon.paymentStatus.charAt(0).toUpperCase() + coupon.paymentStatus.slice(1) : 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">
                  Payment ID: {coupon.paymentId?.razorpayPaymentId || 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">
                  Razorpay Order ID: {coupon.paymentId?.razorpayOrderId || 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">
                  Purchased On: {formatDate(coupon.createdAt)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-black bg-steel-blue rounded-full">
                    Breakfast: {mealCounts.Breakfast}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-black bg-steel-blue rounded-full">
                    Lunch: {mealCounts.Lunch}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-black bg-steel-blue rounded-full">
                    Dinner: {mealCounts.Dinner}
                  </span>
                </div>
                <button
                  className="mt-2 px-4 py-1 bg-steel-blue text-white rounded-lg bg-blue-600 transition-all duration-200"
                  onClick={() => toggleCouponDetails(coupon._id)}
                >
                  {expandedCoupon === coupon._id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {expandedCoupon === coupon._id && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-steel-blue mb-2">Meal Details</h4>
                  <div className="space-y-2">
                    {(coupon.meals || [])
                      .filter((day) =>
                        ['breakfast', 'lunch', 'dinner'].some(
                          (meal) => day[meal]?.selected && day[meal].selected !== 'NOT_BOUGHT'
                        )
                      )
                      .map((day) => {
                        console.log('Filtered Day:', day); // Debug: Log filtered days
                        return (
                          <div key={day.date} className="border-t border-gray-200 pt-2">
                            <p className="text-sm font-medium text-gray-800">
                              {formatDate(day.date)}
                            </p>
                            {['breakfast', 'lunch', 'dinner']
                              .filter((meal) => day[meal]?.selected && day[meal].selected !== 'NOT_BOUGHT')
                              .map((meal) => (
                                <p key={meal} className="text-sm text-gray-600">
                                  {meal.charAt(0).toUpperCase() + meal.slice(1)}: {day[meal].selected} ({day[meal].status})
                                  {day[meal].validatedAt && `, Validated: ${formatDate(day[meal].validatedAt)}`}
                                </p>
                              ))}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponHistory;