import React from 'react';

// Import react-countup
import CountUp from 'react-countup';

// Import image
import image from '../assets/img/cards/logo.webp';

// Facts data
const facts = [
  { number: 5, unit: '+', text: 'Years of Experience', color: 'bg-blue-500' },
  { number: 5, unit: 'k+', text: 'Happy Clients', color: 'bg-green-500' },
  { number: 15, unit: '+', text: 'Experienced Trainers', color: 'bg-yellow-500' },
  { number: 24, unit: '+', text: 'Monthly Classes', color: 'bg-red-500' },
];

const Facts = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        {/* Facts Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((item, index) => {
            return (
              <div
                key={index}
                className={`text-center p-6 rounded-lg shadow-md text-white ${item.color}`}
              >
                {/* Display number with CountUp */}
                <h2 className="text-4xl font-bold mb-2">
                  <CountUp end={item.number} duration={2} enableScrollSpy />
                  {item.unit}
                </h2>
                {/* Display fact text */}
                <p className="text-lg font-medium">{item.text}</p>
              </div>
            );
          })}
        </div>

        {/* Image and Text Section */}
        <div className="mt-12 text-center">
          <img
            src={image}
            alt="John Cena"
            className="w-40 mx-auto rounded-full border-4 border-gray-200"
          />
          <h3 className="mt-4 text-2xl font-semibold text-gray-700">
            Relax and enjoy a personalized yoga day with us
          </h3>
          <p className="mt-2 text-lg text-gray-600">
            Experience the perfect blend of relaxation and rejuvenation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Facts;
