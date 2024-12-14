import React from "react";
import Logo from "../assets/img/cards/logo.webp";
import { FaYoutube, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="pb-16 pt-8 bg-white text-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col justify-between items-center lg:flex-row gap-y-6">
          {/* Logo */}
          <a href="/">
            <img src={Logo} alt="Company Logo" className="w-[150px]" />
          </a>

          {/* Copyright Text */}
          <p className="text-sm">&copy; 2024. All rights reserved.</p>

          {/* Social Media Icons */}
          <div className="flex gap-x-6 text-lg">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <div className="w-[50px] h-[50px] bg-gray-100 text-red-500 rounded-full flex justify-center items-center shadow-lg hover:scale-110 transition">
                <FaYoutube />
              </div>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <div className="w-[50px] h-[50px] bg-gray-100 text-pink-500 rounded-full flex justify-center items-center shadow-lg hover:scale-110 transition">
                <FaInstagram />
              </div>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <div className="w-[50px] h-[50px] bg-gray-100 text-gray-800 rounded-full flex justify-center items-center shadow-lg hover:scale-110 transition">
                <FaGithub />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
