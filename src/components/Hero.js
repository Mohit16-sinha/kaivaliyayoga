import React from 'react';
import HeroImage from '../images2/img6.jpg.jpg';

const Hero = () => {
  return (
    <section
      className="h-screen w-full bg-gray-900 bg-cover bg-center bg-no-repeat relative flex items-center justify-center -mt-[100px]"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center text-white relative">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
          Yoga for <span className="text-accent">Inner Peace</span>
        </h1>
        <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 text-gray-100 font-light leading-relaxed">
          Reconnect with your inner self through the ancient practice of Yoga.
          Find balance, strength, and serenity in every breath.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-hover transition-all transform hover:scale-105 shadow-lg">
            Get Started
          </button>
          <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/50 text-white font-semibold rounded-full hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;