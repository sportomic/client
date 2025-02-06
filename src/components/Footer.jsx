import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/GetItOnPlayStore.png";
import img2 from "../assets/images/GetItOnAppStore.png";
import logo from "../assets/images/logo.svg";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    console.log("Navigating to Home Page...");
    navigate("/");
  };

  return (
    <footer
      style={{ backgroundColor: "#D6E7DA" }}
      className="text-gray-800 py-6"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="flex flex-col space-y-4 md:items-start items-center">
          <div className="flex items-center md:justify-start justify-center w-full">
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

          {/* App Buttons */}
          <div className="flex space-x-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.sportomic.user&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={img1} className="h-10" />
            </a>
            <a
              href="https://apps.apple.com/in/app/sportomic/id6596766098"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={img2} className="h-10" />
            </a>
          </div>

          {/* Social Media and Contact */}
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/go.sportomic/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaInstagram size={30} className="text-pink-600" />
              </a>
              <a
                href="https://www.linkedin.com/company/sportomic/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaLinkedin size={30} className="text-blue-600" />
              </a>
            </div>
            <p className="text-gray-600">+917899152424</p>
            <p className="text-gray-600">help@sportomic.com</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end space-y-2 mt-6 md:mt-0">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Events
          </Link>
          <Link to="/contactus" className="text-gray-600 hover:text-gray-800">
            Contact Us
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-800">
            About Us
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 mt-6 pt-4 text-center">
        <p className="text-sm text-gray-500">
          © 2024 Bluejersey18 Technologies Private Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
