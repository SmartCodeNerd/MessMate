import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle,XCircle } from 'lucide-react';
import useCouponStore from '../../stores/useCouponStore';
import useAuthStore from '../../stores/useAuthStore';
import Swal from 'sweetalert2';

const CouponDashboard = () => {
  const { myCoupons, loading, error, fetchMyCoupons, validateMyCoupon } = useCouponStore();
  const { token } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchMyCoupons(token);
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [token]);

  const mealTimes = {
    breakfast: { start: 7, end: 9, startMinutes: -10, endMinutes: 10 },
    lunch: { start: 12, end: 15, startMinutes: -10, endMinutes: 10 },
    dinner: { start: 19, end: 21, startMinutes: -10, endMinutes: 10 },
  };

  const mealColors = {
    breakfast: { bg: 'bg-yellow-200', text: 'text-yellow-800', border: 'border-yellow-300' },
    lunch: { bg: 'bg-green-200', text: 'text-green-800', border: 'border-green-300' },
    dinner: { bg: 'bg-purple-200', text: 'text-purple-800', border: 'border-purple-300' },
  };

  const isMealTimeActive = (mealType) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    const mealConfig = mealTimes[mealType];
    const startTotalMinutes = mealConfig.start * 60 + mealConfig.startMinutes;
    const endTotalMinutes = mealConfig.end * 60 + mealConfig.endMinutes;
    
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  };

  const formatMealTime = (mealType) => {
    const config = mealTimes[mealType];
    const startHour = config.start === 12 ? 12 : config.start % 12 || 12;
    const endHour = config.end === 12 ? 12 : config.end % 12 || 12;
    const startPeriod = config.start < 12 ? 'AM' : 'PM';
    const endPeriod = config.end < 12 ? 'AM' : 'PM';
    
    return `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`;
  };

  const getTodaysCoupons = () => {
    if (!myCoupons.length) return [];
    
    const today = new Date().toISOString().split('T')[0];
    return myCoupons
      .flatMap(coupon =>
        coupon.meals
          .filter(meal => meal.date === today)
          .flatMap(meal =>
            Object.entries(meal)
              .filter(([key, value]) => key !== 'date' && value.selected !== 'NOT_BOUGHT')
              .map(([mealType, details]) => ({
                type: mealType,
                ...details,
                date: meal.date,
                couponId: coupon._id,
              }))
          )
      );
  };

  const handleValidate = async (coupon) => {
    if (!isMealTimeActive(coupon.type)) {
      Swal.fire('Error', 'Validation is only available during meal time.', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(track => track.stop());
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const result = await validateMyCoupon({ meal: coupon.type, couponId: coupon.couponId }, token);
      Swal.fire('Success', result.message, 'success');
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          stream.getTracks().forEach(track => track.stop());
          const result = await validateMyCoupon({ meal: coupon.type, couponId: coupon.couponId }, token);
          Swal.fire('Success', result.message, 'success');
          stream.getTracks().forEach(track => track.stop());
        } catch (innerErr) {
          if (innerErr.name === 'NotFoundError') {
            Swal.fire('Error', 'No camera available on this device.', 'error');
          } else {
            Swal.fire('Error', 'Validation failed: ' + innerErr.message, 'error');
          }
        }
      } else {
        Swal.fire('Error', 'Validation failed: ' + err.message, 'error');
      }
    }
  };

  const CouponCard = ({ coupon }) => {
    const isActive = isMealTimeActive(coupon.type);
    const colors = mealColors[coupon.type];
    const isEaten = coupon.status === 'eaten';
    const isSold = coupon.selected === 'SOLD_P2P';

    return (
      <div className="relative w-full max-w-sm mx-auto">
        <div className={`relative p-4 rounded-lg shadow-lg min-h-[200px] flex flex-col justify-between border-2 ${colors.border} ${colors.bg} hover:shadow-xl transition-shadow duration-300`}>
          {/* Perforated edges all around */}
          <div className="absolute -top-2 left-1/4 w-3 h-3 bg-white transform -translate-y-1/2 clip-triangle"></div>
          <div className="absolute -top-2 right-1/4 w-3 h-3 bg-white transform -translate-y-1/2 clip-triangle"></div>
          <div className="absolute -bottom-2 left-1/4 w-3 h-3 bg-white transform translate-y-1/2 clip-triangle rotate-180"></div>
          <div className="absolute -bottom-2 right-1/4 w-3 h-3 bg-white transform translate-y-1/2 clip-triangle rotate-180"></div>
          <div className="absolute -left-2 top-1/4 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute -left-2 bottom-1/4 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute -right-2 top-1/4 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute -right-2 bottom-1/4 w-4 h-4 bg-white rounded-full"></div>

          <div className="text-center flex-grow flex flex-col justify-center">
            <h3 className={`font-bold text-xl uppercase tracking-wide ${colors.text} mb-2`}>Meal: {coupon.type}</h3>
            <p className={`text-sm font-medium ${colors.text} mb-2`}>{formatMealTime(coupon.type)}</p>
            <div className={`flex items-center justify-center space-x-2 ${colors.text}`}>
              <Clock size={16} />
              <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                {isActive ? 'Available Now' : 'Not Available'}
              </span>
            </div>
            {isActive && !isEaten && !isSold && (
              <button
                onClick={() => handleValidate(coupon)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Validate
              </button>
            )}
          </div>

          {isEaten && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform rotate-12 bg-green-600 text-white px-3 py-1 rounded border-2 border-green-700 shadow-md font-bold text-xs">
                ✓ VALIDATED
              </div>
            </div>
          )}

          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform -rotate-12 bg-red-600 text-white px-3 py-1 rounded border-2 border-red-700 shadow-md font-bold text-xs">
                SOLD
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const todaysCoupons = getTodaysCoupons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Today's Meal Coupons</h1>
          {/* <p className="text-lg text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Current Time: {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div> */}
        </div>

        {todaysCoupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {todaysCoupons.map((coupon, index) => (
              <CouponCard key={`${coupon.type}-${index}`} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
              <XCircle className="mx-auto h-20 w-20 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Coupons</h3>
              <p className="text-gray-600">You don't have any meal coupons for today.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Coupon Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Available Now</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-700">Not Available</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-gray-700">Validated</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-gray-700">Sold</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            * Coupons are active 10 minutes before and after meal times
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponDashboard;