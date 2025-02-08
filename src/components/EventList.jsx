import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Share2, MapPin, Calendar } from "lucide-react";
import { apiUrl } from "../contant";
import temp from "../assets/images/playverse.jpg";

import eventImage from "../assets/images/eventImage.png";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [availableSports, setAvailableSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
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

      const sortedEvents = sortEventsByDateAndTime(data);

      setEvents(sortedEvents);
      setAvailableSports(["all", ...availableSports]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const sortEventsByDateAndTime = (events) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Separate events into today, upcoming, and past
    const todayEvents = [];
    const upcomingEvents = [];
    const pastEvents = [];

    events.forEach((event) => {
      const eventDateTime = new Date(event.date);
      const eventDate = new Date(
        eventDateTime.getFullYear(),
        eventDateTime.getMonth(),
        eventDateTime.getDate()
      );

      if (eventDate.getTime() === currentDate.getTime()) {
        todayEvents.push(event);
      } else if (eventDate > currentDate) {
        upcomingEvents.push(event);
      } else {
        pastEvents.push(event);
      }
    });

    // Sort today's events by time
    todayEvents.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });

    // Sort upcoming events by date and time
    upcomingEvents.sort((a, b) => {
      const dateTimeA = new Date(a.date).getTime();
      const dateTimeB = new Date(b.date).getTime();
      return dateTimeA - dateTimeB;
    });

    // Sort past events by date (most recent first)
    pastEvents.sort((a, b) => {
      const dateTimeA = new Date(a.date).getTime();
      const dateTimeB = new Date(b.date).getTime();
      return dateTimeB - dateTimeA;
    });

    // Combine all sorted events
    return [...todayEvents, ...upcomingEvents, ...pastEvents];
  };

  const filterEventsByDate = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (selectedDateFilter) {
      case "today":
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === today.toDateString();
        });
      case "tomorrow":
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === tomorrow.toDateString();
        });
      case "next7days":
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= nextWeek;
        });
      case "past":
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate < today;
        });
      default:
        return events;
    }
  };

  const handleBookNow = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="container mt-40 mx-auto p-6 text-center">
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

  const filteredEvents = filterEventsByDate(events);

  return (
    <div className="container mx-auto mt-20 p-6">
      <div className="bg-white rounded-lg shadow-md w-full md:w-4/5 lg:w-3/5 mx-auto">
        <img
          src={eventImage}
          alt="Image"
          className="w-full h-50 object-cover rounded-t-lg"
        />
      </div>

      {/* Filter Bars */}
      <div className="mt-8 mb-4 overflow-x-auto whitespace-nowrap flex space-x-4 p-2 bg-gray-100 rounded-lg">
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

      {/* Date Filter Bar */}
      <div className="mb-8 overflow-x-auto whitespace-nowrap flex space-x-4 p-2 bg-gray-100 rounded-lg">
        {[
          { id: "all", label: "All" },
          { id: "today", label: "Today" },
          { id: "tomorrow", label: "Tomorrow" },
          { id: "next7days", label: "Next 7 Days" },
          { id: "past", label: "Past Events" },
        ].map((filter) => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDateFilter === filter.id
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedDateFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="max-w-sm w-full mx-auto bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={event.venueImage || temp}
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
              <div>{event.slot}</div>
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
