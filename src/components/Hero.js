import React from 'react';

//import Header
import Header from './Header';
import { Parallax } from 'react-parallax';





const Hero = () => {
  return <section ClassName='min-h-[618px] lg:min-h[815px] pt-9 <img src="./images/bg.png" alt=""/>'>
  <div className="container mx-auto">
    <Header/>
    <div>
     <div>
         <h4 className="h4 mb-3 lg:mb-[32px] font-bold">
           yoga to <br/> Release stress 
         </h4>
         <p className= "mb-6 lg;mb-12 max-w-[480px] lg:">
           Yoga is a way of life, rather than a chore.
           Counteract the stress of modern life by
           becoming more mindful and compassionate.
         </p>
         <div className= 'mb-12 space-x-4'>
           <button className='bg-blue-500 text-white px-4 py-2 rounded'onClick={() => alert('Button Clicked!')}>
             Get started
          </button>
          <button className='bg-orange-500 text-white px-4 py-2 rounded' text-heading bg-transparent border>
            Learn more
          </button>
        </div>
      </div>
    </div>
  </div>
  </section>;
};

export default Hero;