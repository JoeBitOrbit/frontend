import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaBoxArchive, FaChartLine } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { IoPeople } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { MdOutlineMail, MdAdminPanelSettings } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductAdminPage";
import UpdateProductPage from "./admin/updateProduct";
import ContactsAdmin from './admin/contactsAdmin';
import CategoriesAdmin from './admin/categoriesAdmin';
import OrdersPageAdmin from "./admin/ordersPageAdmin";
import UsersAdmin from './admin/usersAdmin';
import SettingsAdmin from './admin/settingsAdmin';
import ChristmasStarLoader from '../components/ChristmasStarLoader';
import DashboardAdmin from './admin/dashboardAdmin';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getItem } from "../utils/safeStorage.js";
import { useHoliday } from '../context/HolidayContext';

function MatrixRainLoader({ fadeOut }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Japanese Katakana, Latin letters, numerals
        const katakana =
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numerals = '0123456789';
        const chars = katakana + latin + numerals;
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#e11d48'; // red-600
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black flex items-center justify-center"
            style={{
                zIndex: 99999,
                pointerEvents: fadeOut ? 'none' : 'auto',
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1)',
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="admin-icon-3d">
                    <MdAdminPanelSettings className="text-red-600 text-8xl" style={{
                        filter: 'drop-shadow(0 0 20px rgba(225,29,72,0.8))',
                        animation: 'spin3d 2s linear infinite'
                    }} />
                </div>
                <div className="h-1 w-64 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const holidayContext = useHoliday();
    const holidayMode = holidayContext?.holidayMode || false;
    const navigate = useNavigate();
    const [adminValidated, setAdminValidated] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [fadeLoader, setFadeLoader] = useState(false);

    useEffect(() => {
        const token = getItem("token");
        if (token == null) {
            toast.error("You are not logged in");
            navigate("/login");
        } else {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (response.data.role == "admin") {
                    setTimeout(() => {
                        setFadeLoader(true);
                        setTimeout(() => {
                            setAdminValidated(true);
                            setShowLoader(false);
                        }, 600); // match fade duration
                    }, 3000);
                } else {
                    toast.error("You are not authorized");
                    navigate("/login");
                }
            }).catch(() => {
                toast.error("You are not authorized");
                navigate("/login");
            });
        }
    }, []);

    return (
        <div className="w-full h-screen flex bg-white text-black overflow-hidden">
            {showLoader && (holidayMode ? <ChristmasStarLoader /> : <MatrixRainLoader fadeOut={fadeLoader} />)}
            {adminValidated ? <>
                <div className="w-[300px] h-full flex flex-col items-center bg-white text-black shadow-2xl border-r border-gray-300 relative">
                    <span className="text-3xl admin-heading font-extrabold my-6 tracking-wide text-black relative z-10">Admin Panel</span>
                    <nav className="w-full flex flex-col relative z-10">
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/">
                            <FaChartLine className="text-red-400 text-xl"/> <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/products">
                            <FaBoxArchive className="text-red-400 text-xl"/> <span className="font-medium">Products</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/orders">
                            <FiShoppingBag className="text-red-400 text-xl"/> <span className="font-medium">Orders</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/users">
                            <IoPeople className="text-red-400 text-xl"/> <span className="font-medium">Users</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/settings">
                            <IoSettings className="text-red-400 text-xl"/> <span className="font-medium">Settings</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/categories">
                            <BiCategory className="text-red-400 text-xl"/> <span className="font-medium">Categories</span>
                        </Link>
                        <Link className="flex flex-row h-[60px] w-full border-t border-b border-gray-300 px-6 items-center text-md gap-4 text-black hover:bg-red-600 hover:text-white hover:border-l-4 hover:border-l-red-500 transition-all" to="/admin/contacts">
                            <MdOutlineMail className="text-red-400 text-xl"/> <span className="font-medium">Contacts</span>
                        </Link>
                    </nav>
                </div>
                <div className="w-[calc(100%-300px)] h-full overflow-y-auto bg-white relative">
                    <Routes path="/*">
                        <Route path="/" element={<DashboardAdmin />} />
                        <Route path="/products" element={<ProductsAdminPage />} />
                        <Route path="/newProduct" element={<AddProductPage />} />
                        <Route path="/orders" element={<OrdersPageAdmin />} />
                        <Route path="/updateProduct" element={<UpdateProductPage />} />
                        <Route path="/contacts" element={<ContactsAdmin />} />
                        <Route path="/categories" element={<CategoriesAdmin />} />
                        <Route path="/users" element={<UsersAdmin />} />
                        <Route path="/settings" element={<SettingsAdmin />} />
                    </Routes>
                </div>
            </> : null}
        </div>
    );
}
