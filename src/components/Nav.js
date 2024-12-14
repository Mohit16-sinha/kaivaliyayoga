import React from "react";

// Import navigation data
import { navigation } from "../data";

const Nav = () => {
  return (
    <nav className="ml-[70px]">
      <ul className="flex gap-x-[42px]">
        {navigation.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="text-heading text-lg hover:text-orange-500 transition-colors"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
