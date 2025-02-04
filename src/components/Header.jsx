import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Only import from react-router-dom

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = () => {
    console.log("Navigating to Home Page...");
    navigate("/");
  };

  return (
    <header className="fixed top-0 w-full bg-white/10 backdrop-blur-lg shadow-lg z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <h1 className="font-bebas text-4xl">
            <button onClick={() => handleNavigation()}>
              <span className="font text-[#202d37]">SPORTOMIC </span>
            </button>
          </h1>
        </div>

        {/* Burger Menu for Mobile */}
        <button
          className="md:hidden text-[#27262a]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-20 left-0 w-full bg-white md:static md:flex md:gap-8 md:w-auto`}
        >
          <li className="md:inline-block">
            <Link
              to="/events"
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 hover:text-blue-500"
            >
              Event
            </Link>
          </li>
          <li className="md:inline-block">
            <Link
              to="/about"
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 hover:text-blue-500"
            >
              About Us
            </Link>
          </li>
          <li className="md:inline-block">
            <Link
              to="/contact"
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 hover:text-blue-500"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Button */}
        <button className="hidden md:block bg-[#263238] text-white rounded-full px-6 h-12">
          GET OUR APP
        </button>
      </div>
    </header>
  );
};

export default Header;
