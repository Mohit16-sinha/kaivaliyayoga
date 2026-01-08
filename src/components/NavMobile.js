import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//import menu
import { BiMenu } from 'react-icons/bi';

//import data
import { navigation } from '../data';

const NavMobile = () => {
  const [isOpen, setIsopen] = useState(false);
  return <nav>
    <div onClick={() => setIsopen(!isOpen)} className='cursor-pointer text-4xl text-heading ml-[10px] lg:hidden'>
      <BiMenu />
    </div>
    <ul className={`${isOpen ? 'max-h-60 p-8' : 'max-h-0 p-0'}flex flex-col absolute w-full bg-white top-24 left-0 shadow-primary space-y-6 overflow-hidden tranisition-all`}>
      {navigation.map((item, index) => {
        return (
          <li key={index}>
            <a href={item.href}>{item.name}
            </a>
          </li>
        );
      })}
      <li>
        <Link to='/classes'>Classes</Link>
      </li>
    </ul>


  </nav>;
};

export default NavMobile;