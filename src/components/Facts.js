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
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Facts Section */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
              {facts.map((item, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-lg shadow-md text-white ${item.color}`}
                >
                  <h2 className="text-4xl font-bold mb-2">
                    <CountUp end={item.number} duration={2} enableScrollSpy />
                    {item.unit}
                  </h2>
                  <p className="text-lg font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 lg:text-right text-center">
            <img
              src={image}
              alt="Personalized Yoga"
              className="w-64 h-64 mx-auto lg:ml-auto lg:mr-0 rounded-full border-4 border-gray-200"
            />
            <h3 className="mt-6 text-2xl font-semibold text-gray-700">
              Relax and enjoy a personalized yoga day with us
            </h3>
            <p className="mt-2 text-lg text-gray-600">
              Experience the perfect blend of relaxation and rejuvenation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facts;
