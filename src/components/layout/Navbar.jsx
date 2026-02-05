import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../images2/kaivaliyayoga-logo-.png';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { currency, changeCurrency, currencies } = useCurrency();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 shadow-md border-b border-slate-200 dark:border-slate-700 transition-all duration-300 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <img 
                                    src={Logo} 
                                    alt="Kaivalya Wellness" 
                                    className="h-12 w-auto relative z-10 transition-transform group-hover:scale-110 duration-300" 
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent transition-all group-hover:from-primary-700 group-hover:to-primary-900">
                                    Kaivalya Wellness
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                                    Holistic Health Platform
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link 
                            to="/professionals" 
                            className="text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm"
                        >
                            Find Professionals
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm"
                        >
                            About Us
                        </Link>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-3" />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm"
                            aria-label="Toggle Dark Mode"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => changeCurrency(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:shadow-sm"
                        >
                            {currencies.map((c) => (
                                <option key={c.code} value={c.code} className="bg-slate-50 dark:bg-slate-800">
                                    {c.code} ({c.symbol})
                                </option>
                            ))}
                        </select>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-3" />

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                {user?.role === 'admin' ? (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200 hover:shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Admin Panel
                                    </Link>
                                ) : user?.role === 'professional' ? (
                                    <Link 
                                        to="/professional-dashboard" 
                                        className="text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/dashboard" 
                                        className="text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/signin" 
                                    className="text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-300 focus:outline-none"
                            aria-label="Toggle menu"
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
            {isMenuOpen && (
                <div className="md:hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl">
                    <div className="px-6 pt-4 pb-6 space-y-2">
                        <Link 
                            to="/professionals" 
                            className="block px-5 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find Professionals
                        </Link>
                        <Link 
                            to="/about" 
                            className="block px-5 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>

                        {/* Currency Selector Mobile */}
                        <div className="px-2 py-3">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 px-3">
                                CURRENCY
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => changeCurrency(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            >
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code} className="bg-slate-50 dark:bg-slate-800">
                                        {c.code} ({c.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' ? (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Admin Panel
                                    </Link>
                                ) : user?.role === 'professional' ? (
                                    <Link 
                                        to="/professional-dashboard" 
                                        className="block px-5 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/dashboard" 
                                        className="block px-5 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-5 py-3.5 text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/signin" 
                                    className="block px-5 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="block px-5 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl transition-all duration-200 text-center shadow-lg shadow-primary-500/30"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;