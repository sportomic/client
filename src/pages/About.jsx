import React from "react";
import img1 from "../assets/images/i1_booking.jpg";
import img2 from "../assets/images/i1_coaching.jpg";
import img3 from "../assets/images/i1.jpg";

const AboutUs = () => {
  return (
    <div className="p-6 sm:p-12 mt-20 bg-gray-100">
      {/* Heading Section */}
      <h1 className="text-3xl sm:text-5xl font-bold text-center mb-6 text-gray-800">
        About Us
      </h1>

      {/* Textual Content */}
      <p className="text-lg sm:text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
        Sportomic makes it easy to play your favorite sport — anytime, anywhere.
        Find nearby venues, join sports events, connect with playmates and
        coaches, and explore updates, gear, and more—all in one place.
      </p>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Book sports venue
          </h2>
          <img
            src={img1}
            alt="Book Sports Venue"
            className="rounded-md mb-4 object-cover h-40 w-full"
          />
          <p className="text-gray-600 text-center">
            Easily find and book top-rated courts, playgrounds, and arenas near
            you.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coaching assistance
          </h2>
          <img
            src={img2}
            alt="Coaching Assistance"
            className="rounded-md mb-4 object-cover h-40 w-full"
          />
          <p className="text-gray-600 text-center">
            Connect with certified coaches for expert tips on fitness,
            nutrition, and skills to up your game.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Stay Updated
          </h2>
          <img
            src={img3}
            alt="Stay Updated"
            className="rounded-md mb-4 object-cover h-40 w-full"
          />
          <p className="text-gray-600 text-center">
            Explore sports news, join discussions, and share your thoughts with
            a passionate sports community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
