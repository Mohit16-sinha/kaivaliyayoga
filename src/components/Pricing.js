import React, { useState } from 'react';

// Import data
import { pricing } from '../data';

const PricingComponent = () => {
  const [index, setIndex] = useState(0); // Tracks the selected card
  
  return (
    <section className="section-sm lg:section-lg bg-section">
      <div className="container mx-auto">
        {/* Header Text */}
        <div className="text-center mb-7 lg:mb-[70px] py-10 bg-gradient-to-r from-orange-200 via-pink-200 to-yellow-200 rounded-lg shadow-lg">
         <h2 className="h2 mb-3 lg:mb-[18px] text-3xl lg:text-4xl font-semibold text-gray-800 shadow-md">
           Pick a Pricing Plan
         </h2>
         <p className="max-w-[398px] mx-auto text-lg text-gray-700">
          Pick a pricing plan and get started on your journey with us to build your body and mind.
         </p>
        </div>


        {/* Pricing Cards */}
        <div className="flex flex-wrap gap-8 justify-center">
          {pricing.map((card, currentIndex) => {
            const { title, price, list, buttonIcon, buttonText } = card;

            return (
              <div
                onClick={() => setIndex(currentIndex)}
                key={currentIndex}
                className={`bg-white w-full max-w-[368px] min-h-[668px] shadow-lg rounded-lg transition-transform duration-300 cursor-pointer ${
                  index === currentIndex ? 'shadow-orange-500 scale-105' : 'hover:shadow-lg'
                }`}
              >
                {/* Card Top */}
                <div
                  className={`text-center pt-[70px] pb-[34px] border-b border-stroke-3 ${
                    index === currentIndex
                      ? 'bg-orange-100 text-white'
                      : 'bg-white text-heading'
                  } transition`}
                >
                  <h3 className="text-[24px] font-medium mb-[10px]">{title}</h3>
                  <p className="text-[34px] font-bold">{price}</p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-center mb-6 text-sm text-gray-600">
                    Discover your favorite class!
                  </p>

                  {/* Features List */}
                  <ul className="flex flex-col gap-4 mb-10">
                    {list.map((item, itemIndex) => {
                      const { icon, name } = item;

                      return (
                        <li
                          key={itemIndex}
                          className="flex items-center gap-4 border border-stroke-3 p-4 rounded-md"
                        >
                          <div className="flex justify-center items-center bg-green-100 w-8 h-8 text-green-500 text-2xl rounded-full">
                            {icon}
                          </div>
                          <span className="text-gray-700">{name}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Button */}
                  <div className="text-center">
                    <button className="btn flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                      {buttonText}
                      <span className="text-lg">{buttonIcon}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;
