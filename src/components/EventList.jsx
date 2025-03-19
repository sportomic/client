import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Share2, MapPin, Calendar } from "lucide-react";
import { apiUrl } from "../contant";
import temp from "../assets/images/playverse.jpg";
import maskgroup5 from "../assets/images/mask-group-5.jpg";
import maskgroup6 from "../assets/images/mask-group-6.jpg";
import maskgroup4 from "../assets/images/mask-group-4.jpg";
import maskgroup3 from "../assets/images/mask-group-3.jpg";
import womens1 from "../assets/images/womens1.png";
import womens2 from "../assets/images/womens2.png";
import Carousel from "./Carousel";

const EventSkeleton = () => {
  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 w-full"></div>
        <div className="p-5">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
    </div>
  );
};

const handleShare = async (event) => {
  const shareUrl = `${window.location.origin}/event/${event._id}`;
  const shareData = {
    title: event.name,
    text: `Check out this event: ${event.name} at ${
      event.location
    } on ${new Date(event.date).toLocaleDateString()}`,
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      // Use Web Share API if available
      await navigator.share(shareData);
    } else {
      // Fallback to copying URL to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert("Event link copied to clipboard!");
    }
  } catch (error) {
    console.error("Error sharing event:", error);
    // Fallback if both methods fail
    alert("Event link copied to clipboard!");
    await navigator.clipboard.writeText(shareUrl);
  }
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [availableSports, setAvailableSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("today");
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
      case "thisweekend":
        const saturday = new Date(today);
        while (saturday.getDay() !== 6) {
          saturday.setDate(saturday.getDate() + 1);
        }
        const sunday = new Date(saturday);
        sunday.setDate(sunday.getDate() + 1);
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.toDateString() === saturday.toDateString() ||
            eventDate.toDateString() === sunday.toDateString()
          );
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
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === today.toDateString();
        });
    }
  };

  const handleBookNow = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 p-6">
        <div className="bg-white rounded-lg shadow-md w-full md:w-4/5 lg:w-3/5 mx-auto">
          <div className="h-50 bg-gray-200 rounded-t-lg animate-pulse"></div>
        </div>
        <FilterSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <EventSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button
            onClick={() => fetchEvents(selectedSport)}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredEvents = filterEventsByDate(events);

  const carouselImages = [
    // womens1,
    // womens2,
    maskgroup6,
    maskgroup5,
    maskgroup4,
    maskgroup3,
  ];

  return (
    <div className="container mx-auto mt-20 p-6">
      <div className="bg-white rounded-lg shadow-md w-full mx-auto">
        <Carousel images={carouselImages} />
      </div>

      <div
        className="sticky top-20 z-10 mt-8 mb-4 p-2 bg-gray-100"
        style={{ backgroundColor: "white" }}
      >
        {/* Sports Filter */}
        <div className="overflow-x-auto whitespace-nowrap flex space-x-4">
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

        {/* Date Filter */}
        <div className="mt-4 overflow-x-auto whitespace-nowrap flex space-x-4">
          {[
            { id: "today", label: "Today" },
            { id: "tomorrow", label: "Tomorrow" },
            { id: "thisweekend", label: "This Weekend" },
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
              {/* Share Button */}
              <button
                onClick={() => handleShare(event)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Share event"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
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
