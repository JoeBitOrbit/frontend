import { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { IoMdInformationCircleOutline, IoMdContact } from "react-icons/io";
import { MdOutlineReviews, MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { syncCartCount } from "../utils/cart";
import { isAdminToken } from "../utils/auth";
import { getItem, removeItem } from "../utils/safeStorage.js";

export default function Header() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [token, setToken] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [isAdmin, setIsAdmin] = useState(false);

	// Initialize state from storage
	useEffect(() => {
		setToken(getItem('token'));
		setCartCount(Number(getItem('cartCount') || 0));
		syncCartCount();
		setIsAdmin(isAdminToken());
	}, []);

	useEffect(()=>{
		function updateWishlistCount(){
			try{
				const wishlist = JSON.parse(getItem('wishlist') || '[]');
				setWishlistCount(wishlist.length);
			}catch(e){
				setWishlistCount(0);
			}
		}
		updateWishlistCount();
		function onUpdate(){ updateWishlistCount(); }
		if(typeof window !== 'undefined'){
			window.addEventListener('wishlist:updated', onUpdate);
			window.addEventListener('storage', onUpdate);
			return ()=> {
				window.removeEventListener('wishlist:updated', onUpdate);
				window.removeEventListener('storage', onUpdate);
			};
		}
	},[]);

	useEffect(()=>{
		function onUpdate(e){ setCartCount( Number(getItem('cartCount') || 0) ); }
		if(typeof window !== 'undefined'){
			window.addEventListener('cart:updated', onUpdate);
			return ()=> window.removeEventListener('cart:updated', onUpdate);
		}
	},[]);

	useEffect(()=>{
		// lock body scroll when mobile menu open to avoid overlap/scroll bleed
		if(isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return ()=> { document.body.style.overflow = ''; };
	}, [isOpen]);

	useEffect(()=>{
		function onKey(e){ if(e.key === 'Escape') setIsOpen(false) }
		document.addEventListener('keydown', onKey)
		return ()=> document.removeEventListener('keydown', onKey)
	},[])

	return (
		<header className="h-[100px] bg-white flex justify-center items-center relative shadow-sm z-40">
			{isOpen && (
				<div className="fixed z-[60] top-0 left-0 w-[100vw] h-[100vh] bg-white/95 backdrop-blur-sm">
					<div className="h-full w-[86vw] max-w-[340px] bg-white text-black flex flex-col shadow-2xl">
						<div className="w-full h-[100px] flex px-6 flex-row items-center justify-between border-b border-red-700/40">
							<GiHamburgerMenu className="text-red-600 text-4xl cursor-pointer" onClick={()=> setIsOpen(false)} />
							<img className="w-[120px] h-[60px] object-contain cursor-pointer" onClick={()=>{navigate('/'); setIsOpen(false)}} src="/logo.png" alt="Logo" />
						</div>
						<div className="w-full h-full flex flex-col p-6 items-start gap-5 overflow-y-auto">
							<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/') }}>
								<HiHome className="text-red-600 text-2xl mr-2" /> Home
							</button>
							<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/products') }}>
							<BiStore className="text-red-600 text-2xl mr-2" /> Products
						</button>
						<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/cart') }}>
							<FiShoppingBag className="text-red-600 text-2xl mr-2" /> Cart
							</button>
						<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/wishlist') }}>
							<FaRegHeart className="text-red-600 text-2xl mr-2" /> Wishlist
						</button>
						<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/reviews') }}>
							<MdOutlineReviews className="text-red-600 text-2xl mr-2" /> Reviews
						</button>
						<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/about-us') }}>
							<IoMdInformationCircleOutline className="text-red-600 text-2xl mr-2" /> About Us
						</button>
					<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/contact-us') }}>
						<IoMdContact className="text-red-600 text-2xl mr-2" /> Contact Us
					</button>
					{isAdmin && (
						<button className="text-black hover:text-red-600 text-lg flex flex-row items-center" onClick={()=>{ setIsOpen(false); navigate('/admin/products') }}>
							<MdAdminPanelSettings className="text-red-600 text-2xl mr-2" /> Admin Panel
						</button>
					)}
					<div className="border-t border-gray-200 w-full pt-5 mt-3">
								{!token && <button className="text-red-600 hover:text-red-700 text-lg font-semibold" onClick={()=>{navigate('/login'); setIsOpen(false)}}>Login</button>}
								{token && <button className="text-red-600 hover:text-red-700 text-lg font-semibold" onClick={()=>{removeItem('token'); removeItem('role'); setToken(null); navigate('/login'); setIsOpen(false)}}>Logout</button>}
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="w-full h-full flex items-center justify-between px-4 md:px-8">
				<div className="flex items-center gap-4">
					<GiHamburgerMenu className="text-red-600 text-3xl md:hidden cursor-pointer" onClick={()=> setIsOpen(true)} />
					<img className="w-[140px] h-[70px] md:w-[180px] md:h-[90px] object-contain cursor-pointer logo-shadow" onClick={()=> navigate('/')} src="/logo.png" alt="Logo" />
				</div>
				<div className="flex md:hidden items-center gap-4">
					<Link to="/wishlist" className="relative">
						<FaRegHeart className="text-black text-3xl hover:text-red-600 transition-colors" />
						{wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
					</Link>
					<Link to="/cart" className="relative" data-header-cart>
						<FiShoppingBag className="text-black text-3xl hover:text-red-600 transition-colors" />
						<span id="cart-badge" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
					</Link>
				</div>
			</div>
			<GiHamburgerMenu className="text-black text-4xl absolute md:hidden left-4 z-50 hidden" onClick={()=> setIsOpen(true)} />
			<div className="hidden md:flex w-full items-center px-8">
				{/* Center nav links */}
				<div className="flex-1 flex justify-center items-center gap-8">
					<Link to="/" className="text-black hover:text-red-600 text-lg nav-underline">Home</Link>
					<Link to="/products" className="text-black hover:text-red-600 text-lg nav-underline">Products</Link>
					<Link to="/reviews" className="text-black hover:text-red-600 text-lg nav-underline">Reviews</Link>
					<Link to="/about-us" className="text-black hover:text-red-600 text-lg nav-underline">About Us</Link>
					<Link to="/contact-us" className="text-black hover:text-red-600 text-lg nav-underline">Contact Us</Link>
				</div>
				{/* Right icons group */}
				<div className="flex items-center gap-6">
					{isAdmin && (
						<Link to="/admin/products" className="relative">
							<MdAdminPanelSettings className="text-black text-2xl hover:text-red-600 transition-colors" />
						</Link>
					)}
				<Link to="/wishlist" className="relative">
					<FaRegHeart className="text-black text-2xl hover:text-red-600 transition-colors" />
					{wishlistCount > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
				</Link>
					<Link to="/cart" className="relative" data-header-cart>
						<FiShoppingBag className="text-black text-2xl hover:text-red-600 transition-colors" />
						<span id="cart-badge" className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
					</Link>
					{!token && (
						<button className="text-black hover:text-red-600 text-lg" onClick={()=>{navigate('/login')}}>
							Login
						</button>
					)}
					{token && (
						<button className="text-black hover:text-red-600 text-lg" onClick={()=>{removeItem('token'); removeItem('role'); setToken(null); navigate('/login')}}>
							Logout
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
