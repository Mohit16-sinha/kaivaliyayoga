import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Nav from './Nav';
import NavMobile from './NavMobile';
import CountrySelector from './CountrySelector';
import Logo from '../images2/kaivaliyayoga-logo-.png';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 50 ? setIsActive(true) : setIsActive(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine text color class based on scroll and theme
  // Default (Top of page): White text (for dark hero images)
  // Scrolled (isActive): Dark text (on white bg) or White text (on dark bg in dark mode)
  const textColorClass = isActive
    ? "text-earth-900 dark:text-white"
    : "text-white dark:text-white drop-shadow-md";
  // Added drop-shadow for better visibility on mixed backgrounds

  return (
    <header
      className={`${isActive
        ? 'bg-white/90 shadow-md py-4 dark:bg-earth-900/95 dark:border-b dark:border-earth-800'
        : 'bg-transparent py-6'
        } sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm`}
    >
      <div className='container mx-auto px-4 lg:px-0 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/'>
          {/* You might want a different logo for dark mode if it's black text */}
          <img src={Logo} alt='Kaivaliya Yoga' className='h-12 w-auto' />
        </Link>

        {/* Desktop Nav - Pass text color */}
        <div className='hidden lg:flex'>
          <Nav textColorClass={textColorClass} />
        </div>

        {/* buttons */}
        <div className='hidden lg:flex gap-4 items-center'>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-white/20 transition-colors text-2xl ${textColorClass}`}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <CountrySelector />
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
                    <Link to='/admin' className={`${textColorClass} font-bold hover:text-accent transition-colors border-2 border-accent px-3 py-1 rounded-full`}>
                      Admin Panel
                    </Link>
                  )}
                  <Link to='/dashboard' className={`${textColorClass} font-bold hover:text-accent transition-colors flex items-center gap-2`}>
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
                <Link to='/signin?role=admin' className={`hidden md:block text-xs font-semibold hover:text-indigo-400 mr-2 transition-colors uppercase tracking-wider ${isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-200'}`}>
                  Admin Login
                </Link>
                <Link to='/signin'>
                  <button className={`${textColorClass} font-medium text-base hover:text-accent transition-colors`}>
                    Sign In
                  </button>
                </Link>
                <Link to='/signup'>
                  <button className='px-6 py-2 bg-accent text-white font-medium text-base rounded-full hover:bg-accent-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-none'>
                    Sign Up
                  </button>
                </Link>
              </>
            );
          })()}
        </div>

        {/* Mobile Nav */}
        <div className='lg:hidden flex items-center gap-4'>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-white/20 transition-colors text-2xl ${isActive ? 'text-earth-900 dark:text-white' : 'text-earth-900 dark:text-white'}`}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <NavMobile />
        </div>
      </div>
    </header>
  );
};

export default Header;