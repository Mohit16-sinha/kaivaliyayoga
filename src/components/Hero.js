import React from 'react';

const Hero = ({ heading, description, onPrimaryClick, onSecondaryClick }) => {
  return (
    <div className="hero-container bg-blue-500 text-white p-6 rounded-lg">
      <h4 className="text-xl font-bold mb-4">{heading}</h4>
      <p className="mb-6">{description}</p>
      <div className="space-x-4">
        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={onPrimaryClick}>
          Get Started
        </button>
        <button className="bg-transparent text-white px-4 py-2 rounded border border-white" onClick={onSecondaryClick}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Hero;
