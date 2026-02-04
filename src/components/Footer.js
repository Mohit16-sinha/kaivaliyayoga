import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images2/kaivaliyayoga-logo-.png';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-white pt-16 pb-8 border-t border-gray-100'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col lg:flex-row justify-between gap-12 mb-12'>
                    {/* Logo & About */}
                    <div className='lg:w-1/3'>
                        <Link to='/'>
                            <img src={Logo} alt='' className='h-12 mb-6' />
                        </Link>
                        <p className='text-gray-500 mb-6'>
                            Kaivalya Yoga Studio offers a sanctuary for your mind, body, and soul. Join our community and discover your inner peace.
                        </p>
                        <div className='flex gap-4'>
                            <a href='#' className='text-gray-400 hover:text-accent transition-colors'><FaFacebook size={24} /></a>
                            <a href='#' className='text-gray-400 hover:text-accent transition-colors'><FaInstagram size={24} /></a>
                            <a href='#' className='text-gray-400 hover:text-accent transition-colors'><FaTwitter size={24} /></a>
                            <a href='#' className='text-gray-400 hover:text-accent transition-colors'><FaYoutube size={24} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='lg:w-1/5'>
                        <h4 className='text-xl font-bold mb-6 text-earth-900'>Quick Links</h4>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to='/professionals' className='text-gray-500 hover:text-accent transition-colors'>Find Professionals</Link></li>
                            <li><Link to='/classes' className='text-gray-500 hover:text-accent transition-colors'>Classes</Link></li>
                            <li><Link to='/services' className='text-gray-500 hover:text-accent transition-colors'>Services</Link></li>
                            <li><Link to='/about' className='text-gray-500 hover:text-accent transition-colors'>About Us</Link></li>
                            <li><Link to='/contact' className='text-gray-500 hover:text-accent transition-colors'>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className='lg:w-1/5'>
                        <h4 className='text-xl font-bold mb-6 text-earth-900'>Support</h4>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to='/faq' className='text-gray-500 hover:text-accent transition-colors'>FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className='lg:w-1/5'>
                        <h4 className='text-xl font-bold mb-6 text-earth-900'>Legal</h4>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to='/terms' className='text-gray-500 hover:text-accent transition-colors'>Terms of Service</Link></li>
                            <li><Link to='/privacy' className='text-gray-500 hover:text-accent transition-colors'>Privacy Policy</Link></li>
                            <li><Link to='/refund' className='text-gray-500 hover:text-accent transition-colors'>Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className='border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-gray-400 text-sm'>
                        &copy; {new Date().getFullYear()} Kaivalya Yoga Studio. All rights reserved.
                    </p>
                    <div className='text-gray-400 text-sm'>
                        Prices displayed in local currency are estimates.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
