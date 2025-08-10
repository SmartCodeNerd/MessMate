import React, { useState, useEffect } from 'react';
import menuOfTheWeek from '../../utils/mockMenu.js';
import Swal from 'sweetalert2';
import useCouponStore from '../../stores/useCouponStore.js';
import useAuthStore from '../../stores/useAuthStore.js';
import usePaymentStore from '../../stores/usePaymentStore.js';

const BuyCoupon = () => {
  const [selectedCoupons, setSelectedCoupons] = useState({});
  const { token, user } = useAuthStore();
  const { purchaseCoupon, fetchMyCoupons, myCoupons, loading: couponLoading, error: couponError, successMessage } = useCouponStore();
  const { createNewOrder, verifyPaymentStatus, loading: paymentLoading, error: paymentError } = usePaymentStore();
  const today = new Date(); // Current date (August 10, 2025, Sunday)
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  const prices = { Breakfast: 25, Lunch: 45, Dinner: 40 };
  const totalPrice = Object.keys(selectedCoupons).reduce((sum, key) => 
    selectedCoupons[key] ? sum + prices[key.split('-')[1]] : sum, 0);

  const getWeekDates = () => {
    console.log("User",user);
    const start = new Date(today);
    start.setDate(today.getDate() + (today.getDay() === 0 ? 1 : 2)); // Monday of next week
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sunday of next week
    return { start, end };
  };

  const { start, end } = getWeekDates();
  const weekStartStr = start.toISOString().split('T')[0];
  const weekEndStr = end.toISOString().split('T')[0];
  const weekDisplay = `${start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  const dates = days.map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (token && isWeekend) {
      fetchMyCoupons(token); // Fetch user's coupons on mount
    }
  }, [token, isWeekend, fetchMyCoupons]);

  const handleCouponClick = (day, meal) => {
    setSelectedCoupons(prev => ({
      ...prev,
      [`${day}-${meal}`]: !prev[`${day}-${meal}`]
    }));
  };

  const handleCheckout = async () => {
    const mealCounts = { Breakfast: [], Lunch: [], Dinner: [] };
    Object.keys(selectedCoupons).forEach(key => {
      if (selectedCoupons[key]) {
        const [day, meal] = key.split('-');
        mealCounts[meal].push(day.slice(0, 3));
      }
    });

    const confirmationText = `
      <div style="text-align: left;">
        <p><strong>Breakfast (${mealCounts.Breakfast.length}):</strong> ${mealCounts.Breakfast.join(', ')}</p>
        <p><strong>Lunch (${mealCounts.Lunch.length}):</strong> ${mealCounts.Lunch.join(', ')}</p>
        <p><strong>Dinner (${mealCounts.Dinner.length}):</strong> ${mealCounts.Dinner.join(', ')}</p>
        <p><strong>Total: ₹${totalPrice}</strong></p>
      </div>
    `;

    const result = await Swal.fire({
      title: 'Confirm Purchase',
      html: confirmationText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'ReCheck',
      confirmButtonColor: '#4682b4',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        // Check if coupon already exists for the week
        const existingCoupon = myCoupons.find(
          coupon => coupon.weekStartDate === weekStartStr && coupon.weekEndDate === weekEndStr
        );
        if (existingCoupon) {
          Swal.fire('Error!', 'You have already purchased a coupon for this week.', 'error');
          return;
        }

        const order = await createNewOrder(totalPrice, 'Coupon Purchase');
        if (!order || !order.orderId) {
          throw new Error('Invalid order response from server');
        }

        const couponData = {
          weekStartDate: weekStartStr,
          weekEndDate: weekEndStr,
          totalAmount: totalPrice,
          meals: dates.map(date => ({
            date,
            breakfast: !!selectedCoupons[`${days[dates.indexOf(date)]}-Breakfast`],
            lunch: !!selectedCoupons[`${days[dates.indexOf(date)]}-Lunch`],
            dinner: !!selectedCoupons[`${days[dates.indexOf(date)]}-Dinner`],
          })),
        };

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_DEFAULT_KEY_ID',
          amount: order.amount,
          currency: order.currency,
          name: 'MessMate',
          description: 'Coupon Purchase',
          order_id: order.orderId,
          handler: async (response) => {
            try {
              const paymentData = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };
              await verifyPaymentStatus(paymentData);
              // Include paymentId in couponData
              couponData.paymentId = response.razorpay_payment_id;
              console.log("Here",couponData);
              await purchaseCoupon(couponData, token);
              Swal.fire('Success!', 'Coupon Purchase completed successfully.', 'success');
              setSelectedCoupons({});
            } catch (err) {
              Swal.fire('Error!', err.message || 'Payment verification or coupon purchase failed.', 'error');
            }
          },
          prefill: {
            name: user?.name || 'User Name',
            email: user?.email || 'user@example.com',
          },
          theme: {
            color: '#4682b4',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          Swal.fire('Error!', 'Payment failed: ' + (response.error.description || 'Unknown error'), 'error');
        });
        rzp.open();
      } catch (err) {
        Swal.fire('Error!', err.message || 'Failed to create payment order.', 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Review', 'Please recheck your selection.', 'info');
    }
  };

  useEffect(() => {
    if (successMessage) {
      Swal.fire('Success!', successMessage, 'success');
    }
    if (couponError || paymentError) {
      Swal.fire('Error!', couponError || paymentError, 'error');
    }
  }, [successMessage, couponError, paymentError]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // if (!isWeekend) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
  //       <p className="text-xl font-semibold text-steel-blue">
  //         This Page is only Available on Saturday and Sunday
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-steel-blue mb-2">Buy Coupons</h2>
      <p className="text-lg text-gray-600 mb-6">Week: {weekDisplay}</p>
      {(couponLoading || paymentLoading) && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-6">
        {days.map((day, i) => (
          meals.map(meal => (
            <div 
              key={`${day}-${meal}`} 
              className={`bg-white shadow-md rounded-lg p-4 border border-powder-blue cursor-pointer transition-all duration-200 ${
                selectedCoupons[`${day}-${meal}`] ? 'ring-2 ring-steel-blue bg-blue-50' : ''
              }`}
              onClick={() => handleCouponClick(day, meal)}
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-steel-blue">
                  {meal} - {day} ({dates[i].split('-').reverse().join('/')})
                </h3>
                <p className="text-gray-600 text-sm">
                  {menuOfTheWeek[day]?.[meal] || 'Menu not available'}
                </p>
                <p className="text-gray-800 font-medium">
                  Price: ₹{prices[meal]}
                </p>
              </div>
            </div>
          ))
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold text-steel-blue">
          Total: ₹{totalPrice}
        </p>
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-white ${
            totalPrice >= 432 && !couponLoading && !paymentLoading ? 'bg-steel-blue bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={totalPrice < 432 || couponLoading || paymentLoading}
          onClick={handleCheckout}
        >
          {couponLoading || paymentLoading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default BuyCoupon;