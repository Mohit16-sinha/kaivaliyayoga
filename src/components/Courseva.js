import React from "react";

// import data
import { courses } from "../data";

// import icons
import { BsStarFill } from "react-icons/bs";

const Coursevacomponent = () => {
  return (
    <div className="section-sm lg:section-lg">
      <div className="container mx-auto">
        {/* text */}
        <div className="text-center mb-16 lg:mb-32">
          <h2 className="h2 mb-3 lg:mb-[18px]">Popular Courses</h2>
          <p className="max-w-[480px] mx-auto">
            Practice anywhere, anytime. Explore a new way to exercise and learn
            more about yourself. We are providing the best.
          </p>
        </div>
        {/* course list */}
        <div className="flex flex-col lg:flex-row lg:gap-x-[33px] gap-y-24 mb-7 lg:mb-14">
          {courses.length > 0 ? (
            courses.map((item, index) => {
              // destructure item
              const { image, title, desc, link, rating = 5 } = item || {};
              return (
                <div
                  className="w-full bg-white hover:shadow-primary max-w-[368px] px-[18px] pb-[26px] lg:px-[28px] lg:pb-[38px] flex flex-col rounded-[14px] mx-auto transition transform hover:scale-105"
                  key={index}
                >
                  <div className="-mt-[38px] lg:-mt-12 mb-4 lg:mb-6">
                    <img src={image} alt={title} />
                  </div>
                  {/* text */}
                  <div>
                    <h4 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4">
                      {title}
                    </h4>
                    <p>{desc}</p>
                  </div>
                  {/* bottom */}
                  <div className="bg-pink-100 flex items-center justify-between mt-8 mb-2 lg:mb-0 px-4 py-2 rounded-lg">
                    {/* stars */}
                    <div className="flex text-orange-500 gap-x-2">
                      {[...Array(rating)].map((_, i) => (
                        <BsStarFill key={i} />
                      ))}
                    </div>
                    {/* Link */}
                    <a
                      href="#"
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      {link}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">
              No courses available at the moment.
            </p>
          )}
        </div>

        {/* btn */}
        <div className="flex justify-center mt-8">
          <button className="btn btn-sm btn-orange px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
            Browse all
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coursevacomponent;
