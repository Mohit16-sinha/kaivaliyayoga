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
    <section className="section-sm lg:section-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 min-h-[520px]">
      <div className="container mx-auto">
        {/* Text */}
        <div className="border-[8px] border-purple-300 rounded-lg text-center pt-[70px] pb-12 bg-gradient-to-r from-purple-600 to-blue-500">
          <h4 className="text-[26px] text-white font-bold mb-[14px]">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-purple-200 mb-12">
            Subscribe to our newsletter for exciting updates and offers.
          </p>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-[752px] mx-auto relative flex flex-col lg:flex-row gap-y-6 p-4 lg:p-0 gap-x-4"
          >
            <div className="w-full relative flex">
              {/* Icon */}
              <div className="absolute left-2 h-full w-12 flex justify-center items-center text-2xl text-purple-300">
                <MdEmail />
              </div>
              {/* Email Input */}
              <input
                className={`form-control w-full border ${
                  error ? 'border-red-500' : 'border-purple-400'
                } bg-transparent outline-none placeholder:text-purple-200 text-white pl-[60px] focus:border-purple-500 transition-all`}
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            <button
              className="btn btn-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white w-full lg:max-w-[180px] hover:shadow-lg transition-all duration-300"
              type="submit"
            >
              Get started
            </button>
          </form>
          {/* Validation Feedback */}
          {error && (
            <p className="text-red-400 mt-2">Please enter a valid email address.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
