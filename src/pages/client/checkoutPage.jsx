import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getItem } from '../../utils/safeStorage.js';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get cart from either location state or localStorage
  const [cart, setCart] = useState(() => {
    const locationItems = location.state?.items;
    if (locationItems && locationItems.length > 0) {
      return locationItems;
    }
    
    const savedCart = getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  // Validate cart on mount
  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Your cart is empty. Redirecting to products...');
      setTimeout(() => navigate('/products'), 2000);
    }
  }, [cart, navigate]);

  // Pre-fill user data if logged in
  useEffect(() => {
    const token = getItem("token");
    if (token) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData(prev => ({
            ...prev,
            fullName: `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim(),
            email: res.data.email || '',
          }));
        })
        .catch(() => {
          // Silently continue - user can fill manually
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handlePlaceOrder = async () => {
    // Validate all fields
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return;
    }

    // Build order object
    const orderData = {
      address: formData.address,
      phone: formData.phone,
      city: formData.city,
      email: formData.email,
      items: cart.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        image: item.image,
        size: item.size || '',
        color: item.color || ''
      })),
      paymentMethod: 'card'
    };

    setLoading(true);
    navigate('/payment', { state: { orderData } });
  };

  const total = calculateTotal();
  const shippingCost = total > 5000 ? 0 : 300; // Free shipping over 5000

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Please add items before checkout.</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Shipping Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6">Shipping Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="077 462 8194"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Colombo"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value="Sri Lanka"
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full delivery address..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
                />
              </div>
            </div>
          </div>

          {/* Order Items Review */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-black mb-4">Order Items</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-semibold text-black text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sticky */}
        <div className="md:col-span-1 h-fit">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
            <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-black">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-black">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold text-black">$0.00</span>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex justify-between">
                  <span className="font-bold text-black">Total:</span>
                  <span className="text-2xl font-bold text-red-600">${(total + shippingCost).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? '⏳ Processing...' : '✓ Proceed to Payment'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 mt-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
