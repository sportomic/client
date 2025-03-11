import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

// Import your images (assuming the import paths remain the same)
import group from "../assets/images/groupImage.jpg";
import about from "../assets/images/about.jpg";
import playverse from "../assets/images/playverseInfo.png";
import logo from "../assets/images/logo.svg";

// Sport icons
import badminton from "../assets/images/AboutUS/badminton.svg";
import cricket from "../assets/images/AboutUS/Cricket.svg";
import Tennis from "../assets/images/AboutUS/Tannis.svg";
import football from "../assets/images/AboutUS/football.svg";
import tabletannis from "../assets/images/AboutUS/TableTennis.svg";
import pickelball from "../assets/images/AboutUS/pickelball.svg";
import basketball from "../assets/images/AboutUS/basketball.svg";
import chess from "../assets/images/AboutUS/Chess.svg";

// Counter Component
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, duration / 50);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-4xl font-bold text-blue-600">
      {count}
      {suffix}+
    </div>
  );
};

const AboutUs = () => {
  const sports = [
    {
      name: "Badminton",
      src: badminton,
      link: "https://chat.whatsapp.com/LfxFKDeMPb2AbvCrXU6TM8",
    },
    {
      name: "Tennis",
      src: Tennis,
      link: "https://chat.whatsapp.com/IFRPeDTT88XJtXuuq5OZHs",
    },
    {
      name: "Box Cricket",
      src: cricket,
      link: "https://chat.whatsapp.com/Dgp0JeCKYJELFcyT3zJx4y",
    },
    {
      name: "Football",
      src: football,
      link: "https://chat.whatsapp.com/LmNnNeMZzLRA57M5PGxpDk",
    },
    {
      name: "Table Tennis",
      src: tabletannis,
      link: "https://chat.whatsapp.com/JYO1hFXBSxrDcPUtZHRPdV",
    },
    {
      name: "Basketball",
      src: basketball,
      link: "https://chat.whatsapp.com/C9SOjkXfuvG06auFrdcZUr",
    },
    {
      name: "Pickleball",
      src: pickelball,
      link: "https://chat.whatsapp.com/HIOW9Evv62P5bxLVLzjT9C",
    },
    {
      name: "Chess",
      src: chess,
      link: "https://chat.whatsapp.com/DZXPwGyrU0yDf10G3iV8c6",
    },
  ];

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-12">
      <div className="max-w-7xl  mx-auto">
        {/* Logo and Heading */}
        <div className="text-center mb-16">
          <img
            src={logo}
            alt="Bluejersey18"
            className="mx-auto mb-6 w-28 h-28 rounded-full shadow-lg transform hover:scale-110 transition-transform"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Ahmedabad's Biggest Sports Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting sports enthusiasts, providing venues, coaching, and a
            vibrant community experience
          </p>
        </div>

        {/* Community Statistics Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-10">
            Our Community Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Counter end={900} />
              <p className="text-xl text-gray-600 mt-4">Active Users</p>
            </div>
            <div>
              <Counter end={1950} />
              <p className="text-xl text-gray-600 mt-4">
                WhatsApp Community Members
              </p>
            </div>
            <div>
              <Counter end={1000} />
              <p className="text-xl text-gray-600 mt-4">Games Conducted</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              img: about,
              title: "Book Sports Venue",
              desc: "Easily find and reserve top-quality sports facilities near you",
            },
            {
              img: group,
              title: "Coaching Assistance",
              desc: "Connect with professional coaches to elevate your game",
            },
            {
              img: playverse,
              title: "Stay Updated",
              desc: "Get the latest sports events, news, and community updates",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-10">
            Join Our Sports Communities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6">
            {sports.map((sport, index) => (
              <a
                href={sport.link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-50 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-center">
                  <img
                    src={sport.src}
                    alt={sport.name}
                    className="w-16 h-10 object-contain transform transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-center text-gray-700 font-semibold group-hover:text-blue-600">
                  {sport.name}
                  <ArrowUpRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
