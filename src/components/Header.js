import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import NavMobile from "./NavMobile";

// Import logo
import firstLogo from "../images2/kaivaliyayoga-logo-.png";

const Header = () => {
  const [header, setHeader] = useState(false);
  const [navMobileVisible, setNavMobileVisible] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHeader(window.scrollY > 36);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        header ? "bg-white text-black shadow-md top-0" : "bg-red-500 text-white top-9"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:py-5">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#">
            <img src={firstLogo} alt="Logo" className="w-12 h-auto" />
          </a>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex ml-6">
            <Nav />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Sign-In and Sign-Up Buttons */}
          <div className="hidden lg:flex gap-4">
            <button className="text-gray-800 font-medium text-sm lg:text-base hover:text-yellow-500 transition">
              Sign In
            </button>
            <button className="px-4 py-2 lg:px-6 bg-orange-100 border border-orange-300 text-orange-700 font-medium text-sm lg:text-base rounded-md hover:bg-orange-200 hover:text-white transition">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavMobileVisible(!navMobileVisible)}
            className="lg:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {navMobileVisible && (
        <div className="lg:hidden bg-white text-black absolute top-full left-0 w-full shadow-md">
          <NavMobile />
        </div>
      )}
    </header>
  );
};

export default Header;
