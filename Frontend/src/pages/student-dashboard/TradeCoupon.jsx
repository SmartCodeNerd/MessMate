import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import useCouponTradeStore from '../../stores/useCouponTradeStore';
import useAuthStore from '../../stores/useAuthStore';
import usePaymentStore from '../../stores/usePaymentStore';
import useCouponStore from '../../stores/useCouponStore';

const CouponTrade = () => {
  const [showSellForm, setShowSellForm] = useState(false);
  const [formData, setFormData] = useState({ date: new Date(), meal: 'Breakfast', price: '' });
  const { token, user } = useAuthStore();
  const {
    listCouponForTrade,
    fetchAvailableCouponsForTrade,
    availableTrades,
    loading,
    error,
    successMessage
  } = useCouponTradeStore();
  const {checkAvailableCoupons} = useCouponStore();
  const { createNewOrder, verifyPaymentStatus } = usePaymentStore();

  const maxPrices = { Breakfast: 25, Lunch: 45, Dinner: 40 };
  const today = new Date('2025-08-12T09:57:00+05:30'); // Current date and time

  useEffect(() => {
    if (token) fetchAvailableCouponsForTrade(token);
  }, [token]);

  useEffect(() => {
    if (successMessage) {
      Swal.fire('Success!', successMessage, 'success').then(() => {
        fetchAvailableCouponsForTrade(token);
      });
    }
    if (error) Swal.fire('Error!', error, 'error');
  }, [successMessage, error]);

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    const { date, meal, price } = formData;
    const formattedDate = date.toISOString().split('T')[0];

    if (!price || price > maxPrices[meal]) {
      Swal.fire('Error!', `Price for ${meal} cannot exceed ₹${maxPrices[meal]}`, 'error');
      return;
    }

    try {
      const availability = await checkAvailableCoupons({ date: formattedDate, meal }, token);
      if (!availability.data.length) {
        Swal.fire('Error!', 'You do not have a coupon for this date and meal', 'error');
        return;
      }

      await listCouponForTrade({ date: formattedDate, meal, price }, token);
      const message = `${formattedDate.split('-').reverse().join('/')}(${new Date(formattedDate).toLocaleDateString('en-US', { weekday: 'short' })}) ${meal} Coupon Available @ ₹${price}/-`;
      Swal.fire({
        title: 'Coupon Listed!',
        html: `
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
            <span>${message}</span>
          </div>
        `,
        showConfirmButton: false,
        timer: 3000,
        didOpen: () => {
          const profileIcon = Swal.getHtmlContainer().querySelector('div');
          profileIcon.addEventListener('mouseover', () => {
            Swal.update({
              html: `
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                  <div>
                    <p>Name: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.contactNumber || 'N/A'}</p>
                  </div>
                </div>
              `,
            });
          });
          profileIcon.addEventListener('mouseout', () => {
            Swal.update({
              html: `
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                  <span>${message}</span>
                </div>
              `,
            });
          });
        },
      });
      setShowSellForm(false);
      setFormData({ date: new Date(), meal: 'Breakfast', price: '' });
    } catch (err) {
      Swal.fire('Error!', err.message || 'Failed to list coupon', 'error');
    }
  };

  const handleBuy = async (tradeId) => {
    try {
      const order = await createNewOrder(tradeId.price, 'Coupon Trade Purchase');
      if (!order || !order.orderId) throw new Error('Invalid order response');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_DEFAULT_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'MessMate',
        description: 'Coupon Trade Purchase',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const paymentData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            await verifyPaymentStatus(paymentData);
            await buyCouponFromTrade(tradeId._id, token);
            Swal.fire('Success!', 'Coupon bought successfully!', 'success');
            fetchAvailableCouponsForTrade(token);
          } catch (err) {
            Swal.fire('Error!', err.message || 'Payment verification failed', 'error');
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#4682b4' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        Swal.fire('Error!', 'Payment failed: ' + (response.error.description || 'Unknown error'), 'error');
      });
      rzp.open();
    } catch (err) {
      Swal.fire('Error!', err.message || 'Failed to initiate payment', 'error');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => setShowSellForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Sell Coupon
      </button>

      {showSellForm && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Sell Coupon</h2>
          <form onSubmit={handleSellSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Date</label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                minDate={today}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Meal</label>
              <select
                name="meal"
                value={formData.meal}
                onChange={(e) => setFormData({ ...formData, meal: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Sell'}
              </button>
              <button
                onClick={() => setShowSellForm(false)}
                className="text-blue-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Available Trades</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && availableTrades.length === 0 && <p>No trades available.</p>}
      {!loading && !error && availableTrades.map((trade) => (
        <div key={trade._id} className="flex items-center mb-4 p-4 bg-white rounded shadow">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
          <div className="flex-1">
            <p>
              {new Date(trade.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              ({new Date(trade.date).toLocaleDateString('en-US', { weekday: 'short' })}) {trade.meal} Coupon Available @ ₹{trade.price}/-
            </p>
          </div>
          {trade.sellerId._id !== user._id && (
            <button
              onClick={() => handleBuy(trade)}
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={loading}
            >
              Buy
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CouponTrade;