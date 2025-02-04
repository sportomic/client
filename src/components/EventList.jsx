import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Share2, MapPin, Calendar } from "lucide-react";
import { apiUrl } from "../contant";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [availableSports, setAvailableSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(selectedSport);
  }, [selectedSport]);

  const fetchEvents = async (sport) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/events?sport=${sport}`);
      const { events: data, availableSports } = response.data;

      // Sort events by how close they are to the current date (latest date first)
      const sortedEvents = data.sort((a, b) => {
        const currentDate = new Date();
        const diffA = Math.abs(new Date(a.date) - currentDate);
        const diffB = Math.abs(new Date(b.date) - currentDate);
        return diffA - diffB;
      });

      console.log(events);
      setEvents(sortedEvents);
      setAvailableSports(["all", ...availableSports]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleBookNow = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>

      {/* Filter Bar */}
      <div className="mb-8 overflow-x-auto whitespace-nowrap flex space-x-4 p-2 bg-gray-100 rounded-lg">
        {availableSports.map((sport) => (
          <button
            key={sport}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSport === sport
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedSport(sport)}
          >
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="max-w-sm w-full mx-auto bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={event.venueImage || "/api/placeholder/400/320"}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute bottom-4 right-4 px-4 py-1 rounded-full text-sm font-medium ${
                  event.slotsLeft > 0
                    ? "bg-red-500 text-white"
                    : "bg-gray-500 text-gray-100"
                }`}
              >
                {event.slotsLeft > 0
                  ? `${event.slotsLeft} Slot${
                      event.slotsLeft !== 1 ? "s" : ""
                    } Left!`
                  : "Sold Out"}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {event.name}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">{event.location}</span>
                <span className="text-gray-600">{event.venueName}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-gray-900">
                    INR {event.price || "99.00"}
                  </span>
                  <span className="text-gray-600 ml-1">/ PERSON</span>
                </div>
                <button
                  onClick={() => handleBookNow(event._id)}
                  className="px-8 py-2 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
