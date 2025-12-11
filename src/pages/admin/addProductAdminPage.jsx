import axios from "axios";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { uploadFileViaBackend } from "../../utils/backendUpload";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { getItem, setItem, removeItem } from "../../utils/safeStorage.js";

function ProductDropAnimation({ imageUrl, onComplete }) {
    const boxRef = useRef(null);
    const productRef = useRef(null);
    const containerRef = useRef(null);
    const lidRef = useRef(null);
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        // Generate sparkle particles
        const particleArray = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            delay: Math.random() * 0.5,
            duration: 1 + Math.random() * 0.5,
            size: 4 + Math.random() * 8
        }));
        setParticles(particleArray);

        // Box slides in from right with 3D rotation
        if (containerRef.current) {
            containerRef.current.style.transform = 'translateX(100vw) perspective(1000px) rotateY(-45deg)';
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    containerRef.current.style.transform = 'translateX(0) perspective(1000px) rotateY(0deg)';
                }
            }, 100);
        }
        
        // Box lid opens
        setTimeout(() => {
            if (lidRef.current) {
                lidRef.current.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                lidRef.current.style.transform = 'rotateX(-120deg)';
            }
        }, 900);
        
        // Product drops with enhanced physics and bounce
        setTimeout(() => {
            if (productRef.current) {
                productRef.current.style.transition = 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s';
                productRef.current.style.transform = 'translateY(0) translateZ(20px) rotateX(720deg) rotateY(360deg) scale(1.1)';
                productRef.current.style.opacity = '1';
            }
        }, 1200);
        
        // Settle bounce
        setTimeout(() => {
            if (productRef.current) {
                productRef.current.style.transition = 'transform 0.3s ease-out';
                productRef.current.style.transform = 'translateY(0) translateZ(0) rotateX(720deg) rotateY(360deg) scale(1)';
            }
        }, 2300);
        
        // Everything glides left with 3D rotation and fades
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 1s ease-in, opacity 1s';
                containerRef.current.style.transform = 'translateX(-100vw) perspective(1000px) rotateY(45deg)';
                containerRef.current.style.opacity = '0';
            }
        }, 3200);
        
        // Cleanup
        setTimeout(() => {
            onComplete();
        }, 4200);
        
    }, [onComplete]);
    
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 999999, perspective: '1500px' }}>
            {/* Particle effects */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: 'radial-gradient(circle, #BE0108, #8C0009)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `sparkle ${p.duration}s ease-out ${p.delay}s forwards`,
                        opacity: 0,
                        boxShadow: '0 0 10px rgba(190, 1, 8, 0.8)'
                    }}
                />
            ))}
            <style>{`
                @keyframes sparkle {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { opacity: 1; }
                    100% { 
                        transform: translate(
                            calc(-50% + ${Math.random() * 200 - 100}px), 
                            calc(-50% + ${Math.random() * 200 - 100}px)
                        ) scale(0);
                        opacity: 0;
                    }
                }
            `}</style>
            <div 
                ref={containerRef} 
                className="absolute top-1/2 left-1/2 -translate-y-1/2"
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'translateX(100vw) perspective(1000px) rotateY(-45deg)'
                }}
            >
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Red Archive Box Icon */}
                    <div 
                        ref={boxRef}
                        className="w-80 h-80 flex items-center justify-center relative"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <HiOutlineArchiveBox 
                            className="text-red-600 drop-shadow-2xl" 
                            style={{ 
                                width: '320px', 
                                height: '320px',
                                filter: 'drop-shadow(0 25px 50px rgba(220, 38, 38, 0.5))'
                            }} 
                        />
                        {/* Box lid overlay */}
                        <div
                            ref={lidRef}
                            className="absolute top-0"
                            style={{
                                width: '320px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #BE0108 0%, #8C0009 100%)',
                                transformOrigin: 'bottom',
                                transform: 'rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                borderRadius: '8px 8px 0 0',
                                boxShadow: '0 10px 30px rgba(140, 0, 9, 0.4)'
                            }}
                        />
                        
                        {/* Product image drops in with 3D effect */}
                        <img 
                            ref={productRef}
                            src={imageUrl} 
                            alt="Product" 
                            className="absolute w-40 h-40 object-cover rounded-lg shadow-2xl"
                            style={{ 
                                transform: 'translateY(-400px) translateZ(-200px) rotateX(0deg) rotateY(0deg) scale(0.5)',
                                opacity: '0',
                                transformStyle: 'preserve-3d',
                                border: '4px solid white'
                            }}
                        />
                    </div>
                    
                    {/* Success label */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white px-8 py-3 rounded-full font-bold shadow-2xl text-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                        ✨ Product Added! ✨
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AddProductPage() {
	const DRAFT_KEY = 'product_draft';
	
	const [productId, setProductId] = useState("(auto)");
	const [productName, setProductName] = useState("");
	const [alternativeNames, setAlternativeNames] = useState("");
	const [labelledPrice, setLabelledPrice] = useState("");
	const [price, setPrice] = useState("");
	const [images, setImages] = useState([]);
	const [description, setDescription] = useState("");
	const [stock, setStock] = useState(0);
	const [isAvailable, setIsAvailable] = useState(true);
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [showAnimation, setShowAnimation] = useState(false);
	const [animationImage, setAnimationImage] = useState(null);
	const [colorsEnabled, setColorsEnabled] = useState(false);
	const [colors, setColors] = useState([]);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();

	// Load draft on mount
	useEffect(() => {
		const draft = getItem(DRAFT_KEY);
		if (draft) {
			try {
				const parsed = JSON.parse(draft);
				if (parsed.productName) setProductName(parsed.productName);
				if (parsed.alternativeNames) setAlternativeNames(parsed.alternativeNames);
				if (parsed.labelledPrice) setLabelledPrice(parsed.labelledPrice);
				if (parsed.price) setPrice(parsed.price);
				if (parsed.description) setDescription(parsed.description);
				if (parsed.stock) setStock(parsed.stock);
				if (parsed.isAvailable !== undefined) setIsAvailable(parsed.isAvailable);
				if (parsed.categories && Array.isArray(parsed.categories)) setSelectedCategories(parsed.categories);
				if (parsed.productId && parsed.productId !== '(auto)') setProductId(parsed.productId);
				toast.success('Draft restored');
			} catch (e) {
				}
		}
	}, []);

	useEffect(() => {
		const token = getItem("token");
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/api/categories")
			.then((r) => setCategories(r.data))
			.catch(() => {});
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/api/products/next-code", {
				headers: { Authorization: "Bearer " + token },
			})
			.then((r) => setProductId(r.data.code))
			.catch(() => setProductId("(auto)"));
	}, []);

	// Auto-save draft whenever form changes
	useEffect(() => {
		const draft = {
			productId,
			productName,
			alternativeNames,
			labelledPrice,
			price,
			description,
			stock,
			isAvailable,
			categories: selectedCategories,
			timestamp: Date.now()
		};
		setItem(DRAFT_KEY, JSON.stringify(draft));
	}, [productId, productName, alternativeNames, labelledPrice, price, description, stock, isAvailable, selectedCategories]);

	async function handleSubmit() {
		try {
			// Validate required fields
			if (!productName || !productName.trim()) {
				toast.error("Product name is required");
				return;
			}
			if (!price || Number(price) <= 0) {
				toast.error("Valid price is required");
				return;
			}
			if (images.length === 0) {
				toast.error("At least one image is required");
				return;
			}
			
			const uploads = [];
			for (let i = 0; i < images.length; i++) uploads.push(uploadFileViaBackend(images[i]));
			const responses = await Promise.all(uploads);

			const payload = {
				name: productName,
				price: Number(price),
				images: responses,
				description: description || 'No description',
				stock: Number(stock) || 0,
				category: selectedCategories.length > 0 ? selectedCategories : ['accessories'],
				colors: [],
				sizes: []
		};		const token = getItem("token");
		if (!token) return navigate("/login");			await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", payload, {
			headers: { Authorization: "Bearer " + token },
		});
		
		// Clear draft after successful submission
		removeItem(DRAFT_KEY);			toast.success("Product added successfully");
			
			// Show animation
			if (responses && responses.length > 0) {
				setAnimationImage(responses[0]);
				setShowAnimation(true);
			} else {
				navigate("/admin/products");
			}
		} catch (e) {
			const errorMsg = e.response?.data?.message || e.message || "Failed to add product";
			toast.error(errorMsg);
		}
	}
	
	function clearDraft() {
		if (confirm('Are you sure you want to clear the draft?')) {
			removeItem(DRAFT_KEY);
			setProductId('(auto)');
			setProductName('');
			setAlternativeNames('');
			setLabelledPrice('');
			setPrice('');
			setImages([]);
			if (fileInputRef.current) fileInputRef.current.value = '';
			setDescription('');
			setStock(0);
			setIsAvailable(true);
			setSelectedCategories([]);
			toast.success('Draft cleared');
		}
	}
	
	function handleFileChange(e) {
		const fileList = e.target.files;
		if (fileList && fileList.length > 0) {
			setImages(Array.from(fileList));
		}
	}

	return (
		<div className="w-full h-full flex justify-center items-center">
			{showAnimation && animationImage && (
				<ProductDropAnimation 
					imageUrl={animationImage} 
					onComplete={() => navigate("/admin/products")} 
				/>
			)}
			<div className="w-full max-w-2xl border border-neutral-800 rounded-2xl p-8 bg-neutral-950 text-white">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold">Add Product</h2>
					<div className="flex items-center gap-2">
						<button onClick={clearDraft} className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white">Clear Draft</button>
						<span className="text-xs px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700">Code:</span>
						<input value={productId} onChange={(e)=> setProductId(e.target.value)} className="h-8 px-2 rounded bg-white border border-gray-300 text-black" />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="text-xs">Name</label>
						<input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full h-10 rounded-md bg-white border border-gray-300 px-3 mt-1 text-black" />
					</div>
					<div className="md:col-span-2">
						<label className="text-xs block mb-2">Categories (Select Multiple)</label>
						<div className="flex flex-wrap gap-2">
							{categories.map((c) => (
								<label key={c._id} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
									<input 
										type="checkbox" 
										checked={selectedCategories.includes(c.slug)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedCategories([...selectedCategories, c.slug]);
											} else {
												setSelectedCategories(selectedCategories.filter(cat => cat !== c.slug));
											}
										}}
										className="w-4 h-4 cursor-pointer"
									/>
									<span className="text-sm text-black">{c.name}</span>
								</label>
							))}
						</div>
						{selectedCategories.length === 0 && <p className="text-xs text-gray-500 mt-2">At least one category is required</p>}
					</div>
					<div>
						<label className="text-xs">Labelled Price</label>
						<input type="number" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} className="w-full h-10 rounded-md bg-neutral-900 border border-neutral-800 px-3 mt-1" />
					</div>
					<div>
						<label className="text-xs">Price</label>
						<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-10 rounded-md bg-neutral-900 border border-neutral-800 px-3 mt-1" />
					</div>
					<div className="md:col-span-2">
						<label className="text-xs">Alternative Names (comma separated)</label>
						<input value={alternativeNames} onChange={(e) => setAlternativeNames(e.target.value)} className="w-full h-10 rounded-md bg-white border border-gray-300 px-3 mt-1 text-black" />
					</div>
					<div className="md:col-span-2">
						<label className="text-xs">Description</label>
						<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-28 rounded-md bg-white border border-gray-300 px-3 mt-1 text-black" />
					</div>
					<div>
						<label className="text-xs">Stock</label>
						<input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full h-10 rounded-md bg-white border border-gray-300 px-3 mt-1 text-black" />
					</div>
					<div>
						<label className="text-xs">Images</label>
						<input ref={fileInputRef} multiple type="file" onChange={handleFileChange} className="w-full mt-1" />
					</div>
					<div className="flex items-center gap-3">
						<label className="text-xs">Available</label>
						<select value={String(isAvailable)} onChange={(e) => setIsAvailable(e.target.value === "true")} className="h-10 rounded-md bg-white border border-gray-300 px-3 text-black">
							<option value={"true"}>Yes</option>
							<option value={"false"}>No</option>
						</select>
					</div>
				</div>

				{/* Color Management Section */}
				<div className="mt-6 p-4 rounded-lg border border-neutral-700 bg-neutral-900">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-sm font-semibold">Product Colors</h3>
						<label className="flex items-center gap-2 cursor-pointer">
							<input 
								type="checkbox" 
								checked={colorsEnabled} 
								onChange={(e) => setColorsEnabled(e.target.checked)}
								className="w-4 h-4 cursor-pointer"
							/>
							<span className="text-xs">Enable colors</span>
						</label>
					</div>

					{colorsEnabled && (
						<div className="space-y-3">
							{/* Color List */}
							<div className="space-y-2">
								{colors.length === 0 ? (
									<p className="text-xs text-gray-400">No colors added yet</p>
								) : (
									<div className="flex flex-wrap gap-2">
										{colors.map((color, idx) => (
											<div key={idx} className="flex items-center gap-2 bg-neutral-800 p-2 rounded">
												<div 
													className="w-6 h-6 rounded border border-gray-500" 
													style={{ backgroundColor: color.hex }}
													title={color.name}
												/>
												<span className="text-xs">{color.name}</span>
												<button
													onClick={() => setColors(colors.filter((_, i) => i !== idx))}
													className="text-xs px-2 py-1 rounded bg-red-900 hover:bg-red-800 text-white"
												>
													Remove
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Add Color Form */}
							<div className="border-t border-neutral-700 pt-3 mt-3">
								<p className="text-xs text-gray-400 mb-2">Add New Color:</p>
								<div className="flex gap-2 items-end flex-wrap">
									<div className="flex-1 min-w-[150px]">
										<label className="text-xs">Color Name</label>
										<input 
											type="text" 
											id="colorName"
											placeholder="e.g., Red, Blue" 
											className="w-full h-8 rounded bg-neutral-800 border border-neutral-600 px-2 mt-1 text-white text-xs"
										/>
									</div>
									<div>
										<label className="text-xs">Hex Code</label>
										<input 
											type="color" 
											id="colorHex"
											defaultValue="#3B82F6"
											className="w-12 h-8 rounded border border-neutral-600 cursor-pointer"
										/>
									</div>
									<button
										onClick={() => {
											const nameInput = document.getElementById('colorName');
											const hexInput = document.getElementById('colorHex');
											const name = nameInput.value.trim();
											const hex = hexInput.value;
											
											if (!name) {
												toast.error('Please enter a color name');
												return;
											}
											
											if (colors.some(c => c.name.toLowerCase() === name.toLowerCase())) {
												toast.error('This color already exists');
												return;
											}
											
											setColors([...colors, { name, hex }]);
											nameInput.value = '';
											hexInput.value = '#3B82F6';
											toast.success('Color added');
										}}
										className="px-3 py-2 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-semibold"
									>
										Add Color
									</button>
								</div>
							</div>
						</div>
					)}

					{!colorsEnabled && (
						<p className="text-xs text-gray-500 italic">Colors are disabled. Enable to add color options for this product.</p>
					)}
				</div>

				<div className="mt-6 flex gap-3">
					<Link to="/admin/products" className="px-4 py-2 rounded-md bg-white border border-gray-300 text-black" style={{ borderColor: '#d1d5db' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8C0009'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>Cancel</Link>
					<button onClick={handleSubmit} className="px-4 py-2 rounded-md hover:opacity-90 text-white" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>Add Product</button>
				</div>
			</div>
		</div>
	);
}
