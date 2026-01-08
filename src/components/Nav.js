import React from 'react';
import { navigation } from '../data';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className='ml-[70px]'>
      <ul className='flex gap-[42px]'>
        {navigation.map((item, index) => {
          return (
            <li key={index}>
              <Link
                to={item.href}
                className='text-earth-900 font-medium text-base hover:text-accent transition-colors'
              >
                {item.name}
              </Link>
            </li>
          );
        })}
        {/* Additional Links */}
        <li>
          <Link to='/classes' className='text-earth-900 font-medium text-base hover:text-accent transition-colors'>Classes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;