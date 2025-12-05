import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-12 md:py-16 border-t border-red-700">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Nikola" className="h-8 object-contain" />
              <h3 className="text-lg font-bold text-white">Nikola</h3>
            </div>
            <p className="text-red-100 text-sm leading-relaxed">
              Elevated fashion essentials. Timeless silhouettes, modern tailoring, and understated luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-red-100 hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="text-red-100 hover:text-white transition">Shop</Link></li>
              <li><Link to="/about-us" className="text-red-100 hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="text-red-100 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/cart" className="text-red-100 hover:text-white transition">Cart</a></li>
              <li><a href="/wishlist" className="text-red-100 hover:text-white transition">Wishlist</a></li>
              <li><a href="#" className="text-red-100 hover:text-white transition">Shipping Info</a></li>
              <li><a href="#" className="text-red-100 hover:text-white transition">Returns</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="flex-shrink-0 mt-1 text-white" />
                <span className="text-red-100">Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="flex-shrink-0 mt-1 text-white" />
                <a href="tel:+94701234567" className="text-red-100 hover:text-white transition">+94 70 123 4567</a>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="flex-shrink-0 mt-1 text-white" />
                <a href="mailto:info@nikola.lk" className="text-red-100 hover:text-white transition">info@nikola.lk</a>
              </li>
              <li className="flex items-start gap-3">
                <FiGlobe className="flex-shrink-0 mt-1 text-white" />
                <a href="https://nikola.lk" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-white transition">nikola.lk</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-red-500 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://instagram.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-100 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
            </a>
            <a href="https://facebook.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-100 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://twitter.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-100 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.637c-1.02.469-2.122.869-3.28 1.039 1.237-1.479 2.18-3.15 2.625-5.149-1.15.678-2.426 1.165-3.756 1.428C19.5 1.5 18.234.5 16.66.5c-3.06 0-5.543 2.926-4.807 5.863-4.131-.205-7.793-2.556-10.236-6.084-1.3 2.215-.67 5.118 1.523 6.573-1.04-.033-2.04-.32-2.896-.9v.072c0 2.944 2.057 5.488 4.782 6.04-1.input.input 1.97 2.408-.59-.768-1.215-2.424-1.052-3.71 1.23 3.857 4.81 6.656 9.008 6.753-1.27 3.348-4.028 5.47-7.347 5.47-.477 0-.945-.014-1.407-.042 2.6 1.675 5.697 2.644 9.012 2.644 10.827 0 16.715-8.995 16.338-17.08.576-.464 1.073-1.041 1.468-1.7z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-red-100 text-sm">
            <p>&copy; {new Date().getFullYear()} Nikola Fashion. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <span className="text-red-300">|</span>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <span className="text-red-300">|</span>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
