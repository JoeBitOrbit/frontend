import { Link, useNavigate } from "react-router-dom";
import { addToCart, addCountToCart } from '../utils/cart';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/wishlist';
import { playCardPackAnimation, playCartJourneyAnimation, playWishlistRemoveAnimation } from '../utils/cardAnimations';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { useHoliday } from '../context/HolidayContext';

function Stars({ value, size = 12 }) {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(
			<span key={i} style={{ fontSize: size }} className={i <= Math.round(value) ? 'text-yellow-400' : 'text-neutral-600'}>
				★
			</span>
		);
	}
	return <span className="flex gap-1">{stars}</span>;
}

export default function ProductCard({ product }) {
	const discount = product.labelledPrice > product.price;
	const [inWishlist, setInWishlist] = useState(false);
	const cardRef = useRef(null);
	const navigate = useNavigate();
	const productId = product._id || product.productId;
	const { holidayMode, discount: holidayDiscount } = useHoliday();
	
	useEffect(() => {
		setInWishlist(isInWishlist(productId));
	}, [productId]);
	
	function handleWishlistToggle(e) {
		e.preventDefault();
		e.stopPropagation();
		
		const heartButton = e.currentTarget;
		
		if (inWishlist) {
			playWishlistRemoveAnimation(heartButton, () => {
				const result = removeFromWishlist(productId);
				if (result.success) {
					setInWishlist(false);
					toast.success("Removed from wishlist");
					window.dispatchEvent(new Event('wishlist:updated'));
				}
			});
		} else {
			const result = addToWishlist(product);
			if (result.success) {
				setInWishlist(true);
				
				// Add 3D animation to heart button
				heartButton.classList.add('animate-heartBeat3D');
				setTimeout(() => heartButton.classList.remove('animate-heartBeat3D'), 800);
				
				// Create floating heart animation
				const rect = heartButton.getBoundingClientRect();
				const floatingHeart = document.createElement('div');
				floatingHeart.innerHTML = '♥';
				floatingHeart.className = 'animate-floatToWishlist text-4xl text-red-600';
				floatingHeart.style.left = `${rect.left + rect.width / 2}px`;
				floatingHeart.style.top = `${rect.top + rect.height / 2}px`;
				
				// Calculate direction to wishlist icon (top right of screen)
				const wishlistIcon = document.querySelector('[href="/wishlist"]');
				if (wishlistIcon) {
					const wishlistRect = wishlistIcon.getBoundingClientRect();
					const dx = wishlistRect.left - rect.left;
					const dy = wishlistRect.top - rect.top;
					floatingHeart.style.setProperty('--float-x', `${dx}px`);
					floatingHeart.style.setProperty('--float-y', `${dy}px`);
				}
				
				document.body.appendChild(floatingHeart);
				setTimeout(() => floatingHeart.remove(), 1000);
				
				toast.success("Added to wishlist");
				window.dispatchEvent(new Event('wishlist:updated'));
			} else {
				toast.error(result.message);
			}
		}
	}
	
	function handleQuickAdd(e){
		e.preventDefault();
		e.stopPropagation();
		const cardElement = cardRef.current;
		if (!cardElement) return;
		
		   // Add to cart first
		   try { 
			   addToCart(product, 1); 
		   } catch (err) { 
			   console.error('addToCart failed', err); 
		   }
		try{ addCountToCart(1, product.price || 0); }catch(err){}
		
		// Play cart journey animation
		playCartJourneyAnimation(cardElement, product).then(() => {
			toast.success('Added to cart');
		});
	}
	
	function handleCardClick(e) {
		// Don't trigger if clicking buttons
		if (e.target.closest('button')) return;
		
		const cardElement = cardRef.current;
		if (!cardElement) return;
		// Show loader before card animation
		try{ window.dispatchEvent(new CustomEvent('loader:show', { detail: { duration: 900 } })); }catch(_){ }
		
		// Play card pack animation then navigate
		playCardPackAnimation(cardElement, () => {
			navigate(`/overview/${productId}`);
		});
	}

	return (
		<div
			ref={cardRef}
			onClick={handleCardClick}
			className={`group w-full h-[360px] flex flex-col shrink-0 rounded-2xl overflow-hidden border transition relative hover-lift cursor-pointer bg-white border-gray-200 hover:border-red-600 hover:shadow-xl`}
		>
			{(discount || holidayMode) && (
				<span className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full shadow z-10 bg-red-600">
					{holidayMode ? `${holidayDiscount}% OFF` : discount ? 'Sale' : ''}
				</span>
			)}
			
			{/* Wishlist heart button */}
			<button 
				onClick={handleWishlistToggle} 
				className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition z-10"
				style={{ color: inWishlist ? '#dc2626' : '#9ca3af' }}
			>
				<span className="text-2xl">{inWishlist ? '♥' : '♡'}</span>
			</button>
			
			<div className="w-full h-[220px] bg-white flex items-center justify-center overflow-hidden smooth relative">
				<img
					src={product.images[0]}
					alt={product.name}
					className="w-full h-full object-cover img-pop floaty"
					loading="lazy"
				/>

				{/* Quick add button overlay (inside image area to avoid overlapping price) */}
				<button 
					onClick={handleQuickAdd} 
					className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-2 rounded-md shadow hover:scale-105 transform transition opacity-0 group-hover:opacity-100"
				>
					Add
				</button>
			</div>
			<div className="flex flex-col p-4 gap-2">
				<div className="flex justify-between items-start">
					<span className="text-neutral-400 text-[11px] tracking-wide">{product._id}</span>
					{product.category && (
						<span className="text-[10px] px-2 py-1 rounded-md bg-gray-100 border border-gray-300 group-hover:border-red-600 transition-colors text-gray-700">
							{product.category}
						</span>
					)}
				</div>
				<h2 className="text-sm font-semibold leading-snug line-clamp-2">{product.name}</h2>

				<div className="flex items-center justify-between mt-2">
					<div className="flex items-center gap-2">
						<Stars value={product.ratingAvg || 0} size={12} />
						<span className="text-[11px] text-neutral-500">({product.ratingCount || 0})</span>
					</div>
					<div className="flex flex-col items-end">
						{discount ? (
							<>
								<span className="text-xs line-through text-neutral-400">
									රු {product.labelledPrice.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
								<span className="text-sm font-bold text-red-600">
									රු {product.price.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</>
						) : (
							<span className="text-sm font-bold">
								රු {product.price.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
