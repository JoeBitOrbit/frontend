import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import ProductsPage from "./productsPage";
import ProductOverViewPage from "./productOverView.jsx";
import CartPage from "./cart";
import CheckoutPage from "./checkoutPage";
import PaymentPage from "./paymentPage";
import HomeLanding from './homeLanding';
import ContactPage from './contactPage';
import AboutPage from './aboutPage';
import ReviewsPage from './reviewsPage';
import WishlistPage from './wishlist';
import ChristmasOffersPage from './christmasOffersPage';

export default function ClientWebPage() {
	return (
		<div className="w-full min-h-screen flex flex-col">
			<Header />
			<div className="w-full flex-1 overflow-auto">
				<Routes path="/">
					<Route path="/" element={<HomeLanding />} />
					<Route path="/holiday-offers" element={<ChristmasOffersPage />} />
				<Route path="/christmas-offers" element={<ChristmasOffersPage />} />
					<Route
						path="/products"
						element={<ProductsPage/>}
					/>
					<Route path="/reviews" element={<ReviewsPage />} />
					<Route path="/about-us" element={<AboutPage />} />
					<Route path="/contact-us" element={<ContactPage />} />
					<Route
						path="/cart"
						element={<CartPage/>}
					/>
					<Route
						path="/wishlist"
						element={<WishlistPage/>}
					/>
                    <Route
                        path="/overview/:productId"
                        element={<ProductOverViewPage />}
                    />
					<Route
						path="/checkout"
						element={<CheckoutPage/>}/>
					<Route
						path="/payment"
						element={<PaymentPage/>}/>
					<Route
						path="/*"
						element={<h1 className="text-3xl text-center">404 Not Found</h1>}
					/>
				</Routes>
			</div>
		</div>
	);
}
