import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images2/kaivaliyayoga-logo-.png';

const Footer = () => {
    return (
        <footer className="bg-earth-900 text-earth-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src={Logo} alt="Kaivalya" className="h-8 w-auto brightness-0 invert" />
                            <span className="text-2xl font-heading font-bold text-white">Kaivalya</span>
                        </Link>
                        <p className="text-earth-300 text-sm leading-relaxed">
                            A holistic wellness marketplace connecting you with certified professionals for a balanced mind, body, and soul.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-earth-300">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/professionals" className="hover:text-white transition">Browse Professionals</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition">Wellness Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-earth-300">
                            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold text-white mb-4">Stay Connected</h4>
                        <p className="text-earth-300 text-sm mb-4">Join our community for wellness tips.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-earth-800 border-none rounded-l-md px-4 py-2 w-full text-sm focus:ring-primary-500 text-white placeholder-earth-400"
                            />
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-earth-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-earth-400">
                    <p>&copy; {new Date().getFullYear()} Kaivalya Wellness. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/* Social Icons would go here */}
                        <a href="#" className="hover:text-white transition">Instagram</a>
                        <a href="#" className="hover:text-white transition">Twitter</a>
                        <a href="#" className="hover:text-white transition">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
