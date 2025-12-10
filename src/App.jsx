import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";
import ClientWebPage from "./pages/client/clientPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPasswordPage from "./pages/client/forgetPassword";
import { init3DTyping } from "./utils/typing3d";
import Snowflakes from "./components/Snowflakes";
import ChristmasGiftModal from "./components/ChristmasGiftModal";
import { useChristmas } from "./context/ChristmasContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AppContent() {
	const { christmasMode } = useChristmas();

	useEffect(() => {
		const cleanup = init3DTyping();
		return cleanup;
	}, []);

	return (
		<GoogleOAuthProvider clientId={clientId}>
			{christmasMode && <Snowflakes />}
			<ChristmasGiftModal />
			<div className={`w-full h-screen flex justify-center items-center text-secondary overflow-hidden transition-all duration-500 ${
				christmasMode 
					? 'bg-gradient-to-b from-red-50 via-white to-green-50' 
					: 'bg-primary'
			}`}>
				{christmasMode && (
					<style>{`
						* {
							--christmas-glow: 0 0 20px rgba(220, 38, 38, 0.3);
						}
						body {
							background: linear-gradient(135deg, #fecaca 0%, #fef2f2 50%, #dcfce7 100%);
						}
					`}</style>
				)}
				<Toaster position="top-right" />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/test" element={<TestPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/admin/*" element={<AdminPage />} />
					<Route path="/forget" element={<ForgetPasswordPage/>}/>
					<Route path="/*" element={<ClientWebPage />} />
				</Routes>
			</div>
		</GoogleOAuthProvider>
	);
}

function App() {
	return <AppContent />;
}

export default App;
