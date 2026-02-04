import React from 'react';
import { navigation } from '../data';
import { Link } from 'react-router-dom';

const Nav = ({ textColorClass }) => {
  // Default to text-earth-900 if no prop provided (fallback)
  const finalClass = textColorClass || 'text-earth-900 dark:text-white';

  return (
    <nav className='ml-[70px]'>
      <ul className='flex gap-[42px]'>
        {navigation.map((item, index) => {
          return (
            <li key={index}>
              <Link
                to={item.href}
                className={`${finalClass} font-medium text-base hover:text-accent transition-colors`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
        {/* Additional Links */}
        <li>
          <Link to='/classes' className={`${finalClass} font-medium text-base hover:text-accent transition-colors`}>Classes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;