import React from "react";

const Contact = () => {
  return (
    <section className="section bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 py-12 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <div className="bg-gradient-to-br from-pink-400 to-white opacity-20 w-32 h-32 rounded-full blur-2xl absolute top-10 left-20"></div>
        <div className="bg-gradient-to-br from-pink-400 to-white opacity-20 w-40 h-40 rounded-full blur-2xl absolute bottom-10 right-20"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white animate-fadeIn">
            Contact Us
          </h2>
          <p className="text-pink-100 mt-2 animate-fadeIn delay-200">
            Have questions? We’d love to hear from you. Reach out to us below!
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 animate-slideInUp">
          <form>
            {/* Name Input */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Message Textarea */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-textarea w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300"
                rows="5"
                placeholder="Type your message here"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold py-3 rounded-md shadow-md hover:bg-pink-600 hover:scale-105 transition-transform duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
