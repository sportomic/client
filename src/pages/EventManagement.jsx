import React, { useState, useEffect } from "react";
import EventForm from "../components/EventForm";

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"),
        },
      });
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            "x-admin-token": localStorage.getItem("adminToken"),
          },
        });
        fetchEvents();
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/events/export", {
        headers: {
          "x-admin-token": localStorage.getItem("adminToken"),
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `events_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to export events");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Events</h2>
        <div className="space-x-4">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setIsEditing(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Event
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {event.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Sport:</span> {event.sportsName}
                </p>
                <p>
                  <span className="font-medium">Venue:</span> {event.venueName}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {event.slot}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹{event.price}
                </p>
                <p>
                  <span className="font-medium">Slots:</span>{" "}
                  {event.currentParticipants}/{event.participantsLimit}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEditing(true);
                  }}
                  className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors inline-flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors inline-flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <EventForm
          event={selectedEvent}
          onClose={() => {
            setIsEditing(false);
            setSelectedEvent(null);
          }}
          onSave={() => {
            fetchEvents();
            setIsEditing(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default EventsManagement;
