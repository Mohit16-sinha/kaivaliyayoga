import React, { useState } from 'react';

//import icons
import { MdEmail } from 'react-icons/md';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError(true);
    } else {
      setError(false);
      alert('Subscribed successfully!');
    }
  };

  return (
    <section className="section-sm lg:section-lg bg-gradient-to-r from-white via-pink-300 to-pink-500 min-h-[520px]">
      <div className="container mx-auto">
        {/* Text */}
        <div className="border-[8px] border-pink-400 rounded-lg text-center pt-[70px] pb-12 bg-gradient-to-r from-pink-200 to-white shadow-lg">
          <h4 className="text-[26px] text-pink-700 font-bold mb-[14px]">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-pink-600 mb-12">
            Subscribe to our newsletter for exciting updates and offers.
          </p>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-[752px] mx-auto relative flex flex-col lg:flex-row gap-y-6 p-4 lg:p-0 gap-x-4"
          >
            <div className="w-full relative flex">
              {/* Icon */}
              <div className="absolute left-2 h-full w-12 flex justify-center items-center text-2xl text-pink-500">
                <MdEmail />
              </div>
              {/* Email Input */}
              <input
                className={`form-control w-full border ${
                  error ? 'border-red-500' : 'border-pink-400'
                } bg-transparent outline-none placeholder:text-pink-400 text-pink-700 pl-[60px] focus:border-pink-500 transition-all`}
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            <button
              className="btn btn-lg bg-gradient-to-r from-pink-500 to-pink-400 text-white w-full lg:max-w-[180px] hover:shadow-lg hover:scale-105 transition-all duration-300"
              type="submit"
            >
              Get started
            </button>
          </form>
          {/* Validation Feedback */}
          {error && (
            <p className="text-red-500 mt-2">Please enter a valid email address.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
