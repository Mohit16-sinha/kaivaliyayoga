import React from 'react';
import { BsPlayCircleFill } from 'react-icons/bs';

// Import the yoga video thumbnail
import yogaThumbnail from '../assets/img/videologo.webp'; // Adjust the path as necessary

const Features = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Explore Yoga with Us</h2>
        <p className="mb-8 text-gray-600">
          Relax and enjoy a personalized yoga experience designed just for you.
        </p>
        <div className="relative inline-block">
          {/* Thumbnail */}
          <img
            src={yogaThumbnail}
            alt="Yoga Video Thumbnail"
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
          {/* Play Icon */}
          <BsPlayCircleFill
            className="absolute text-white text-6xl inset-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
