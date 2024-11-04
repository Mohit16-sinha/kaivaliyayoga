import React,{useState,useEffect} from 'react';

import Nav from './Nav';
import NavMobile from './NavMobile';

//import logo
import images2 from '../images2/kaivaliyayoga-logo-.png';

const Header = () => {
  const[header ,setHeader] = useState(false);

  return (
    <header  className={`${header ? 'top-0' : 'top-9'} fixed w-full ${
      header ? 'bg-pink-200 text-white' : 'bg-blue-500 text-black'
    }`}>
      Header
    </header>
  );
  
};

export default Header;