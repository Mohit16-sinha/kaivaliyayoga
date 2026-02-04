import React from 'react';

// Import images
import card1 from '../assets/img/cards/pexels-cedric-fauntleroy-7220623.jpg';
import card2 from '../assets/img/cards/samantha-borges-gXsJ9Ywb5as-unsplash.jpg';
import card3 from '../assets/img/cards/vitaly-gariev-JyPAY9-WNE8-unsplash.jpg';
import bg from '../assets/img/cards/bg (1).png';

const Cards = () => {
  return (
    <section
      className="bg-cardBg min-h-[260px] pb-[55px] lg:-mt-24"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto">
        {/* Card Container */}
        <div className="flex flex-col lg:flex-row gap-x-[32px] gap-y-[32px]">
          {/* Row 1: Card 1 & Card 2 (Horizontal Alignment) */}
          <div className="flex flex-col lg:flex-row gap-x-[32px]">
            {/* Card 1 */}
            <div className="bg-white w-full max-w-[282px] p-[14px] lg:p-[26px] shadow-2xl rounded-md">
              {/* Card Text */}
              <div className="flex items-center mb-[18px] lg:mb-[28px]">
                <h4 className="text-lg lg:text-2xl lg:leading-7 font-bold text-heading mr-8">
                  Make your own plan for Yoga
                </h4>
                <h2 className="h2 text-stroke-2">1</h2>
              </div>
              {/* Card Image */}
              <div>
                <img src={card1} alt="Card 1" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white w-full max-w-[282px] p-[14px] lg:p-[26px] shadow-2xl rounded-md">
              {/* Card Text */}
              <div className="flex items-center mb-[18px] lg:mb-[28px]">
                <h4 className="text-lg lg:text-2xl lg:leading-7 font-bold text-heading mr-8">
                  Find a Yoga Mentor For You.
                </h4>
                <h2 className="h2 text-stroke-2">2</h2>
              </div>
              {/* Card Image */}
              <div>
                <img src={card2} alt="Card 2" />
              </div>
            </div>
          </div>

          {/* Row 2: Card 3 */}
          <div className="bg-pink-200 w-full max-w-[542px] mx-auto p-[14px] lg:p-[26px] mt-4 lg:mt-0 shadow-2xl rounded-md flex justify-between items-start">
            {/* Card Text */}
            <div className='max-w-[240px] '>
              <div className='flex items-center mb-4 lg:mb-8'>
                <h4 className="text-lg lg:text-2xl lg:leading-7 font-bold">
                  Every-Day Open Master Classes.
                </h4>
                <h2 className='h2 text-stroke-2'>3</h2>
              </div>
              <p className="mt-4">
                We're boosting online yoga by enabling anyone in the world to learn from the best.
              </p>
              <a href="/" className="text-blue-500 underline mt-4 block">
                Read more
              </a>
            </div>
            {/* Card Image */}
            <div>
              <img src={card3} alt="Card 3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cards;
