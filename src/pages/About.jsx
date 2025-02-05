import React from "react";
import group from "../assets/images/groupImage.jpg";
import about from "../assets/images/about.jpg";
import playverse from "../assets/images/playverseInfo.png";
import logo from "../assets/images/logo.svg";
import badminton from "../assets/images/AboutUS/badminton.svg";
import cricket from "../assets/images/AboutUS/Cricket.svg";
import Tennis from "../assets/images/AboutUS/Tannis.svg";
import football from "../assets/images/AboutUS/football.svg";
import tabletannis from "../assets/images/AboutUS/TableTennis.svg";
import pickelball from "../assets/images/AboutUS/pickelball.svg";
import basketball from "../assets/images/AboutUS/basketball.svg";
import chess from "../assets/images/AboutUS/Chess.svg";

const AboutUs = ({ className, ...props }) => {
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
      link: " https://chat.whatsapp.com/Dgp0JeCKYJELFcyT3zJx4y",
    },
    {
      name: "Football",
      src: football,
      link: "https://chat.whatsapp.com/LmNnNeMZzLRA57M5PGxpDk",
    },
    {
      name: "Table Tennis",
      src: tabletannis,
      link: " https://chat.whatsapp.com/JYO1hFXBSxrDcPUtZHRPdV",
    },
    {
      name: "Basketball",
      src: basketball,
      link: "https://chat.whatsapp.com/C9SOjkXfuvG06auFrdcZUr",
    },
    {
      name: "Pickleball",
      src: pickelball,
      link: " https://chat.whatsapp.com/HIOW9Evv62P5bxLVLzjT9C",
    },
    {
      name: "Chess",
      src: chess,
      link: "https://chat.whatsapp.com/DZXPwGyrU0yDf10G3iV8c6",
    },
  ];

  return (
    <div className="p-6 sm:p-12 mt-20 bg-gray-100">
      {/* Heading Section */}

      {/* logo  */}
      <img
        src={logo}
        alt="Bluejersey18"
        className="object-contain w-20 h-20 mx-auto mb-5"
      />

      <header className="text-center  px-6">
        <h2 className="text-3xl font-bold text-black-800">Ahmedabad's</h2>
        <h2 className="text-3xl font-bold text-black-800">Biggest</h2>
        <h2 className="text-3xl font-bold text-black-800">Sports Community</h2>
      </header>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <img
            src={about}
            alt="Book Sports Venue"
            className="rounded-md mb-4 object-cover h-30 w-full"
          />
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <img
            src={group}
            alt="Coaching Assistance"
            className="rounded-md mb-4 object-cover h-30 w-full"
          />
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <img
            src={playverse}
            alt="Stay Updated"
            className="rounded-md mb-4 object-cover h-30 w-full"
          />
        </div>
      </div>
      <div
        className={"bg-[#ffffff] relative overflow-hidden  pt-20" + className}
      >
        <div className="text-[#008080] text-center font-['OpenSans-Bold'] text-2xl font-bold mt-5 ">
          Join the WhatsApp community as per your sport
        </div>
        <div className="bg-[#ffffff] rounded-[10px] border border-[#000000] p-5 max-w-4xl mx-auto my-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sports.map((sport, index) => (
              <a
                href={sport.link}
                key={index}
                className="bg-[#ffffff] flex flex-col items-center justify-center p-3 rounded shadow hover:shadow-lg"
              >
                <img
                  src={sport.src}
                  alt={sport.name}
                  className="h-[50px] mb-2"
                />
                <div className="text-center text-[#000000] font-['OpenSans-Regular'] text-xs">
                  {sport.name}
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
