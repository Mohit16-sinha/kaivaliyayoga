import React from 'react';
import { BsPlayCircleFill } from 'react-icons/bs';

// Facts Section
const Features = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Yoga with Us</h2>
          <p className="text-gray-600">
            Relax and enjoy a personalized yoga experience designed just for you.
          </p>
        </div>

        {/* Video Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* YouTube Video */}
          <div className="relative w-full lg:w-1/2 text-center">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your YouTube video URL
              title="Yoga Video"
              frameBorder="5"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>

          {/* Text Content */}
          <div className="flex flex-col lg:w-1/2 items-start text-left">
            <div className="w-9 h-[2px] bg-orange mb-2 lg:w-[70px] rounded-full"></div>
            <h2 className="text-2xl font-bold mb-4">
              The Better Way to <br /> Start Yoga
            </h2>
            <p className="max-w-[360px] mb-[18px] lg:mb-[38px]">
              Practice anywhere, anytime. Explore a new way to exercise and learn more about yourself. We are providing the best.
            </p>
            <button className="btn btn-sm bg-orange-500 text-white hover:bg-orange-600 transition-all rounded-lg px-6 py-3">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
