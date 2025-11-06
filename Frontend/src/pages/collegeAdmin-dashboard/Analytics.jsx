import React, { useEffect } from "react";
import useAnalyticsStore from "../../stores/useAnalyticsStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { analytics, loading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  // Prepare data for Weekly Bookings Bar Chart
  const weeklyBookings = analytics.trends?.weeklyBookings || [];
  const weeklyBookingsLabels = weeklyBookings.map((item) => item._id);
  const weeklyBookingsData = weeklyBookings.map((item) => item.count);

  const barChartData = {
    labels: weeklyBookingsLabels,
    datasets: [
      {
        label: "Coupons Created",
        data: weeklyBookingsData,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Coupon Creation Trend" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Prepare data for Payments Doughnut Chart (by status count)
  const payments = analytics.payments || [];
  const paymentStatuses = payments.map((p) => p._id);
  const paymentCounts = payments.map((p) => p.count);

  const doughnutChartData = {
    labels: paymentStatuses,
    datasets: [
      {
        label: "Payments by Status",
        data: paymentCounts,
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)", // Success/Completed
          "rgba(255, 99, 132, 0.6)", // Failed
          "rgba(255, 159, 64, 0.6)", // Pending
          "rgba(59, 130, 246, 0.6)", // Other
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Payments by Status" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">
            College Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Insights into students, coupons, payments, and trends.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Total Students
              </h3>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {analytics.students?.totalStudents || 0}
              </p>
            </div>
            <div className="text-blue-500 text-4xl">👥</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Total Coupons
              </h3>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {analytics.coupons?.totalCoupons || 0}
              </p>
            </div>
            <div className="text-blue-500 text-4xl">🎟️</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Bookings Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          {/* Payments Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
