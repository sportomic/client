import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { useAdmin } from "../contexts/AdminContext.jsx"; // Import useAdmin from AdminContext

const HeaderAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin(); // Get the logout function from AdminContext

  const handleNavigation = () => {
    setIsOpen(false); // Close menu when logo is clicked
    navigate("/");
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close menu when any link is clicked
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AdminContext
    setIsOpen(false); // Close menu when logout button is clicked
    navigate("/login"); // Navigate to login page
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <h1 className="font-bebas text-4xl">
            <button onClick={handleNavigation} className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
              <span className="text-[#008080] font-bebas text-5xl pt-1.5">
                SPORTOMIC
              </span>
              <span className="text-transparent [-webkit-text-stroke:1px_#27262a]"></span>
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
          {[
            { path: "/admin", label: "Manage Event" },
            { path: "/add-event", label: "Add Event" },
            { path: "/download", label: "Download Report" },
          ].map((item) => (
            <li key={item.path} className="md:inline-block">
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`block text-center font-Outfit text-2xl text-black font-semibold py-2 px-4 transition-all duration-300 ${
                  location.pathname === item.path
                    ? "underline underline-offset-4 decoration-teal-500"
                    : "hover:text-teal-500 hover:no-underline"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="md:hidden">
            <button
              onClick={handleLogout}
              className="block text-center font-Outfit text-2xl text-[#27262a] font-semibold py-2 px-4 w-full"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:block bg-[#263238] text-white rounded-full px-6 h-12"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
