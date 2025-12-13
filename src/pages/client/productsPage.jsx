import axios from "axios";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";
import ProductSkeleton from "../../components/productSkeleton";
import Footer from "../../components/Footer";

import { FiShoppingBag } from "react-icons/fi";

function ProductsLoader({ fadeOut, products }) {
    const basketRef = useRef(null);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        let frame = 0;
        let anim;
        const animate = () => {
            if (basketRef.current) {
                const y = Math.abs(Math.sin(frame / 10)) * 24;
                basketRef.current.style.transform = `translateY(-${y}px) scale(1.15)`;
                basketRef.current.style.filter = `drop-shadow(0 0 24px #ffffff)`;
            }
            frame++;
            anim = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(anim);
    }, []);

    // 3D product rain effect
    useEffect(() => {
        if (!products || !Array.isArray(products) || products.length === 0) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fallingProducts = [];
        const productImages = products.slice(0, 20).map(p => p.images?.[0]).filter(Boolean);
        
        if (productImages.length === 0) return;
        
        // Create falling product objects
        for (let i = 0; i < 15; i++) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = productImages[Math.floor(Math.random() * productImages.length)] || '';
            
            fallingProducts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                speed: 2 + Math.random() * 3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 4,
                size: 40 + Math.random() * 40,
                opacity: 0.3 + Math.random() * 0.4,
                img: img,
                scale: 0.8 + Math.random() * 0.4,
                loaded: false,
            });
        }
        
        // Wait for images to load
        fallingProducts.forEach(product => {
            product.img.onload = () => {
                product.loaded = true;
            };
            product.img.onerror = () => {
                product.loaded = false;
            };
        });

        let animationId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            fallingProducts.forEach(product => {
                if (!product.loaded || !product.img.complete) return;
                
                ctx.save();
                ctx.globalAlpha = product.opacity;
                ctx.translate(product.x, product.y);
                ctx.rotate((product.rotation * Math.PI) / 180);
                ctx.scale(product.scale, product.scale);
                
                // Draw product image with 3D shadow effect
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
                
                try {
                    ctx.drawImage(product.img, -product.size / 2, -product.size / 2, product.size, product.size);
                } catch (e) {
                    // Ignore drawing errors for broken images
                }
                
                ctx.restore();
                
                // Update position
                product.y += product.speed;
                product.rotation += product.rotationSpeed;
                
                // Reset if off screen
                if (product.y > canvas.height + 100) {
                    product.y = -100;
                    product.x = Math.random() * canvas.width;
                }
            });
            
            animationId = requestAnimationFrame(draw);
        };
        
        draw();
        
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [products]);

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center" style={{ zIndex: 999999, opacity: fadeOut ? 0 : 1, transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1)' }}>
            <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.15 }} />
            <div className="relative z-10 flex flex-col items-center">
                <div ref={basketRef} className="text-red-600 text-[120px]" style={{ filter: 'drop-shadow(0 10px 30px rgba(220, 38, 38, 0.3))' }}>
                    <FiShoppingBag />
                </div>
                <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <div className="mt-6 text-2xl font-bold text-black tracking-wide">Loading Products</div>
                <div className="mt-2 text-sm text-gray-500 tracking-widest">Preparing your shopping experience...</div>
                <div className="mt-8 h-1 w-64 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
            </div>
        </div>
    );
}


	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fadeLoader, setFadeLoader] = useState(false);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [categories, setCategories] = useState([]);
	const [pendingSearch, setPendingSearch] = useState(query);
	const [searchParams,setSearchParams] = useSearchParams();
	const [glowingCard, setGlowingCard] = useState(null);

  // Debounce search input
  useEffect(()=>{
    const id = setTimeout(()=> setQuery(pendingSearch), 400);
    return ()=> clearTimeout(id);
  }, [pendingSearch]);

	useEffect(() => {
		const base = import.meta.env.VITE_BACKEND_URL;
		const endpoint = query ? `/api/products/search/${query}` : `/api/products`;
		const url = base + endpoint + (category !== 'all' ? (query ? `?category=${category}` : `?category=${category}`) : '');
		axios.get(url).then(res => {
			setProducts(Array.isArray(res.data) ? res.data : []);
			setTimeout(() => {
				setFadeLoader(true);
				setTimeout(() => setLoading(false), 600);
			}, 2000);
		}).catch((err)=> {
			toast.error('Failed to load products');
			setLoading(false);
		});
	}, [query, category]);

	useEffect(()=>{
		axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/categories')
			.then(r=> setCategories(Array.isArray(r.data) ? r.data : []))
			.catch(()=> toast.error('Failed to load categories'));
		const c = searchParams.get('category');
		if(c){ setCategory(c); }
	},[searchParams]);  const filtered = useMemo(()=> {
    if (!Array.isArray(products)) return [];
    if(category==='all') return products;
    return products.filter(p=> {
      if (!p.category || !Array.isArray(p.category)) return false;
      return p.category.some(cat => cat.toLowerCase() === category.toLowerCase());
    });
  }, [products, category]);

	return (
		<div className="w-full min-h-screen flex flex-col bg-white">
			{loading && <ProductsLoader fadeOut={fadeLoader} products={products} />}
			
			{/* Header Section */}
			<div className="w-full bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 sticky top-0 z-30">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Collection</h1>
					
					{/* Search and Filter Bar */}
					<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
						<div className="flex flex-col sm:flex-row gap-3 flex-1 md:flex-initial">
							<input
								type="text"
								placeholder="Search products..."
								value={pendingSearch}
								onChange={(e) => { setPendingSearch(e.target.value); setLoading(true); }}
								className="flex-1 h-[44px] border-2 border-gray-300 rounded-lg px-4 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-red-600 transition"
							/>
							<select
								value={category}
								onChange={(e)=> { const v=e.target.value; setCategory(v); setLoading(true); if(v==='all'){ searchParams.delete('category'); setSearchParams(searchParams); } else { searchParams.set('category', v); setSearchParams(searchParams); } }}
								className="h-[44px] border-2 border-gray-300 rounded-lg px-4 bg-white text-black focus:outline-none focus:border-red-600 transition"
							>
								<option value="all">All Categories</option>
								{categories.map(c=> <option key={c._id} value={c.slug}>{c.name}</option>)}
							</select>
						</div>
						<div className="text-sm text-gray-600 font-medium">
							{filtered.length} product{filtered.length !== 1 ? 's' : ''}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({length:8}).map((_,i)=> <ProductSkeleton key={i} />)}
					</div>
				) : filtered.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filtered.map(product => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="text-6xl mb-4">🔍</div>
						<h2 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
						<p className="text-gray-500 mb-8 text-center max-w-md">Try adjusting your search or filter to find what you're looking for</p>
						<button 
							onClick={() => { setQuery(''); setPendingSearch(''); setCategory('all'); }}
							className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
						>
							Clear Filters
						</button>
					</div>
				)}
			</div>

			{/* Info Section */}
			<section className="w-full bg-white border-t border-gray-200 mt-12">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
					<h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Nikola</h3>
					<div className="grid md:grid-cols-3 gap-6 mb-12">
						<div 
							onClick={() => setGlowingCard(glowingCard === 'curated' ? null : 'curated')}
							className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${glowingCard === 'curated' ? 'bg-white border-2 border-red-600 shadow-xl' : 'bg-white border-2 border-gray-200 hover:border-red-400'}`}>
							<div className={`absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
							<div className="relative z-10">
								<div className="text-4xl mb-4">✨</div>
								<h4 className="font-bold text-lg mb-3 text-gray-900">Quality First</h4>
								<p className="text-gray-600 leading-relaxed">We source and craft products with uncompromising attention to detail.</p>
							</div>
						</div>
						<div 
							onClick={() => setGlowingCard(glowingCard === 'returns' ? null : 'returns')}
							className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${glowingCard === 'returns' ? 'bg-white border-2 border-red-600 shadow-xl' : 'bg-white border-2 border-gray-200 hover:border-red-400'}`}>
							<div className={`absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
							<div className="relative z-10">
								<div className="text-4xl mb-4">🎨</div>
								<h4 className="font-bold text-lg mb-3 text-gray-900">Modern Design</h4>
								<p className="text-gray-600 leading-relaxed">Aesthetic, functional, and timeless pieces for everyday use.</p>
							</div>
						</div>
						<div 
							onClick={() => setGlowingCard(glowingCard === 'sustainable' ? null : 'sustainable')}
							className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${glowingCard === 'sustainable' ? 'bg-white border-2 border-red-600 shadow-xl' : 'bg-white border-2 border-gray-200 hover:border-red-400'}`}>
							<div className={`absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
							<div className="relative z-10">
								<div className="text-4xl mb-4">🛡️</div>
								<h4 className="font-bold text-lg mb-3 text-gray-900">Secure Experience</h4>
								<p className="text-gray-600 leading-relaxed">Protected accounts, encrypted access, and reliable order tracking.</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white p-8 rounded-lg border border-gray-200">
						<h4 className="text-xl font-bold text-gray-900 mb-6">Quick Answers</h4>
						<div className="grid md:grid-cols-3 gap-8 text-sm">
							<div>
								<p className="font-semibold text-gray-900 mb-2">📦 Shipping</p>
								<p className="text-gray-600">Standard delivery in 3-7 business days. Express options available.</p>
							</div>
							<div>
								<p className="font-semibold text-gray-900 mb-2">💳 Payments</p>
								<p className="text-gray-600">Secure checkout with major cards, PayPal, and encrypted gateways.</p>
							</div>
							<div>
								<p className="font-semibold text-gray-900 mb-2">📞 Support</p>
								<p className="text-gray-600">Reach us via the contact page for fast, friendly order assistance.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
