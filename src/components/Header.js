import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import NavMobile from './NavMobile';
import Logo from '../images2/kaivaliyayoga-logo-.png';

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 50 ? setIsActive(true) : setIsActive(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${isActive ? 'bg-white/90 shadow-md py-4' : 'bg-transparent py-6'
        } sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm`}
    >
      <div className='container mx-auto px-4 lg:px-0 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/'>
          <img src={Logo} alt='Kaivaliya Yoga' className='h-12 w-auto' />
        </Link>

        {/* Desktop Nav */}
        <div className='hidden lg:flex'>
          <Nav />
        </div>

        {/* buttons */}
        <div className='hidden lg:flex gap-4 items-center'>
          {(() => {
            const userStr = localStorage.getItem('user');
            let user = null;
            try {
              user = userStr ? JSON.parse(userStr) : null;
            } catch (e) {
              console.error('Invalid user data', e);
              localStorage.removeItem('user');
            }

            if (user) {
              return (
                <div className="flex items-center gap-4">
                  {user.role === 'admin' && (
                    <Link to='/admin' className="text-earth-900 font-bold hover:text-accent transition-colors border-2 border-accent px-3 py-1 rounded-full">
                      Admin Panel
                    </Link>
                  )}
                  <Link to='/dashboard' className="text-earth-900 font-bold hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    Hi, {user.name}
                  </Link>
                </div>
              );
            }

            return (
              <>
                <Link to='/signin?role=admin' className='hidden md:block text-xs font-semibold text-gray-500 hover:text-indigo-600 mr-2 transition-colors uppercase tracking-wider'>
                  Admin Login
                </Link>
                <Link to='/signin'>
                  <button className='text-earth-900 font-medium text-base hover:text-accent transition-colors'>
                    Sign In
                  </button>
                </Link>
                <Link to='/signup'>
                  <button className='px-6 py-2 bg-accent text-white font-medium text-base rounded-full hover:bg-accent-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5'>
                    Sign Up
                  </button>
                </Link>
              </>
            );
          })()}
        </div>

        {/* Mobile Nav */}
        <div className='lg:hidden'>
          <NavMobile />
        </div>
      </div>
    </header>
  );
};

export default Header;