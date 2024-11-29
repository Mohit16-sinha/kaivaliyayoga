import React from 'react';

// Import images
import card1 from '../assets/img/cards/card-1.png';
import card2 from '../assets/img/cards/card-2.png';
import card3 from '../assets/img/cards/card-3.png';
import bg from '../assets/img/cards/bg (1).png';

const Cards = () => {
  return ( 
    <section className='bg-cardBg min-h-[260px] pb[55px] lg:-mt-24'> 
      <div className='container mx-auto'>
        <div>
        {/* card 1 */}
          <div className='bg-white w-full max-w-[282] p-[14px] lg:p-[26px] shadow-2x1 rounded-md max-h-[282px]'>

          {/* card text */}
          <div className='flex items-center mb-[18px] lg:mb-[28px]'>
          <h4 className='text-lg lg:text-2x1 lg:leading-7 font-bold text-heading mr-8 '>
          Make your own plan for Yoga 
          </h4>
          <h2 className='h2 text-stroke-2,'>1</h2>
          </div> 
          {/* card image */}
          <div>
          <img src={card1} alt=''/>
          </div> 
          </div>

          {/* card 2 */}
          <div className='bg-white w-full max-w-[282] p-[14px] lg:p-[26px] shadow-2x1 rounded-md max-h-[282px]'>

          {/* card text */}
          <div className='flex items-center mb-[18px] lg:mb-[28px]'>
          <h4 className='text-lg lg:text-2x1 lg:leading-7 font-bold text-heading mr-8 '>
          Make your own plan for Yoga 
          </h4>
          <h2 className='h2 text-stroke-2,'>1</h2>
          </div> 
        </div>
        <div>
          <img src={card2} alt=''/>
          </div> 
          </div>

        {/* card 3 */}
        <div> card3 </div>
      </div>
    </section>
  );
};

export default Cards;
