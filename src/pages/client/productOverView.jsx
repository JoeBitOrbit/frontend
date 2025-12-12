import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageSlider";
import { addToCart, getCart } from "../../utils/cart";
import { playCartJourneyAnimation, playStarSmash, playStarRain } from "../../utils/cardAnimations";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../../utils/wishlist";
import toast from "react-hot-toast";
import { listReviews as apiListReviews, addReview as apiAddReview, deleteReview as apiDeleteReview, addReplyToReview as apiAddReplyToReview, editReview } from "../../services/products";
import { isAdminToken } from '../../utils/auth';
import ProductCard from "../../components/productCard";
import ConfirmModal from "../../components/ConfirmModal";
import { getItem } from "../../utils/safeStorage.js";

export default function ProductOverViewPage() {
	const params = useParams();
	const [product, setProduct] = useState(null);
	const [reviewsData, setReviewsData] = useState({ reviews: [], total:0, page:1, pages:1, breakdown: {1:0,2:0,3:0,4:0,5:0} });
	const [related, setRelated] = useState([]);
	const [newRating, setNewRating] = useState(5);
	const [newName, setNewName] = useState('');
	const [newComment, setNewComment] = useState('');
	const [reviewsLoading, setReviewsLoading] = useState(false);
	const [reviewsPage, setReviewsPage] = useState(1);
	const [reviewsLimit] = useState(5);
	const [reviewsSort, setReviewsSort] = useState('newest');
	const [reviewsFilter, setReviewsFilter] = useState(null);
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");
	const [isAdmin, setIsAdmin] = useState(false);
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	const [inWishlist, setInWishlist] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [reviewToDelete, setReviewToDelete] = useState(null);
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [newEmail, setNewEmail] = useState('');
	const [hasPurchased, setHasPurchased] = useState(false);
	const [replyToReview, setReplyToReview] = useState({});
	const [replyText, setReplyText] = useState({});
	const [editingReviewId, setEditingReviewId] = useState(null);
	const [editRating, setEditRating] = useState(5);
	const [editName, setEditName] = useState('');
	const [editComment, setEditComment] = useState('');
	const starContainerRef = useRef(null);

	useEffect(()=>{ loadProduct(); }, []);

	useEffect(()=>{
		setIsAdmin(isAdminToken());
	}, []);

	async function loadProduct(){
		setStatus('loading');
		try{
			const res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/${params.productId}`);
			setProduct(res.data);
			setInWishlist(isInWishlist(res.data._id || res.data.productId));
			setHasPurchased(true);
			
			const token = getItem('token');
			if (token) {
				try {
					const ordersRes = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/orders', {
						headers: { Authorization: `Bearer ${token}` }
					});
					const purchased = ordersRes.data.some(order => 
						order.items.some(item => String(item.productId) === String(res.data._id))
					);
					if (purchased) setHasPurchased(true);
				} catch (err) {
					// Could not check purchase history
				}
			}
			if(res.data?.category){
				axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products?category=${res.data.category}`)
					.then(rr => setRelated(rr.data.filter(p => String(p._id) !== String(res.data._id)).slice(0,6)))
					.catch(()=>{});
			}
			setStatus('success');
			setReviewsPage(1);
			await loadReviews(1, reviewsLimit, reviewsSort, reviewsFilter);
		}catch(e){
			toast.error('Failed to load product');
			setStatus('error');
		}
	}

	async function loadReviews(page = 1, limit = 5, sort = 'newest', rating = null){
		setReviewsLoading(true);
		try{
			const paramsObj = { page, limit, sort };
			if(rating) paramsObj.rating = rating;
			const r = await apiListReviews(params.productId, paramsObj);
			setReviewsData(r.data);
			setReviewsPage(r.data.page || page);
		}catch(e){
			// Failed to load reviews
		}
		setReviewsLoading(false);
	}

	async function submitReview(){
		try{
			if(!newRating || newRating < 1) return toast.error('Please select a rating');
			if(!newEmail || !newEmail.trim()) return toast.error('Email is required');
			if(!newComment || !newComment.trim()) return toast.error('Review comment is required');
			
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if(!emailRegex.test(newEmail)) return toast.error('Please enter a valid email address');
			
			if(!hasPurchased) {
				return toast.error('Only verified buyers can leave reviews');
			}
			
			await apiAddReview(params.productId, { name: newName || 'Anonymous', rating: newRating, comment: newComment, email: newEmail });
			
			playStarRain(2000);
			
			setNewName(''); setNewComment(''); setNewRating(5); setNewEmail('');
			setShowReviewForm(false);
			setStatus('loading');
			await loadProduct();
			toast.success('Review submitted');
		}catch(e){
			console.error('Review submission error:', e);
			toast.error(e.response?.data?.message || e.message || 'Failed to submit review');
		}
	}

	async function submitReply(reviewId) {
		try {
			const comment = replyText[reviewId];
			if (!comment || !comment.trim()) {
				return toast.error('Reply cannot be empty');
			}
			
			await apiAddReplyToReview(params.productId, reviewId, { comment });
			setReplyText({ ...replyText, [reviewId]: '' });
			setReplyToReview({ ...replyToReview, [reviewId]: false });
			await loadReviews(reviewsPage, reviewsLimit, reviewsSort, reviewsFilter);
			toast.success('Reply added');
		} catch (e) {
			toast.error('Failed to add reply');
		}
	}

	function startEditReview(review) {
		setEditingReviewId(review._id);
		setEditRating(review.rating);
		setEditName(review.name);
		setEditComment(review.comment);
	}

	async function submitEditReview(reviewId) {
		try {
			if (!editRating || editRating < 1) return toast.error('Please select a rating');
			if (!editComment || !editComment.trim()) return toast.error('Review comment is required');

			await editReview(params.productId, reviewId, {
				email: newEmail,
				name: editName,
				rating: editRating,
				comment: editComment
			});

			setEditingReviewId(null);
			await loadReviews(reviewsPage, reviewsLimit, reviewsSort, reviewsFilter);
			toast.success('Review updated');
		} catch (e) {
			console.error('Edit review error:', e);
			toast.error(e.response?.data?.message || 'Failed to update review');
		}
	}

	async function handleDeleteReview(review) {
		try {
			await apiDeleteReview(params.productId, review._id, review.email);
			toast.success('Review deleted');
			setStatus('loading');
			await loadProduct();
		} catch (e) {
			console.error('Delete review error:', e);
			toast.error(e.response?.data?.message || 'Failed to delete review');
		}
	}

	return (
		<div className="w-full min-h-screen bg-white text-black">
			{status === "loading" && <Loader />}
			{status === "success" && (
				<div className="w-full flex flex-col">
				<div className="w-full flex justify-center px-4 md:px-12 py-8">
					<div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
						{/* Left: Image Slider */}
						<div className="flex justify-center">
							<ImageSlider images={product.images} />
						</div>
						
						{/* Right: Product Details */}
						<div className="flex flex-col gap-6">
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<span className="uppercase tracking-wide">{product.category || 'ALL'}</span>
							</div>
							
							<h1 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-wide">
								{product.name}
							</h1>
							
							<p className="text-xs md:text-sm text-gray-600 font-medium">
								{product.altNames && product.altNames.length > 0 ? product.altNames.join(" • ") : product._id}
							</p>
							
							<div className="flex items-baseline gap-4">
								{product.labelledPrice > product.price ? (
									<>
										<span className="text-2xl md:text-3xl font-bold text-black">
											{product.price.toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
										<span className="text-lg text-gray-400 line-through">
											{product.labelledPrice.toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</>
								) : (
									<span className="text-2xl md:text-3xl font-bold text-black">
										{product.price.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								)}
							</div>
							
							{product.stock && product.stock < 5 && (
								<div className="flex items-center gap-2">
									<div className="h-2 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden">
										<div className="h-full bg-gradient-to-r from-red-500 to-orange-400" style={{width: `${(product.stock / 10) * 100}%`}}></div>
									</div>
									<span className="text-xs md:text-sm text-red-600 font-medium whitespace-nowrap">Hurry! Only {product.stock} left!</span>
								</div>
							)}
							
							<div className="mt-2 pt-4 border-t border-gray-200">
								<h3 className="text-sm font-semibold text-black mb-3">Size</h3>
								<div className="flex flex-wrap gap-2">
									{['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16'].map(size => (
										<button
											key={size}
											onClick={() => setSelectedSize(size)}
											className={`px-3 py-1.5 text-xs md:text-sm border-2 rounded-md font-medium transition ${
												selectedSize === size
													? 'border-black bg-black text-white'
													: 'border-gray-300 bg-white text-black hover:border-black'
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
							
							<div className="pt-2">
								<h3 className="text-sm font-semibold text-black mb-3">Color</h3>
								<div className="flex gap-3">
									<button
										onClick={() => setSelectedColor('blue')}
										className={`w-10 h-10 rounded-md border-2 transition ${
											selectedColor === 'blue' ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'
										}`}
										style={{backgroundColor: '#4169E1'}}
										title="Blue"
									/>
									<button
										onClick={() => setSelectedColor('black')}
										className={`w-10 h-10 rounded-md border-2 transition ${
											selectedColor === 'black' ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'
										}`}
										style={{backgroundColor: '#000000'}}
										title="Black"
									/>
									<button
										onClick={() => setSelectedColor('white')}
										className={`w-10 h-10 rounded-md border-2 transition ${
											selectedColor === 'white' ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'
										}`}
										style={{backgroundColor: '#FFFFFF'}}
										title="White"
									/>
								</div>
							</div>
							
							<div className="flex flex-col sm:flex-row gap-3 mt-4">
								<button
									onClick={() => {
										navigate("/checkout", {
											state: {
												items: [
													{
														productId: product._id,
														quantity: 1,
														name: product.name,
														image: product.images[0],
														price: product.price,
													},
												],
											},
										});
									}}
									className="flex-1 px-6 py-3 md:py-4 rounded-lg bg-red-600 text-white font-bold text-sm md:text-lg tracking-wide hover:bg-red-700 active:bg-red-800 transition shadow-md hover:shadow-lg"
								>
									Buy Now
								</button>
								<button
									className="flex-1 px-6 py-3 md:py-4 rounded-lg border-2 border-red-600 bg-white text-red-600 font-bold text-sm md:text-lg tracking-wide hover:bg-red-50 active:bg-red-100 transition shadow-md hover:shadow-lg"
									onClick={(e) => {
										addToCart(product, 1);
										const container = document.querySelector('.product-main');
										const element = container || e.currentTarget.closest('.w-full');
										if (element) {
											playCartJourneyAnimation(element, product).then(() => {
												toast.success('Product added to cart');
											});
										} else {
											toast.success('Product added to cart');
										}
									}}
								>
									Add to Cart
								</button>
							</div>
							
							<button 
								onClick={() => {
									if (inWishlist) {
										const result = removeFromWishlist(product._id);
										if (result.success) {
											setInWishlist(false);
											toast.success("Removed from wishlist");
											window.dispatchEvent(new Event('wishlist:updated'));
										}
									} else {
										const result = addToWishlist(product);
										if (result.success) {
											setInWishlist(true);
											toast.success("Added to wishlist");
											window.dispatchEvent(new Event('wishlist:updated'));
										}
									}
								}}
								className="w-full px-6 py-3 text-center text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition"
							>
								{inWishlist ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
							</button>
							
							<p className="text-xs md:text-sm text-gray-700 leading-relaxed">
								{product.description}
							</p>
						</div>
					</div>
				</div>

				<div className="w-full max-w-6xl mx-auto mt-10 p-8 bg-gray-50 border border-gray-200 rounded-lg">
					<h3 className="text-xl font-bold mb-4 text-black">Product Details</h3>
					<div className="space-y-3 text-sm text-gray-700">
						<p><span className="font-semibold text-black">Material:</span> Premium cotton blend with superior comfort</p>
						<p><span className="font-semibold text-black">Care:</span> Cold wash, hang to dry. Iron on low heat if needed</p>
						<p><span className="font-semibold text-black">Quality:</span> Made with attention to detail and craftsmanship</p>
					</div>
						<div className="mt-6 pt-6 border-t border-gray-200">
							<h4 className="font-bold text-black mb-3">Frequently Asked Questions</h4>
							<div className="space-y-3 text-sm text-gray-700">
								<div>
									<p className="font-semibold text-black">How does sizing run?</p>
									<p className="mt-1">We recommend your usual size for most items. Check our size guide for specific measurements.</p>
								</div>
								<div>
									<p className="font-semibold text-black">Do you ship internationally?</p>
									<p className="mt-1">Yes — we ship worldwide. International shipping rates apply at checkout.</p>
								</div>
							</div>
						</div>
					</div>

					{related.length > 0 && (
						<div className="mt-16 w-full">
							<h3 className="text-3xl font-bold mb-10 text-black">You May Also Like</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
								{related.slice(0, 8).map(rp => (
									<ProductCard key={rp._id || rp.productId} product={rp} />
								))}
							</div>
						</div>
					)}					<div className="mt-12 w-full border-t border-gray-200 pt-12 -mx-6 px-6">
						<div className="max-w-4xl mx-auto">
							<div className="mb-8">
								{reviewsData.total === 0 ? (
								<>
									<h2 className="text-3xl font-bold text-black mb-4">Customer Reviews</h2>
									<div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
										<p className="text-lg text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
										<button 
											onClick={() => {
												setShowReviewForm(true);
												setTimeout(() => document.getElementById('review-form')?.scrollIntoView({behavior: 'smooth'}), 100);
											}}
											className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
										>
											Write the First Review
										</button>
									</div>
								</>
								) : (
									<>
										<h2 className="text-3xl font-bold text-black mb-4">Customer Reviews</h2>
										<div className="flex items-center gap-4">
											<button 
												onClick={() => {
													setShowReviewForm(true);
													setTimeout(() => document.getElementById('review-form')?.scrollIntoView({behavior: 'smooth'}), 100);
												}}
												className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
											>
												Write a Review
											</button>
										</div>
									</>
								)}
							</div>
							
							{reviewsData.total > 0 && (
								<div className="mb-12">
									<div className="flex items-center justify-between mb-6">
										<div className="flex items-center gap-4">
											<div className="text-yellow-500 text-2xl">
												{'★'.repeat(Math.round(product.ratingAvg || 0))}{'☆'.repeat(5 - Math.round(product.ratingAvg || 0))}
											</div>
											<span className="text-gray-600">{product.ratingAvg || 0} average — {product.ratingCount || 0} ratings</span>
										</div>
										<select 
											value={reviewsSort} 
											onChange={e=>{ setReviewsSort(e.target.value); loadReviews(1,reviewsLimit,e.target.value,reviewsFilter); }} 
											className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
										>
											<option value="newest">Newest</option>
											<option value="highest">Highest rating</option>
										</select>
									</div>

									<div className="space-y-6">
										{reviewsLoading && <div className="text-sm text-gray-500">Loading reviews...</div>}
										{!reviewsLoading && reviewsData.reviews.length === 0 && <div className="text-sm text-gray-500">No reviews yet</div>}
										{!reviewsLoading && reviewsData.reviews.map(r => (
											<div key={r._id} className="border-b border-gray-200 pb-6">
												<div className="flex items-start justify-between mb-2">
													<div className="flex-1">
														<div className="flex items-center gap-3 mb-1">
															<span className="font-semibold text-black">{r.name || 'Anonymous'}</span>
															{r.verifiedPurchase && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>}
														</div>
														<div className="text-yellow-500 mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
														<div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
													</div>
													<div className="flex items-center gap-2">
														<button 
															onClick={() => startEditReview(r)}
															className="text-xs text-blue-600 hover:text-blue-800 font-medium"
														>
															Edit
														</button>
														<button 
															onClick={() => handleDeleteReview(r)}
															className="text-xs text-red-600 hover:text-red-800 font-medium"
														>
															Delete
														</button>
														{isAdmin && (
															<button 
																onClick={()=>{
																	setReviewToDelete(r);
																	setDeleteModalOpen(true);
																}} 
																className="text-xs text-red-600 hover:text-red-800 font-medium"
															>
																Admin Delete
															</button>
														)}
													</div>
												</div>

												{editingReviewId === r._id ? (
													<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
														<h4 className="font-semibold text-black mb-3">Edit Your Review</h4>
														
														<div className="mb-3">
															<label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
															<div className="flex gap-1">
																{[1,2,3,4,5].map(star => (
																	<button
																		key={star}
																		onClick={() => setEditRating(star)}
																		className="text-2xl focus:outline-none"
																	>
																		<span className={star <= editRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
																	</button>
																))}
															</div>
														</div>

														<div className="mb-3">
															<label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
															<input 
																value={editName} 
																onChange={e => setEditName(e.target.value)} 
																className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
															/>
														</div>

														<div className="mb-3">
															<label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
															<textarea 
																value={editComment} 
																onChange={e => setEditComment(e.target.value)} 
																className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-24" 
															/>
														</div>

														<div className="flex gap-2">
															<button 
																onClick={() => submitEditReview(r._id)}
																className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
															>
																Save Changes
															</button>
															<button 
																onClick={() => setEditingReviewId(null)}
																className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition"
															>
																Cancel
															</button>
														</div>
													</div>
												) : (
													<p className="text-sm text-gray-700 mb-3">{r.comment}</p>
												)}
												
												{r.replies && r.replies.length > 0 && (
													<div className="ml-6 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
														{r.replies.map((reply, idx) => (
															<div key={idx} className="bg-gray-50 p-3 rounded-md">
																<div className="flex items-center gap-2 mb-1">
																	<span className="text-sm font-semibold text-black">{reply.name}</span>
																	{reply.isAdmin && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Admin</span>}
																</div>
																<p className="text-sm text-gray-700">{reply.comment}</p>
																<span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
															</div>
														))}
													</div>
												)}
												
												{!editingReviewId || editingReviewId !== r._id ? (
													<button 
														onClick={() => setReplyToReview({ ...replyToReview, [r._id]: !replyToReview[r._id] })}
														className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
													>
														{replyToReview[r._id] ? 'Cancel Reply' : 'Reply'}
													</button>
												) : null}
												
												{replyToReview[r._id] && (
													<div className="mt-3 ml-6">
														<textarea
															value={replyText[r._id] || ''}
															onChange={e => setReplyText({ ...replyText, [r._id]: e.target.value })}
															placeholder="Write your reply..."
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
															rows="3"
														/>
														<button
															onClick={() => submitReply(r._id)}
															className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
														>
															Submit Reply
														</button>
													</div>
												)}
											</div>
										))}
									</div>

									{reviewsData.pages > 1 && (
										<div className="flex items-center justify-center gap-3 mt-6">
											<button 
												disabled={reviewsData.page <= 1} 
												onClick={()=> loadReviews(reviewsData.page - 1, reviewsLimit, reviewsSort, reviewsFilter)} 
												className="px-4 py-2 rounded-md bg-gray-100 disabled:opacity-50"
											>
												Prev
											</button>
											<span className="text-sm text-gray-700">Page {reviewsData.page} of {reviewsData.pages}</span>
											<button 
												disabled={reviewsData.page >= reviewsData.pages} 
												onClick={()=> loadReviews(reviewsData.page + 1, reviewsLimit, reviewsSort, reviewsFilter)} 
												className="px-4 py-2 rounded-md bg-gray-100 disabled:opacity-50"
											>
												Next
											</button>
										</div>
									)}
								</div>
							)}
							
				{showReviewForm && (
				<div id="review-form" className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
					<h3 className="text-xl font-bold text-black mb-4">Share your experience</h3>
					{!hasPurchased && (
						<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<p className="text-sm text-yellow-800">⚠️ Only verified buyers who have purchased this product can leave reviews.</p>
						</div>
					)}
					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
						<div ref={starContainerRef} className="flex gap-1">
							{[1,2,3,4,5].map(star => (
								<button
									key={star}
									onClick={() => {
										setNewRating(star);
										if (starContainerRef.current) {
											const stars = starContainerRef.current.querySelectorAll('button');
											stars.forEach((btn, idx) => {
												if (idx < star) {
													btn.querySelector('span').style.animation = `starSmash 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${idx * 0.1}s forwards`;
												}
											});
										}
									}}
									className="text-3xl focus:outline-none star-rating"
								>
									<span className={star <= newRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
								</button>
							))}
						</div>
					</div>
					
					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Name*</label>
						<input 
							value={newName} 
							onChange={e=>setNewName(e.target.value)} 
							className="w-full px-4 py-2 border border-gray-300 rounded-md" 
							placeholder="Enter your name"
						/>
					</div>
					
					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-700 mb-2">E-mail*</label>
						<input 
							type="email"
							value={newEmail}
							onChange={e=>setNewEmail(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-md" 
							placeholder="your@email.com"
							required
						/>
					</div>
					
					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Review*</label>
						<textarea 
							value={newComment} 
							onChange={e=>setNewComment(e.target.value)} 
							className="w-full px-4 py-2 border border-gray-300 rounded-md h-32" 
							placeholder="Write your review"
						/>
					</div>
					
					<div className="flex gap-3">
						<button 
							onClick={submitReview} 
							className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
						>
							Submit Review
						</button>
						<button 
							onClick={() => {
								setShowReviewForm(false);
								setNewName('');
								setNewComment('');
								setNewRating(5);
							}}
							className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
						>
							Cancel
						</button>
					</div>
				</div>
				)}
						</div>
					</div>
				</div>
			)}
			{status === "error" && <div className="p-6 text-center text-red-600">Error loading product</div>}
			
			<ConfirmModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={async () => {
					try {
						await apiDeleteReview(params.productId, reviewToDelete._id);
						toast.success('Review deleted');
						setStatus('loading');
						await loadProduct();
					} catch (e) {
						toast.error('Failed to delete review');
					}
				}}
				title="Delete Review"
				message="Are you sure you want to delete this review? This action cannot be undone."
			/>
		</div>
	);
}
