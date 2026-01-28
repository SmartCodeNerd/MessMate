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
import { Doughnut } from "react-chartjs-2";

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

const MessAnalytics = () => {
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

  if (!analytics || !analytics.messOverview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  // Prepare data for Doughnut Chart (Overview Breakdown)
  const doughnutChartData = {
    labels: ["Total Students", "Total Coupons", "Total Used Meals"],
    datasets: [
      {
        label: "Mess Overview",
        data: [
          analytics.messOverview.totalStudents,
          analytics.messOverview.totalCoupons,
          analytics.messOverview.totalUsedMeals,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)", // Students
          "rgba(34, 197, 94, 0.6)", // Coupons
          "rgba(255, 159, 64, 0.6)", // Used Meals
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Mess Overview Breakdown" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">
            Mess Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Insights into students, coupons, and meal usage.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Total Students
              </h3>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {analytics.messOverview.totalStudents}
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
                {analytics.messOverview.totalCoupons}
              </p>
            </div>
            <div className="text-blue-500 text-4xl">🎟️</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Total Used Meals
              </h3>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {analytics.messOverview.totalUsedMeals}
              </p>
            </div>
            <div className="text-blue-500 text-4xl">🍽️</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 gap-8">
          {/* Overview Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessAnalytics;