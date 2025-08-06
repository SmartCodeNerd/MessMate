export const mockData = {
  todaysCoupon: {
    id: 1,
    breakfast: true,
    lunch: true,
    dinner: false,
    status: 'active'
  },
  tradeItems: [
    { id: 1, date: '2024-01-08', meal: 'Dinner', seller: 'John Doe', price: 50 },
    { id: 2, date: '2024-01-09', meal: 'Lunch', seller: 'Jane Smith', price: 60 }
  ],
  students: [
    { id: 1, name: 'Alice Johnson', studentId: 'ST001', contact: '9876543210', coupons: 15 },
    { id: 2, name: 'Bob Wilson', studentId: 'ST002', contact: '9876543211', coupons: 12 }
  ],
  stats: {
    totalStudents: 150,
    totalCoupons: 1250,
    totalRevenue: 75000,
    activeUsers: 142
  }
}
