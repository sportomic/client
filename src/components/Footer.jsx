// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white text-center p-4">
//       <p>&copy; {new Date().getFullYear()} PlayVerse. All rights reserved.</p>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
import img1 from "../assets/images/GetItOnPlayStore.png";
import img2 from "../assets/images/GetItOnAppStore.png";

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "#D6E7DA" }}
      className=" text-gray-800 py-6"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
        {/* Left Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <h2 style={{ color: "#008080" }} className="font-bold  text-2xl">
            SPORTOMIC
          </h2>

          {/* App Buttons */}
          <div className="flex space-x-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.sportomic.user&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={img1}
                //alt="Get it on Google Play"
                className="h-10"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/sportomic/id6596766098"
              target="_blank"
              rel="noopener noreferrer"
              src="./assets/images/GetItOnAppStore.png"
            >
              <img
                src={img2}
                //alt="Download on the App Store"
                className="h-10"
              />
            </a>
          </div>

          {/* Social Media and Contact */}
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
            <p className="text-gray-600">+917899152424</p>
            <p className="text-gray-600">help@sportomic.com</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end space-y-2">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link to="/events" className="text-gray-600 hover:text-gray-800">
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
