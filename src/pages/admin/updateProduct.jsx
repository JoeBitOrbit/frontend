import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";
import { getItem } from "../../utils/safeStorage.js";

export default function UpdateProductPage() {
    const location = useLocation()
    const [productId, setProductId] = useState(location.state._id || location.state.productId);
    const [productName, setProductName] = useState(location.state.name);
    const [alternativeNames, setAlternativeNames] = useState((location.state.altNames || []).join(","));
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice || 0);
    const [price, setPrice] = useState(location.state.price);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState(location.state.description);
    const [stock, setStock] = useState(location.state.stock);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable !== false);
    const [category, setCategory] = useState((location.state.category || []).length > 0 ? location.state.category : []);
    const [categories, setCategories] = useState([]);
    const [colorsEnabled, setColorsEnabled] = useState((location.state.colors || []).length > 0);
    const [colors, setColors] = useState(location.state.colors || []);
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/categories")
            .then((r) => {
                const filtered = r.data.filter(c => c.slug !== 'kids');
                setCategories(filtered);
            })
            .catch(() => {});
    }, []);


    async function  handleSubmit(){

        const promisesArray = []

        for(let i=0; i<images.length; i++){

            const promise = uploadFile(images[i])
            promisesArray[i] = promise

        }

        const responses = await Promise.all(promisesArray)


        const altNamesInArray = alternativeNames.split(",")
        const productData = {
            name: productName,
            price: Number(price),
            images: responses.length > 0 ? responses : location.state.images,
            description: description,
            stock: Number(stock),
            category: Array.isArray(category) ? category : [category],
            colors: colorsEnabled ? colors : [],
            sizes: location.state.sizes || []
        }

		const token = getItem("token");        if(token == null){
            navigate("/login");
            return;
        }

        axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId, productData, 
            {
                headers:{
                    Authorization: "Bearer "+token
                }
            }
        ).then(
            (res)=>{
                toast.success("Product updated successfully");
                navigate("/admin/products");
            }
        ).catch(
            (error)=>{
                toast.error("Failed to update product");              
            }
        )

    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[600px] border rounded-[15px] p-[40px] flex flex-wrap justify-between bg-white shadow-2xl text-black">
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Product ID</label>
                        <input
                            // allow editing productId
                        type="text"
                        value={productId}
                        onChange={(e) => {
                            setProductId(e.target.value);
                        }}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[300px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Product Name</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Alternative Names</label>
                    <input
                        type="text"
                        value={alternativeNames}
                        onChange={(e) => setAlternativeNames(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Labelled Price</label>
                    <input
                        type="number"
                        value={labelledPrice}
                        onChange={(e) => setLabelledPrice(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Images</label>
                    <input
                        multiple
                        type="file"
                        onChange={(e) => {
                            setImages(e.target.files);
                        }}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border-[1px] h-[100px] rounded-md"
                    ></textarea>
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Is Available</label>
                    <select
                        value={isAvailable}
                        onChange={(e) => {
                            setIsAvailable(e.target.value === "true");
                        }}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                    </select>
                </div>
                <div className="w-full flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Categories (Select Multiple)</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <label key={c._id} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                <input 
                                    type="checkbox" 
                                    checked={category.includes(c.slug)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCategory([...category, c.slug]);
                                        } else {
                                            setCategory(category.filter(cat => cat !== c.slug));
                                        }
                                    }}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-sm text-black">{c.name}</span>
                            </label>
                        ))}
                    </div>
                    {category.length === 0 && <p className="text-xs text-gray-500 mt-2">At least one category is required</p>}
                </div>

                {/* Color Management */}
                <div className="w-full border-[1px] rounded-md p-4 mt-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold">Product Colors</label>
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
                                    <p className="text-xs text-gray-500">No colors added yet</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                                                <div 
                                                    className="w-6 h-6 rounded border" 
                                                    style={{ backgroundColor: color.hex || color }}
                                                    title={color.name || color}
                                                />
                                                <span className="text-xs">{color.name || color}</span>
                                                <button
                                                    onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                                                    className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Color Form */}
                            <div className="border-t pt-3 mt-3">
                                <p className="text-xs text-gray-600 mb-2">Add New Color:</p>
                                <div className="flex gap-2 items-end flex-wrap">
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="text-xs">Color Name</label>
                                        <input 
                                            type="text" 
                                            id="colorName"
                                            placeholder="e.g., Red, Blue" 
                                            className="w-full h-8 rounded border px-2 mt-1 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs">Hex Code</label>
                                        <input 
                                            type="color" 
                                            id="colorHex"
                                            defaultValue="#3B82F6"
                                            className="w-12 h-8 rounded border cursor-pointer"
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
                                            
                                            if (colors.some(c => (c.name || c).toLowerCase() === name.toLowerCase())) {
                                                toast.error('This color already exists');
                                                return;
                                            }
                                            
                                            setColors([...colors, { name, hex }]);
                                            nameInput.value = '';
                                            hexInput.value = '#3B82F6';
                                            toast.success('Color added');
                                        }}
                                        className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
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

                <div className="w-full flex justify-center flex-row py-[20px]">
                    <Link
                        to={"/admin/products"}
                        className="w-[200px] h-[50px] bg-white text-black border-[2px] rounded-md flex justify-center items-center"
                    >
                        Cancel
                    </Link>
                    <button onClick={handleSubmit} className="w-[200px] h-[50px] hover:opacity-90 text-white border-[2px] rounded-md flex justify-center items-center ml-[20px]" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', borderColor: '#8C0009' }}>
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
}
