import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

// Import background image for Navbar
import NavbarBg from '../../assets/img/cards/neom-HYHYGLs-Rp8-unsplash.jpg';
import Logo from '../../images2/kaivaliyayoga-logo-.png';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { currency, changeCurrency, currencies } = useCurrency();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 shadow-md">
            {/* Background Image Container */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 dark:opacity-20"
                    style={{ backgroundImage: `url(${NavbarBg})` }}
                />
                {/* Dark mode overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] dark:bg-earth-900/90 dark:backdrop-blur-md transition-colors duration-300" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 transition-colors bg-white/40 dark:bg-earth-800/50 backdrop-blur-md px-4 py-1 rounded-full shadow-sm border border-white/40 dark:border-white/10">
                            <img src={Logo} alt="Kaivalya Wellness" className="h-8 w-auto" />
                            <span>Kaivalya Wellness</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/professionals" className="text-earth-900 dark:text-white font-medium px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10 hover:shadow-sm">
                            Find Professionals
                        </Link>
                        <Link to="/about" className="text-earth-900 dark:text-white font-medium px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10 hover:shadow-sm">
                            About Us
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 border border-white/20 dark:border-white/10 text-2xl transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>

                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => changeCurrency(e.target.value)}
                            className="bg-white/40 dark:bg-earth-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full py-1.5 pl-3 pr-8 text-sm focus:ring-primary-500 cursor-pointer text-earth-900 dark:text-white font-medium hover:bg-white/60 dark:hover:bg-earth-700/60 transition-colors"
                        >
                            {currencies.map((c) => (
                                <option key={c.code} value={c.code} className="text-earth-900">
                                    {c.code} ({c.symbol})
                                </option>
                            ))}
                        </select>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'admin' ? (
                                    <Link to="/admin" className="text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10">
                                        <span className="text-sm">🛡️</span> Admin Panel
                                    </Link>
                                ) : user?.role === 'professional' ? (
                                    <Link to="/professional-dashboard" className="text-earth-900 dark:text-white font-medium px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" className="text-earth-900 dark:text-white font-medium px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10">
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-white/60 dark:bg-earth-800/60 hover:bg-white dark:hover:bg-earth-700 text-earth-900 dark:text-white px-5 py-1.5 rounded-full text-sm font-medium transition shadow-sm border border-white/40 dark:border-white/10 backdrop-blur-md"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/signin" className="text-earth-900 dark:text-white font-medium px-4 py-1.5 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 transition-all border border-white/20 dark:border-white/10">
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-white/40 dark:bg-earth-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-earth-700/60 border border-white/20 dark:border-white/10 text-xl transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="focus:outline-none bg-white/40 dark:bg-earth-800/40 p-2 rounded-full backdrop-blur-md text-earth-900 dark:text-white border border-white/30 dark:border-white/10"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden relative z-20 bg-white/95 dark:bg-earth-900/95 backdrop-blur-md border-t border-earth-200 dark:border-earth-700">
                        {/* Mobile menu background */}
                        <div className="absolute inset-0 overflow-hidden -z-10">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
                                style={{ backgroundImage: `url(${NavbarBg})` }}
                            />
                        </div>

                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 relative z-10">
                            <Link to="/professionals" className="block px-3 py-2 text-base font-medium text-earth-900 dark:text-white hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                Find Professionals
                            </Link>
                            <Link to="/about" className="block px-3 py-2 text-base font-medium text-earth-900 dark:text-white hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                About Us
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    {user?.role === 'admin' ? (
                                        <Link to="/admin" className="block px-3 py-2 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded-md">
                                            🛡️ Admin Panel
                                        </Link>
                                    ) : user?.role === 'professional' ? (
                                        <Link to="/professional-dashboard" className="block px-3 py-2 text-base font-medium text-earth-900 dark:text-white hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-earth-900 dark:text-white hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-md"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin" className="block px-3 py-2 text-base font-medium text-earth-900 dark:text-white hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50/50 dark:hover:bg-earth-800/50 rounded-md">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
