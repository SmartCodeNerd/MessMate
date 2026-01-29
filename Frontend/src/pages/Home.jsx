import React, { useState, useEffect } from "react";
import { Footer } from "../components/Footer";
import { FeatureCard } from "../components/FeatureCard";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔒 Redirect to dashboard " if user is logged in" --> this should only be present in protected routes like Login page...
  //      else there will be an issue of auto-redirect vs manual navigation
  // useEffect(() => {
  //   if (user?.role) {
  //     switch (user.role) {
  //       case "Student":
  //         navigate("/student-dashboard");
  //         break;
  //       case "Mess Admin":
  //         navigate("/messadmin-dashboard");
  //         break;
  //       case "College Admin":
  //         navigate("/collegeadmin-dashboard");
  //         break;
  //       case "Super Admin":
  //         navigate("/superadmin-dashboard");
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }, [user, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Digital Coupon Purchase",
      description:
        "Instantly buy meal coupons from anywhere on campus using our secure online payment system.",
    },

    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      title: "Peer-to-Peer Trading",
      description:
        "Have extra coupons? Easily trade them with fellow students through a secure and simple interface.",
    },

    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Real-Time Tracking",
      description:
        "Keep a detailed history of all your coupon purchases, uses, and trades. Always know your balance.",
    },

    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11c0 3.517-1.009 6.789-2.756 9.348m-2.244-2.244A9.002 9.002 0 0112 11z"
          />
        </svg>
      ),
      title: "Admin Analytics",
      description:
        "Powerful dashboards for mess and college admins to monitor coupon sales, usage patterns, and revenue.",
    },

    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Secure Payments",
      description:
        "Integrated with Razorpay for fast, reliable, and secure transactions every time you purchase a coupon.",
    },

    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Feedback System",
      description:
        "Submit feedback or report issues directly to the mess administration, with options to attach images.",
    },
  ];

  const pricingPlans = [
    {
      title: "Basic Pack",
      price: "₹500",
      period: "/month",
      features: ["30 Meal Coupons", "Basic Tracking", "P2P Trading"],
      buttonText: "Select Basic",
      isPopular: false,
    },
    {
      title: "Standard Pack",
      price: "₹900",
      period: "/month",
      features: ["60 Meal Coupons", "Full Analytics", "Priority Support"],
      buttonText: "Select Standard",
      isPopular: true,
    },
    {
      title: "Premium Pack",
      price: "₹1,500",
      period: "/month",
      features: ["Unlimited Meals", "Advanced Trading", "Exclusive Features"],
      buttonText: "Select Premium",
      isPopular: false,
    },
  ];

  const PricingCard = ({ plan }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${plan.isPopular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Popular
        </div>
      )}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{plan.title}</h3>
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-blue-600">{plan.price}</span>
          <span className="text-gray-500 ml-1">{plan.period}</span>
        </div>
        <ul className="text-left space-y-2 mb-6 text-sm text-gray-600">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogin}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            plan.isPopular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
                body { scroll-behavior: smooth; }
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-40px) rotate(15deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                @keyframes float-reverse { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(30px) rotate(-10deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                .food-item { position: absolute; font-size: 2rem; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
                .item-1 { top: 10%; left: 10%; animation-name: float; animation-duration: 13s; font-size: 3rem; }
                .item-2 { top: 15%; right: 12%; animation-name: float-reverse; animation-duration: 15s; font-size: 3.5rem; }
                .item-3 { bottom: 10%; left: 20%; animation-name: float; animation-duration: 12s; font-size: 2.5rem; }
                .item-4 { bottom: 15%; right: 18%; animation-name: float-reverse; animation-duration: 14s; font-size: 3.5rem; }
                .item-5 { top: 60%; left: 5%; animation-name: float; animation-duration: 16s; font-size: 4rem; }
                .item-6 { top: 40%; right: 35%; animation-name: float-reverse; animation-duration: 11s; font-size: 2.5rem; }
                .item-7 { top: 5%; left: 45%; animation-name: float; animation-duration: 18s; font-size: 3rem; }
                .item-8 { bottom: 5%; left: 50%; animation-name: float-reverse; animation-duration: 17s; font-size: 3.5rem; }
                .item-9 { top: 75%; right: 8%; animation-name: float; animation-duration: 12s; font-size: 2.5rem; }
                .item-10 { top: 45%; left: 25%; animation-name: float-reverse; animation-duration: 19s; font-size: 3rem; }
                .features-section { background-color: #f9fafb; background-image: radial-gradient(#dbeafe 1px, transparent 1px); background-size: 40px 40px; }
                .gradient-btn { background-image: linear-gradient(to right, #fb923c, #f97316); }
                .gradient-icon { background-image: linear-gradient(to top right, #60a5fa, #3b82f6); }
            `}</style>

      <div className="bg-gray-50">
        <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#home" className="text-2xl font-bold text-blue-900">
                MessMate
              </a>
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </a>
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </nav>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden bg-white shadow-lg">
              <a
                href="#features"
                className="block py-3 px-4 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block py-3 px-4 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <button
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block py-3 px-4 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100"
              >
                Login
              </button>
            </nav>
          )}
        </header>

        <main id="home">
          <div className="relative bg-white overflow-hidden pt-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative z-10 py-24 sm:py-32 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 text-blue-900">
                  Welcome to MessMate
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  A seamless coupon-based mess management system for college
                  students.
                </p>
                <button
                  onClick={handleLogin}
                  className="gradient-btn text-white font-bold py-3 px-8 rounded-full text-base md:text-lg hover:opacity-90 transition-opacity transform hover:scale-105 duration-300 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="absolute inset-0 z-0 opacity-40">
              <span className="food-item item-1">🍕</span>{" "}
              <span className="food-item item-2">🍔</span>{" "}
              <span className="food-item item-3">🍟</span>{" "}
              <span className="food-item item-4">🍩</span>{" "}
              <span className="food-item item-5">🥗</span>
              <span className="food-item item-6">🌮</span>{" "}
              <span className="food-item item-7">🥟</span>{" "}
              <span className="food-item item-8">🍛</span>{" "}
              <span className="food-item item-9">🫓</span>{" "}
              <span className="food-item item-10">🧋</span>
            </div>
          </div>

          <div id="features" className="py-20 sm:py-24 features-section">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why You'll Love MessMate
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 md:mb-16">
                Everything you need for a hassle-free dining experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </div>
          </div>

          <div id="pricing" className="py-20 sm:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 md:mb-16">
                Flexible meal packs for every student.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;