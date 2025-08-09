import React, { useState } from 'react';
import menuOfTheWeek from '../../utils/mockMenu.js';
import Swal from 'sweetalert2';

const BuyCoupon = () => {
  const [selectedCoupons, setSelectedCoupons] = useState({});
  
  const prices = { Breakfast: 25, Lunch: 45, Dinner: 40 };
  const totalPrice = Object.keys(selectedCoupons).reduce((sum, key) => 
    selectedCoupons[key] ? sum + prices[key.split('-')[1]] : sum, 0);

  const handleCheckboxChange = (day, meal) => {
    setSelectedCoupons(prev => ({
      ...prev,
      [`${day}-${meal}`]: !prev[`${day}-${meal}`]
    }));
  };

  const handleCheckout = () => {
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

    Swal.fire({
      title: 'Confirm Purchase',
      html: confirmationText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'ReCheck',
      confirmButtonColor: '#4682b4',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success!', 'Proceeding to payment.', 'success');
      }
    });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-steel-blue mb-6">Buy Coupons</h2>
      <div className="grid grid-cols-3 gap-6">
        {days.map(day => (
          meals.map(meal => (
            <div 
              key={`${day}-${meal}`} 
              className="bg-white shadow-md rounded-lg p-4 border border-powder-blue"
            >
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={selectedCoupons[`${day}-${meal}`] || false}
                  onChange={() => handleCheckboxChange(day, meal)}
                  className="mr-3 h-5 w-5 text-steel-blue"
                />
                <div>
                  <h3 className="text-lg font-semibold text-steel-blue">
                    {meal} - {day}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {menuOfTheWeek[day]?.[meal] || 'Menu not available'}
                  </p>
                  <p className="text-gray-800 font-medium">
                    Price: ₹{prices[meal]}
                  </p>
                </div>
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
            totalPrice >= 432 ? 'bg-steel-blue bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={totalPrice < 432}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default BuyCoupon;
