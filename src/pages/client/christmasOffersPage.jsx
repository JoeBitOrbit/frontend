import React, { useState, useContext, useEffect } from 'react';
import { HolidayContext } from '../../context/HolidayContext';
import SpinTheWheel from '../../components/SpinTheWheel';
import LimitedSpots from '../../components/LimitedSpots';
import CountdownBanner from '../../components/CountdownBanner';
import ChristmasCalendar from '../../components/ChristmasCalendar';
import Footer from '../../components/Footer';
import { FaGift, FaFire, FaSnowflake, FaStar, FaWineGlass, FaClock } from 'react-icons/fa';
import './christmasOffersPage.css';

export default function ChristmasOffersPage() {
  const { holidayMode, discount } = useContext(HolidayContext);
  const [activeTab, setActiveTab] = useState('games');
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Create confetti on mount
    if (holidayMode) {
      createConfetti();
    }
  }, [holidayMode]);

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 50 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      size: 8 + Math.random() * 12,
      emoji: ['🎉', '🎁', '🎊', '✨', '⭐', '🎈', '💫'][Math.floor(Math.random() * 7)]
    }));
    setConfetti(newConfetti);
  };

  if (!holidayMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">🎉 Holiday Season Offers</h1>
          <p className="text-gray-600">Special seasonal offers will be available soon!</p>
        </div>
      </div>
    );
  }

  const offers = [
    {
      icon: <FaGift className="text-4xl" />,
      title: 'Spin to Win',
      description: 'Daily spins for amazing discounts up to 25% OFF',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <FaFire className="text-4xl" />,
      title: 'Limited Spots',
      description: '100 daily spots with winner selection for exclusive prizes',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <FaStar className="text-4xl" />,
      title: 'Advent Calendar',
      description: 'Open daily doors for exclusive surprises December 1-25',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaWineGlass className="text-4xl" />,
      title: 'Flash Deals',
      description: 'Random surprise discounts triggered throughout your visit',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 overflow-y-auto">
      {/* Confetti Animation */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {confetti.map(item => (
          <div
            key={item.id}
            className="absolute text-2xl animate-fall"
            style={{
              left: `${item.left}%`,
              top: '-30px',
              animation: `confettiFall ${item.duration}s linear ${item.delay}s infinite`,
              fontSize: `${item.size}px`
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative z-10 pt-8 pb-12">
        <CountdownBanner />
        
        <div className="text-center mt-12 px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-red-600 animate-pulse">
            🎉 HOLIDAY MAGIC 🎉
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
            Save up to {discount}% OFF on Everything!
          </p>
          <p className="text-gray-600 text-lg">Limited time seasonal offers you won't want to miss</p>
        </div>

        {/* Offer Cards Grid */}
        <div className="mt-16 px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${offer.color} p-8 rounded-2xl shadow-2xl text-white hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    {offer.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{offer.title}</h3>
                </div>
                <p className="text-white text-opacity-90">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-16 flex justify-center gap-4 px-4">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
              activeTab === 'games'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
            }`}
          >
            🎮 Win & Play
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
              activeTab === 'deals'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
            }`}
          >
            💰 Hot Deals
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
              activeTab === 'help'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
            }`}
          >
            🎁 Get Help
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-12 px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
          {activeTab === 'games' && (
            <div className="space-y-12">
              {/* Spin the Wheel */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-red-200">
                <div className="flex items-center gap-4 mb-6">
                  <FaFire className="text-4xl text-red-600" />
                  <h2 className="text-3xl md:text-4xl font-black text-red-600">
                    🎡 Spin the Wheel
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg">
                  Try your luck once per day! Spin and win exclusive discounts, free shipping, or special gifts. Every spin brings you closer to amazing savings!
                </p>
                <SpinTheWheel />
              </div>

              {/* Limited Spots */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-orange-200">
                <div className="flex items-center gap-4 mb-6">
                  <FaWineGlass className="text-4xl text-orange-600" />
                  <h2 className="text-3xl md:text-4xl font-black text-orange-600">
                    🎯 Limited Spots Contest
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg">
                  Only 100 spots available today! Enter for a chance to win exclusive discount codes. Winners are selected hourly!
                </p>
                <LimitedSpots />
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
              <h2 className="text-4xl font-black mb-8 text-center">🔥 HOT DEALS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white bg-opacity-20 rounded-2xl p-6 border-2 border-white border-opacity-50 hover:bg-opacity-30 transition-all">
                  <h3 className="text-3xl font-bold mb-2">25% OFF</h3>
                  <p className="text-lg mb-4">All Winter Collection</p>
                  <code className="bg-white text-red-600 px-4 py-2 rounded font-bold text-lg">WINTER25</code>
                </div>

                <div className="bg-white bg-opacity-20 rounded-2xl p-6 border-2 border-white border-opacity-50 hover:bg-opacity-30 transition-all">
                  <h3 className="text-3xl font-bold mb-2">FREE SHIP</h3>
                  <p className="text-lg mb-4">On Orders Over ₨5,000</p>
                  <code className="bg-white text-red-600 px-4 py-2 rounded font-bold text-lg">SHIPFREE</code>
                </div>

                <div className="bg-white bg-opacity-20 rounded-2xl p-6 border-2 border-white border-opacity-50 hover:bg-opacity-30 transition-all">
                  <h3 className="text-3xl font-bold mb-2">20% OFF</h3>
                  <p className="text-lg mb-4">Bestsellers & Trending</p>
                  <code className="bg-white text-red-600 px-4 py-2 rounded font-bold text-lg">TRENDING20</code>
                </div>

                <div className="bg-white bg-opacity-20 rounded-2xl p-6 border-2 border-white border-opacity-50 hover:bg-opacity-30 transition-all">
                  <h3 className="text-3xl font-bold mb-2">15% OFF</h3>
                  <p className="text-lg mb-4">Flash 2-Hour Deal</p>
                  <code className="bg-white text-red-600 px-4 py-2 rounded font-bold text-lg">FLASH15</code>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-2xl p-6 border-2 border-white border-opacity-30">
                <p className="text-center text-lg">
                  ⏰ All codes valid for limited time only. Multiple purchases possible!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-8">
              {/* Help Section */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">❓ FAQ & Help</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🎉 When is Holiday Mode?</h3>
                    <p>Holiday mode is active seasonally from December 1-25, featuring special offers and festive games for everyone!</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">🎫 Can I use multiple codes?</h3>
                    <p>Yes! You can stack codes from different sources (Spin, Contest, Flash Deals) for maximum savings!</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">⏱️ How long are codes valid?</h3>
                    <p>Spin codes: 3 days | Contest codes: 14 days | Flash deals: 2 hours. Check your code details!</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">👤 Do I need to login?</h3>
                    <p>Yes, you need a Nikola account to play games and enter contests. It's free and takes 30 seconds!</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">🎁 What if I win?</h3>
                    <p>Your discount code will appear instantly. Copy it and use it in your checkout for instant savings!</p>
                  </div>
                </div>
              </div>

              {/* Advent Calendar */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-green-200">
                <div className="flex items-center gap-4 mb-6">
                  <FaClock className="text-4xl text-green-600" />
                  <h2 className="text-3xl md:text-4xl font-black text-green-600">
                    📅 Advent Calendar
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg">
                  Open a door each day from December 1-25 to reveal exclusive discounts! Log in daily for your surprise reward.
                </p>
                <div className="overflow-x-auto pb-4">
                  <ChristmasCalendar />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 px-4 text-center pb-12">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-4">🎅 Ready to Celebrate?</h2>
            <p className="text-lg mb-6">Join thousands of happy shoppers enjoying Christmas deals!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('games')}
                className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-all transform hover:scale-105"
              >
                Start Playing →
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className="px-8 py-3 bg-red-700 text-white font-bold rounded-full hover:bg-red-800 transition-all border-2 border-white"
              >
                View All Deals →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
