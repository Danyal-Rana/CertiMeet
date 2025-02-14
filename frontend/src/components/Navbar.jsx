import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserContext } from '../utils/UserContext';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <img className="h-8 w-auto" src="https://raw.githubusercontent.com/Danyal-Rana/CertiMeet/main/frontend/src/assets/navbarLogo2.png
" alt="CertiMeet" />
                    </div>

                    <div className="hidden sm:flex flex-1 justify-center sm:ml-6 sm:space-x-8">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                    ? "border-black text-gray-900"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/certificate"
                            className={({ isActive }) =>
                                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                    ? "border-black text-gray-900"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`
                            }
                        >
                            Certificate
                        </NavLink>
                        <NavLink
                            to="/meetings"
                            className={({ isActive }) =>
                                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                    ? "border-black text-gray-900"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`
                            }
                        >
                            Meetings
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                    ? "border-black text-gray-900"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={user.avatar || 'src/assets/defaultAvatar.png'}
                                        alt="User Avatar"
                                    />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                                        <NavLink
                                            to="/account-settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Account Settings
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="bg-black text-white rounded-button px-4 py-2 text-sm font-medium hover:bg-black/90"
                            >
                                Sign In
                            </NavLink>
                        )}
                    </div>

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

                {menuOpen && (
                    <div className="sm:hidden bg-gray-50 border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-gray-900 bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/certificate"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-gray-900 bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Certificate
                            </NavLink>
                            <NavLink
                                to="/meetings"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-gray-900 bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Meetings
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-gray-900 bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            {user ? (
                                <>
                                    <NavLink
                                        to="/account-settings"
                                        className={({ isActive }) =>
                                            `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-gray-900 bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                                            }`
                                        }
                                    >
                                        Account Settings
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-black bg-gray-100" : "text-black hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;