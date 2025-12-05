import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { setItem } from "../utils/safeStorage.js";

export default function RegisterPage(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: (response)=>{
            axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/google-login",{
                token : response.access_token
            }).then((response)=>{
                setItem("token", response.data.token);
                setItem("role", response.data.role);
                toast.success("Registration successful");
                navigate("/");
            }).catch(()=>{
                toast.error("Google login failed");
            });
        }
    });

    function register(){
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            toast.error("Please fill all fields");
            return;
        }
        if(!email.includes('@')){
            toast.error("Please enter a valid email");
            return;
        }
        if(password.length < 6){
            toast.error("Password must be at least 6 characters");
            return;
        }
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }

        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/register",{
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }).then((response)=>{
            setItem("token", response.data.token);
            setItem("role", response.data.role);
            toast.success("Registration successful");
            navigate("/");
        }).catch((error)=>{
            const msg = error?.response?.data?.message || "Registration failed";
            toast.error(msg);
        });
    }

    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center px-4 py-8">
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl relative gap-5 text-black flex flex-col items-center justify-center p-8">
                <h1 className="text-2xl font-semibold text-center">Create Account</h1>
                <div className="w-full flex flex-col gap-2 mt-4">
                    <label className="text-sm uppercase tracking-wide text-gray-600">First Name *</label>
                    <input 
                        onChange={(e)=> setFirstName(e.target.value)}
                        type="text"
                        className="w-full h-11 rounded-xl bg-white text-black placeholder-gray-400 border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 px-4 outline-none"
                        placeholder="John"
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm uppercase tracking-wide text-gray-600">Last Name *</label>
                    <input 
                        onChange={(e)=> setLastName(e.target.value)}
                        type="text"
                        className="w-full h-11 rounded-xl bg-white text-black placeholder-gray-400 border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 px-4 outline-none"
                        placeholder="Doe"
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm uppercase tracking-wide text-gray-600">Email *</label>
                    <input 
                        onChange={(e)=> setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        className="w-full h-11 rounded-xl bg-white text-black placeholder-gray-400 border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 px-4 outline-none"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm uppercase tracking-wide text-gray-600">Password *</label>
                    <input 
                        onChange={(e)=> setPassword(e.target.value)} 
                        type="password" 
                        autoComplete="new-password"
                        className="w-full h-11 rounded-xl bg-white text-black placeholder-gray-400 border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 px-4 outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm uppercase tracking-wide text-gray-600">Confirm Password *</label>
                    <input 
                        onChange={(e)=> setConfirmPassword(e.target.value)} 
                        type="password" 
                        autoComplete="new-password"
                        className="w-full h-11 rounded-xl bg-white text-black placeholder-gray-400 border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 px-4 outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button onClick={register} className="w-full h-11 rounded-xl bg-red-600 text-white text-base mt-2 hover:bg-red-700 active:bg-red-800 transition-colors">
                    Register
                </button>
                <button onClick={googleLogin} className="w-full h-11 rounded-xl bg-white border border-red-600 text-black text-base hover:bg-red-50 transition-colors">
                    Sign up with Google
                </button>
                <p className="text-sm text-neutral-300 mt-2">Already have an account? <Link to="/login" className="text-red-500 hover:text-red-400">Login</Link></p>
            </div>
        </div>
    );
}