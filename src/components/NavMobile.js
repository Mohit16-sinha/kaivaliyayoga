import React, { useState } from "react";

// Import menu icon
import { BiMenu } from "react-icons/bi";

// Import navigation data
import { navigation } from "../data";

const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="lg:hidden relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="cursor-pointer text-4xl text-heading ml-[10px] focus:outline-none"
      >
        <BiMenu />
      </button>

      {/* Menu Items */}
      <ul
        id="mobile-menu"
        className={`${
          isOpen ? "max-h-60 p-6" : "max-h-0 p-0"
        } flex flex-col absolute w-full bg-white top-16 left-0 shadow-md space-y-6 overflow-hidden transition-all duration-300`}
      >
        {navigation.map((item, index) => (
          <li key={index} className="text-heading text-lg hover:text-orange-500 transition-colors">
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMobile;
