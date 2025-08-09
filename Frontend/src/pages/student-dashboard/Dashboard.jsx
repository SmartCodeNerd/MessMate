import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import useCouponStore from '../../stores/useCouponStore';
import useAuthStore from '../../stores/useAuthStore';
import Swal from 'sweetalert2';
import menu from '../../utils/mockMenu.js';

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
    lunch: { start: 12, end: 16, startMinutes: -10, endMinutes: 10 },
    dinner: { start: 19, end: 21, startMinutes: -10, endMinutes: 10 },
  };

  const mealColors = {
    breakfast: { bg: 'bg-rose-200', text: 'text-rose-800', border: 'border-rose-300', primary: 'from-rose-400 to-red-500' },
    lunch: { bg: 'bg-cyan-200', text: 'text-cyan-800', border: 'border-cyan-300', primary: 'from-cyan-400 to-teal-500' },
    dinner: { bg: 'bg-amber-200', text: 'text-amber-800', border: 'border-amber-300', primary: 'from-amber-400 to-orange-500' },
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

  const isMealExpired = (mealType) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    const mealConfig = mealTimes[mealType];
    const endTotalMinutes = mealConfig.end * 60 + mealConfig.endMinutes;
    
    return currentTotalMinutes > endTotalMinutes;
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
    const isSold = coupon.selected === 'SOLD_P2P';
    const isExpired = isMealExpired(coupon.type) && !isActive && coupon.status !== 'eaten' && !isSold;
    const colors = mealColors[coupon.type];
    const isEaten = coupon.status === 'eaten';
    const [showMenu, setShowMenu] = useState(false);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const toggleMenu = () => {
      setShowMenu(!showMenu);
    };

    return (
      <div className="relative w-full max-w-sm mx-auto">
        <div className={`relative p-6 min-h-[180px] flex flex-col justify-between transform transition-all duration-300 mx-4 my-6 ${colors.bg} ${colors.border} hover:scale-105 hover:shadow-xl ${isExpired ? 'opacity-70 grayscale' : ''} ${showMenu ? 'rotate-y-180' : ''}`}
          style={{
            clipPath: `polygon(
              0% 4%, 2% 0%, 4% 4%, 6% 0%, 8% 4%, 10% 0%, 12% 4%, 14% 0%, 
              16% 4%, 18% 0%, 20% 4%, 22% 0%, 24% 4%, 26% 0%, 28% 4%, 30% 0%, 
              32% 4%, 34% 0%, 36% 4%, 38% 0%, 40% 4%, 42% 0%, 44% 4%, 46% 0%, 
              48% 4%, 50% 0%, 52% 4%, 54% 0%, 56% 4%, 58% 0%, 60% 4%, 62% 0%, 
              64% 4%, 66% 0%, 68% 4%, 70% 0%, 72% 4%, 74% 0%, 76% 4%, 78% 0%, 
              80% 4%, 82% 0%, 84% 4%, 86% 0%, 88% 4%, 90% 0%, 92% 4%, 94% 0%, 
              96% 4%, 98% 0%, 100% 4%,
              100% 6%, 96% 8%, 100% 10%, 96% 12%, 100% 14%, 96% 16%, 100% 18%, 
              96% 20%, 100% 22%, 96% 24%, 100% 26%, 96% 28%, 100% 30%, 96% 32%, 
              100% 34%, 96% 36%, 100% 38%, 96% 40%, 100% 42%, 96% 44%, 100% 46%, 
              96% 48%, 100% 50%, 96% 52%, 100% 54%, 96% 56%, 100% 58%, 96% 60%, 
              100% 62%, 96% 64%, 100% 66%, 96% 68%, 100% 70%, 96% 72%, 100% 74%, 
              96% 76%, 100% 78%, 96% 80%, 100% 82%, 96% 84%, 100% 86%, 96% 88%, 
              100% 90%, 96% 92%, 100% 94%, 96% 96%,
              98% 100%, 96% 96%, 94% 100%, 92% 96%, 90% 100%, 88% 96%, 86% 100%, 
              84% 96%, 82% 100%, 80% 96%, 78% 100%, 76% 96%, 74% 100%, 72% 96%, 
              70% 100%, 68% 96%, 66% 100%, 64% 96%, 62% 100%, 60% 96%, 58% 100%, 
              56% 96%, 54% 100%, 52% 96%, 50% 100%, 48% 96%, 46% 100%, 44% 96%, 
              42% 100%, 40% 96%, 38% 100%, 36% 96%, 34% 100%, 32% 96%, 30% 100%, 
              28% 96%, 26% 100%, 24% 96%, 22% 100%, 20% 96%, 18% 100%, 16% 96%, 
              14% 100%, 12% 96%, 10% 100%, 8% 96%, 6% 100%, 4% 96%, 2% 100%, 0% 96%,
              0% 94%, 4% 92%, 0% 90%, 4% 88%, 0% 86%, 4% 84%, 0% 82%, 4% 80%, 
              0% 78%, 4% 76%, 0% 74%, 4% 72%, 0% 70%, 4% 68%, 0% 66%, 4% 64%, 
              0% 62%, 4% 60%, 0% 58%, 4% 56%, 0% 54%, 4% 52%, 0% 50%, 4% 48%, 
              0% 46%, 4% 44%, 0% 42%, 4% 40%, 0% 38%, 4% 36%, 0% 34%, 4% 32%, 
              0% 30%, 4% 28%, 0% 26%, 4% 24%, 0% 22%, 4% 20%, 0% 18%, 4% 16%, 
              0% 14%, 4% 12%, 0% 10%, 4% 8%, 0% 6%
            )`,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}>
          <div className="absolute inset-0 rounded-lg shadow-inner opacity-20 bg-black pointer-events-none"></div>
          
          <div className="text-center flex-grow flex flex-col justify-center relative z-10 backface-hidden">
            {!showMenu && (
              <>
                <div className={`rounded-lg p-4 mb-3 border-2 border-dashed bg-gradient-to-r ${colors.primary} border-white border-opacity-50`}>
                  <h3 className={`font-bold text-xl capitalize tracking-wide mb-1 text-white drop-shadow-md`}>{coupon.type}</h3>
                  <p className={`text-sm font-medium text-white text-opacity-90`}>{formatMealTime(coupon.type)}</p>
                </div>
                
                <div className={`flex items-center justify-center space-x-2 text-sm mb-3 ${colors.text}`}>
                  <Clock size={16} />
                  <span className={`font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-red-600'}`}>
                    {isActive ? 'Available Now' : isExpired ? 'Expired' : 'Not Available'}
                  </span>
                </div>

                {isActive && !isEaten && !isSold && (
                  <button
                    onClick={() => handleValidate(coupon)}
                    className={`mt-2 px-4 py-2 rounded-lg font-semibold text-sm bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${colors.text} border-2 ${colors.border}`}
                  >
                    Validate Coupon
                  </button>
                )}

                <button
                  onClick={toggleMenu}
                  className={`mt-2 px-4 py-2 rounded-lg font-semibold text-sm bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${colors.text} border-2 ${colors.border}`}
                >
                  Show Menu
                </button>
              </>
            )}

            {showMenu && (
              <div className="absolute inset-0 backface-hidden flex flex-col justify-center items-center text-center p-4">
                <h3 className={`font-bold text-xl capitalize tracking-wide mb-2 ${colors.text}`}>{coupon.type} Menu</h3>
                <ul className={`list-disc list-inside ${colors.text}`}>
                  {menu[today] && menu[today][coupon.type] && menu[today][coupon.type].map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
                <button
                  onClick={toggleMenu}
                  className={`mt-4 px-4 py-2 rounded-lg font-semibold text-sm bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${colors.text} border-2 ${colors.border}`}
                >
                  Back
                </button>
              </div>
            )}
          </div>

          {isEaten && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="transform rotate-12 bg-green-600 text-white px-4 py-2 rounded border-2 border-green-700 shadow-lg font-bold text-sm">
                ✓ VALIDATED
              </div>
            </div>
          )}
          
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="transform -rotate-12 bg-red-600 text-white px-6 py-2 rounded border-2 border-red-700 shadow-lg font-bold text-sm">
                SOLD
              </div>
            </div>
          )}
        </div>

        <div className={`absolute inset-0 bg-black opacity-10 transform translate-x-1 translate-y-1 -z-10 blur-sm`}
          style={{
            clipPath: `polygon(
              0% 4%, 2% 0%, 4% 4%, 6% 0%, 8% 4%, 10% 0%, 12% 4%, 14% 0%, 
              16% 4%, 18% 0%, 20% 4%, 22% 0%, 24% 4%, 26% 0%, 28% 4%, 30% 0%, 
              32% 4%, 34% 0%, 36% 4%, 38% 0%, 40% 4%, 42% 0%, 44% 4%, 46% 0%, 
              48% 4%, 50% 0%, 52% 4%, 54% 0%, 56% 4%, 58% 0%, 60% 4%, 62% 0%, 
              64% 4%, 66% 0%, 68% 4%, 70% 0%, 72% 4%, 74% 0%, 76% 4%, 78% 0%, 
              80% 4%, 82% 0%, 84% 4%, 86% 0%, 88% 4%, 90% 0%, 92% 4%, 94% 0%, 
              96% 4%, 98% 0%, 100% 4%,
              100% 6%, 96% 8%, 100% 10%, 96% 12%, 100% 14%, 96% 16%, 100% 18%, 
              96% 20%, 100% 22%, 96% 24%, 100% 26%, 96% 28%, 100% 30%, 96% 32%, 
              100% 34%, 96% 36%, 100% 38%, 96% 40%, 100% 42%, 96% 44%, 100% 46%, 
              96% 48%, 100% 50%, 96% 52%, 100% 54%, 96% 56%, 100% 58%, 96% 60%, 
              100% 62%, 96% 64%, 100% 66%, 96% 68%, 100% 70%, 96% 72%, 100% 74%, 
              96% 76%, 100% 78%, 96% 80%, 100% 82%, 96% 84%, 100% 86%, 96% 88%, 
              100% 90%, 96% 92%, 100% 94%, 96% 96%,
              98% 100%, 96% 96%, 94% 100%, 92% 96%, 90% 100%, 88% 96%, 86% 100%, 
              84% 96%, 82% 100%, 80% 96%, 78% 100%, 76% 96%, 74% 100%, 72% 96%, 
              70% 100%, 68% 96%, 66% 100%, 64% 96%, 62% 100%, 60% 96%, 58% 100%, 
              56% 96%, 54% 100%, 52% 96%, 50% 100%, 48% 96%, 46% 100%, 44% 96%, 
              42% 100%, 40% 96%, 38% 100%, 36% 96%, 34% 100%, 32% 96%, 30% 100%, 
              28% 96%, 26% 100%, 24% 96%, 22% 100%, 20% 96%, 18% 100%, 16% 96%, 
              14% 100%, 12% 96%, 10% 100%, 8% 96%, 6% 100%, 4% 96%, 2% 100%, 0% 96%,
              0% 94%, 4% 92%, 0% 90%, 4% 88%, 0% 86%, 4% 84%, 0% 82%, 4% 80%, 
              0% 78%, 4% 76%, 0% 74%, 4% 72%, 0% 70%, 4% 68%, 0% 66%, 4% 64%, 
              0% 62%, 4% 60%, 0% 58%, 4% 56%, 0% 54%, 4% 52%, 0% 50%, 4% 48%, 
              0% 46%, 4% 44%, 0% 42%, 4% 40%, 0% 38%, 4% 36%, 0% 34%, 4% 32%, 
              0% 30%, 4% 28%, 0% 26%, 4% 24%, 0% 22%, 4% 20%, 0% 18%, 4% 16%, 
              0% 14%, 4% 12%, 0% 10%, 4% 8%, 0% 6%
            )`
          }}></div>
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
          <p className="text-lg text-gray-600">
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
          </div>
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
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-gray-700">Expired</span>
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