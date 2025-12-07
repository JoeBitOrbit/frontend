import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { syncCartCount } from '../../utils/cart';
import { setItem as safeSetItem, getItem } from '../../utils/safeStorage';
import { playPaymentCelebration } from '../../utils/cardAnimations';

export default function PaymentPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const orderData = location.state?.orderData;
	
	const [processing, setProcessing] = useState(false);
	const [cardNumber, setCardNumber] = useState('');
	const [cardName, setCardName] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvv, setCvv] = useState('');

	useEffect(() => {
		if (!orderData || !orderData.items || orderData.items.length === 0) {
			toast.error('No order data found. Please start over.');
			navigate('/cart');
		}
	}, [orderData, navigate]);

	const handlePayment = async () => {
		// Validate fields
		if (!cardNumber || !cardName || !expiry || !cvv) {
			return toast.error('Please fill all payment fields');
		}

		setProcessing(true);

		// Simulate payment processing
		await new Promise(resolve => setTimeout(resolve, 2000));

		try {
			let token = '';
			try { 
				token = getItem('token') || ''; 
			} catch(e) { 
				// Silently fail - storage might not be available
				token = '';
			}
			
			// Place the order after "successful" payment
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
				console.log('Order API call error:', apiError.message);
				throw apiError;
			}

			// Clear cart using safe storage (avoids restricted-context errors)
			// Each operation wrapped separately to prevent cascade failures
			try { 
				safeSetItem('cart', JSON.stringify([])); 
			} catch (_) { 
				// ignore 
			}
			
			try { 
				syncCartCount(); 
			} catch (_) { 
				// ignore 
			}
			
			try { 
				window.dispatchEvent(new Event('cart:updated')); 
			} catch (_) { 
				// ignore 
			}

			toast.success('Payment successful! Order placed.');
			setProcessing(false);
			
			// Play celebration animation before navigating
			try {
				await playPaymentCelebration();
			} catch (_) {
				// Animation error shouldn't block navigation
			}
			
			navigate('/products');
		} catch (err) {
			console.log('Payment error:', err.message);
			toast.error('Failed to place order. Please try again.');
			setProcessing(false);
		}
	};

	const total = orderData?.items?.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0) || 0;

	if (!orderData || !orderData.items || orderData.items.length === 0) {
		return (
			<div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h2>
					<p className="text-gray-600 mb-6">Please go back and add items to your cart.</p>
					<button 
						onClick={() => navigate('/cart')}
						className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
					>
						Back to Cart
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
			<div className="max-w-2xl w-full">
				{/* Warning Banner */}
				<div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm text-yellow-700 font-semibold">
								⚠️ DEMO PAYMENT SYSTEM - This is a fake payment gateway for testing purposes only.
							</p>
							<p className="text-xs text-yellow-600 mt-1">
								Real payment integration is in progress. No actual charges will be made.
							</p>
						</div>
					</div>
				</div>

				{/* Payment Form */}
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h2 className="text-2xl font-bold text-black mb-6">Payment Details</h2>

					{/* Order Summary */}
					<div className="mb-6 p-4 bg-gray-50 rounded-lg">
						<h3 className="font-semibold text-black mb-2">Order Summary</h3>
						<div className="space-y-1 text-sm">
							{orderData.items.map((item, idx) => (
								<div key={idx} className="flex justify-between text-gray-700">
									<span>{item.name} x {item.qty}</span>
									<span>${(item.price * item.qty).toFixed(2)}</span>
								</div>
							))}
							<div className="border-t pt-2 mt-2 flex justify-between font-bold text-black">
								<span>Total:</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>
					</div>

					{/* Card Details */}
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
							<input
								type="text"
								value={cardNumber}
								onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
								placeholder="1234 5678 9012 3456"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
								maxLength="16"
							/>
							<p className="text-xs text-gray-500 mt-1">Use any 16-digit number (fake)</p>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
							<input
								type="text"
								value={cardName}
								onChange={e => setCardName(e.target.value)}
								placeholder="John Doe"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
								<input
									type="text"
									value={expiry}
									onChange={e => {
										let val = e.target.value.replace(/\D/g, '');
										if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
										setExpiry(val);
									}}
									placeholder="MM/YY"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
									maxLength="5"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
								<input
									type="text"
									value={cvv}
									onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
									placeholder="123"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
									maxLength="3"
								/>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-8 flex gap-4">
						<button
							onClick={handlePayment}
							disabled={processing}
							className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{processing ? 'Processing...' : `Pay රු ${total.toFixed(2)}`}
						</button>
						<button
							onClick={() => navigate('/checkout', { state: { items: orderData.items } })}
							disabled={processing}
							className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
						>
							Cancel
						</button>
					</div>

					{/* Test Card Info */}
					<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<p className="text-xs text-blue-800">
							<strong>Test Mode:</strong> Enter any card details. This is a simulation for demonstration purposes only.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
