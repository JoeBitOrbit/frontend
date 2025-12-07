import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { syncCartCount } from '../../utils/cart';
import { setItem as safeSetItem, getItem } from '../../utils/safeStorage';

export default function PaymentPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const orderData = location.state?.orderData;
	
	const [processing, setProcessing] = useState(false);
	const [formData, setFormData] = useState({
		cardNumber: '4111111111111111',
		cardName: 'Test Card',
		expiryMonth: '12',
		expiryYear: '25',
		cvv: '123'
	});

	useEffect(() => {
		if (!orderData || !orderData.items || orderData.items.length === 0) {
			toast.error('No order data found');
			navigate('/cart');
		}
	}, [orderData, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		
		// Format based on field type
		if (name === 'cardNumber') {
			const cleaned = value.replace(/\D/g, '').slice(0, 16);
			setFormData(prev => ({ ...prev, [name]: cleaned }));
		} else if (name === 'expiryMonth') {
			const val = value.replace(/\D/g, '').slice(0, 2);
			setFormData(prev => ({ ...prev, [name]: val }));
		} else if (name === 'expiryYear') {
			const val = value.replace(/\D/g, '').slice(0, 2);
			setFormData(prev => ({ ...prev, [name]: val }));
		} else if (name === 'cvv') {
			const val = value.replace(/\D/g, '').slice(0, 3);
			setFormData(prev => ({ ...prev, [name]: val }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handlePayment = async () => {
		// Validate all fields are filled
		if (!formData.cardNumber || !formData.cardName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
			toast.error('Please fill all payment fields');
			return;
		}

		// Basic validation
		if (formData.cardNumber.length !== 16) {
			toast.error('Card number must be 16 digits');
			return;
		}
		if (formData.cvv.length !== 3) {
			toast.error('CVV must be 3 digits');
			return;
		}

		setProcessing(true);

		// Simulate payment processing
		await new Promise(resolve => setTimeout(resolve, 1500));

		try {
			let token = '';
			try { 
				token = getItem('token') || ''; 
			} catch(e) { 
				token = '';
			}
			
			// Create order
			try {
				await axios.post(
					import.meta.env.VITE_BACKEND_URL + '/api/orders',
					orderData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
			} catch (apiError) {
				console.error('Order API error:', apiError.response?.data || apiError.message);
				throw apiError;
			}

			// Clear cart
			try { 
				safeSetItem('cart', JSON.stringify([])); 
			} catch (_) {}
			
			try { 
				syncCartCount(); 
			} catch (_) {}

			toast.success('Payment successful! 🎉 Order placed.');
			setProcessing(false);
			
			// Redirect after success
			setTimeout(() => navigate('/products'), 1500);
		} catch (err) {
			console.error('Payment error:', err.message);
			toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
			setProcessing(false);
		}
	};

	if (!orderData || !orderData.items || orderData.items.length === 0) {
		return (
			<div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h2>
					<p className="text-gray-600 mb-6">Please add items to your cart first.</p>
					<button 
						onClick={() => navigate('/cart')}
						className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
					>
						Back to Cart
					</button>
				</div>
			</div>
		);
	}

	const total = orderData.items.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-6">
			<div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
				
				{/* Left: Order Summary */}
				<div className="space-y-6">
					<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
						<h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>
						
						<div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
							{orderData.items.map((item, idx) => (
								<div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-b-0">
									<div>
										<p className="font-semibold text-black">{item.name}</p>
										<p className="text-sm text-gray-500">Qty: {item.qty}</p>
									</div>
									<p className="font-bold text-black">${(item.price * item.qty).toFixed(2)}</p>
								</div>
							))}
						</div>

						<div className="bg-red-50 rounded-lg p-4 border border-red-200">
							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold text-black">Total Amount:</span>
								<span className="text-3xl font-bold text-red-600">${total.toFixed(2)}</span>
							</div>
						</div>
					</div>

					{/* Delivery Info */}
					<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
						<h3 className="font-semibold text-black mb-4">Delivery Details</h3>
						<div className="space-y-2 text-sm text-gray-700">
							<p><span className="font-semibold">Address:</span> {orderData.address || 'Not provided'}</p>
							<p><span className="font-semibold">Phone:</span> {orderData.phone || 'Not provided'}</p>
						</div>
					</div>
				</div>

				{/* Right: Payment Form */}
				<div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 h-fit">
					<h2 className="text-2xl font-bold text-black mb-2">Payment Details</h2>
					<p className="text-sm text-gray-500 mb-6">Demo mode - Use any card number</p>

					<div className="space-y-5">
						{/* Card Number */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
							<input
								type="text"
								name="cardNumber"
								value={formData.cardNumber}
								onChange={handleInputChange}
								placeholder="4111111111111111"
								className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
								maxLength="16"
							/>
							<p className="text-xs text-gray-500 mt-1">16 digits • Auto-filled with test card</p>
						</div>

						{/* Cardholder Name */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
							<input
								type="text"
								name="cardName"
								value={formData.cardName}
								onChange={handleInputChange}
								placeholder="Your Name"
								className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
							/>
						</div>

						{/* Expiry & CVV */}
						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
								<input
									type="text"
									name="expiryMonth"
									value={formData.expiryMonth}
									onChange={handleInputChange}
									placeholder="12"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
									maxLength="2"
								/>
								<p className="text-xs text-gray-500 mt-1">MM</p>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
								<input
									type="text"
									name="expiryYear"
									value={formData.expiryYear}
									onChange={handleInputChange}
									placeholder="25"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
									maxLength="2"
								/>
								<p className="text-xs text-gray-500 mt-1">YY</p>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
								<input
									type="text"
									name="cvv"
									value={formData.cvv}
									onChange={handleInputChange}
									placeholder="123"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-black"
									maxLength="3"
								/>
								<p className="text-xs text-gray-500 mt-1">3 digits</p>
							</div>
						</div>

						{/* Info Box */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
							<p className="text-xs text-blue-800">
								<strong>Demo Payment:</strong> This is a test payment gateway. No real charges will be made. Use any valid card format.
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								onClick={handlePayment}
								disabled={processing}
								className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
							>
								{processing ? '🔄 Processing...' : `✓ Pay $${total.toFixed(2)}`}
							</button>
							<button
								onClick={() => navigate('/checkout', { state: { items: orderData.items } })}
								disabled={processing}
								className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
							>
								Back
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
							<strong>Test Mode:</strong> Enter any card details. This is a simulation for demonstration purposes only.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
