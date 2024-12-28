import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <img className="h-8 w-auto" src="/logo.png" alt="CertiMeet" />
                    </div>

                    {/* Centered Navigation Links */}
                    <div className="flex-1 flex justify-center sm:ml-6 sm:flex sm:space-x-8">
                        <Link to="/" className="border-black text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/certificate" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Certificate
                        </Link>
                        <Link to="/meetings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Meetings
                        </Link>
                        <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Dashboard
                        </Link>
                    </div>

                    {/* Sign-In Button on the Right */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Link to="/login" className="bg-black text-white !rounded-button px-4 py-2 text-sm font-medium hover:bg-black/90">
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md bg-gray-800 text-white hover:text-gray-300 hover:bg-gray-700"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="sm:hidden bg-gray-50 border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                Home
                            </Link>
                            <Link to="/certificate" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                Certificate
                            </Link>
                            <Link to="/meetings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                Meetings
                            </Link>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                Dashboard
                            </Link>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;