import React,{useState,useEffect} from 'react';

import Nav from './Nav';
import NavMobile from './NavMobile';

//import logo
import images2 from '../images2/kaivaliyayoga-logo-.png';

const Header = () => {
  const[header ,setHeader] = useState(false);

  useEffect(()=>{
    window.addEventListener('scroll', ()=>{
      window.scrollY >36 ? setHeader(true) : setHeader (false);
    });
  });

  return (
    <header  className={`${header ? 'top-0' : 'top-9'} fixed w-full ${
      header ? 'bg-white-200 text-white' : 'bg-red-500 text-black flex items-center justify-between   '
    }`}>

     <div className = "flex items-center">
      <a href="#">
       <img src = {images2} alt ='' className="w-12 h-auto"/>
      </a>
      <div className ='hidden lg:flex'>
        <nav/>
      </div> 
     </div>
     <div>
     <div className="flex gap-4 lg:gap-9">
       <button className="text-gray-800 font-medium text-sm lg:text-base hover:text-yellow-500 transition">
         Sign In
       </button>
       <button className="px-4 py-2 lg:px-6 bg-orange-100 border border-orange-300 text-orange-700 font-medium text-sm lg:text-base rounded-md hover:bg-orange-200 hover:text-white transition">
          sign Up
       </button>
      </div>

      {/* nav mobile*/}
      <NavMobile/>
     </div>
      
    </header>
  );
};

export default Header;