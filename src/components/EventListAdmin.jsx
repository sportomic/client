import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import axios from "axios";
import { apiUrl } from "../contant";
// Search Box Component
const EventSearchBox = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative w-full mb-4">
      <input
        type="text"
        placeholder="Search Event By ID or Name"
        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleSearch}
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onClick={handleSearch}
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

const EventSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 md:p-6 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-lg flex-shrink-0 md:mr-4"></div>
      <div className="flex-grow space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex flex-wrap gap-x-4 mt-1">
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-4 md:mt-0">
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

const EventListAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [availableSports, setAvailableSports] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents(selectedSport);
  }, [selectedSport]);

  // Apply search filter when events or search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.name?.toLowerCase().includes(query) ||
          event._id?.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [events, searchQuery]);

  const fetchEvents = async (sport) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/events?sport=${sport}`);
      // console.log("API Response:", response.data);

      const { events, availableSports } = response.data;

      setEvents(events || []);
      setFilteredEvents(events || []);
      setAvailableSports([
        "all",
        ...(Array.isArray(availableSports) ? availableSports : []),
      ]);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${apiUrl}/events/${eventId}`);
      // console.log("Delete Response:", response.data);

      if (response.status === 200 || response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } else {
        throw new Error("Deletion failed on the server");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Please try again.");
      fetchEvents(selectedSport);
    }
  };

  const handleEditSubmit = async (updatedEvent) => {
    try {
      const { _id, __v, ...eventToSubmit } = updatedEvent;
      const response = await axios.put(
        `${apiUrl}/events/${_id}`,
        eventToSubmit
      );
      // console.log("Edit Response:", response.data);

      if (response.status === 200 || response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === _id ? { ...event, ...eventToSubmit } : event
          )
        );
        setEditingEvent(null);
      } else {
        throw new Error("Edit failed on the server");
      }
    } catch (error) {
      console.error("Error editing event:", error);
      alert("Failed to edit the event. Please try again.");
      fetchEvents(selectedSport);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse md:p-6">
        <EventSkeleton />
        <EventSkeleton />
        <EventSkeleton />
      </div>
    );
  }

  return (
    <div>
      {/* Search Box */}
      <EventSearchBox onSearch={handleSearch} />

      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border rounded"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          {availableSports.map((sport) => (
            <option key={sport} value={sport}>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">
          {events.length === 0
            ? "No events available for this sport."
            : "No events match your search."}
        </p>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            handleDelete={handleDelete}
            setEditingEvent={setEditingEvent}
          />
        ))
      )}

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleEditSubmit}
        />
      )}
    </div>
  );
};

// Edit Modal Component remains the same
const EditModal = ({ event, onClose, onSave }) => {
  // Your existing EditModal implementation
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    phone: "",
    skillLevel: "",
    paymentStatus: "success",
    bookingDate: new Date().toISOString(),
    quantity: 1,
    amount: editedEvent.price || 0,
  });
  const [editingParticipantIndex, setEditingParticipantIndex] = useState(null);

  // Calculate total participants based on quantity
  const calculateTotalParticipants = (participants) =>
    participants.reduce((sum, p) => sum + (p.quantity || 0), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const addParticipant = () => {
    if (
      !newParticipant.name ||
      !newParticipant.phone ||
      !newParticipant.skillLevel ||
      !newParticipant.quantity
    ) {
      alert("Please fill in all participant details.");
      return;
    }

    const totalParticipants = calculateTotalParticipants([
      ...editedEvent.participants,
      newParticipant,
    ]);

    if (totalParticipants > editedEvent.participantsLimit) {
      alert("Adding this participant exceeds the participant limit.");
      return;
    }

    setEditedEvent((prev) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
      currentParticipants: totalParticipants,
      slotsLeft: prev.participantsLimit - totalParticipants,
    }));
    setNewParticipant({
      name: "",
      phone: "",
      skillLevel: "",
      paymentStatus: "success",
      bookingDate: new Date().toISOString(),
      quantity: 1,
      amount: editedEvent.price || 0,
    });
  };

  const deleteParticipant = (index) => {
    const updatedParticipants = editedEvent.participants.filter(
      (_, i) => i !== index
    );
    const totalParticipants = calculateTotalParticipants(updatedParticipants);

    setEditedEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipants: totalParticipants,
      slotsLeft: prev.participantsLimit - totalParticipants,
    }));
  };

  const editParticipant = (index) => {
    setEditingParticipantIndex(index);
    setNewParticipant({ ...editedEvent.participants[index] });
  };

  const saveParticipantEdit = () => {
    if (
      !newParticipant.name ||
      !newParticipant.phone ||
      !newParticipant.skillLevel ||
      !newParticipant.quantity
    ) {
      alert("Please fill in all participant details.");
      return;
    }

    const updatedParticipants = editedEvent.participants.map((p, i) =>
      i === editingParticipantIndex ? newParticipant : p
    );
    const totalParticipants = calculateTotalParticipants(updatedParticipants);

    if (totalParticipants > editedEvent.participantsLimit) {
      alert("Editing this participant exceeds the participant limit.");
      return;
    }

    setEditedEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipants: totalParticipants,
      slotsLeft: prev.participantsLimit - totalParticipants,
    }));
    setEditingParticipantIndex(null);
    setNewParticipant({
      name: "",
      phone: "",
      skillLevel: "",
      paymentStatus: "success",
      bookingDate: new Date().toISOString(),
      quantity: 1,
      amount: editedEvent.price || 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedEvent);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center mt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="name">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={editedEvent.name}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Event Name"
            />
            <label className="text-sm font-semibold" htmlFor="description">
              General Instruction
            </label>
            <textarea
              name="description"
              value={editedEvent.description}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Description"
              rows="4"
            />
            <label className="text-sm font-semibold" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={new Date(editedEvent.date).toISOString().split("T")[0]}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <label className="text-sm font-semibold" htmlFor="slot">
              Time Slot
            </label>
            <input
              type="text"
              name="slot"
              value={editedEvent.slot}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Slot"
            />
            <label
              className="text-sm font-semibold"
              htmlFor="participantsLimit"
            >
              Participants Limit
            </label>
            <input
              type="number"
              name="participantsLimit"
              value={editedEvent.participantsLimit}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Participants Limit"
            />
            <label className="text-sm font-semibold" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={editedEvent.price}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Price"
            />
            <label className="text-sm font-semibold" htmlFor="sportsName">
              Sport Name
            </label>
            <input
              type="text"
              name="sportsName"
              value={editedEvent.sportsName}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Sport Name"
            />
            <label className="text-sm font-semibold" htmlFor="venueName">
              Venue Name
            </label>
            <input
              type="text"
              name="venueName"
              value={editedEvent.venueName}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Venue Name"
            />
            <label className="text-sm font-semibold" htmlFor="venueImage">
              Venue Image URL
            </label>
            <input
              type="text"
              name="venueImage"
              value={editedEvent.venueImage}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Venue Image URL"
            />
            <label className="text-sm font-semibold" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={editedEvent.location}
              onChange={handleInputChange}
              className="p-2 border rounded"
              placeholder="Location"
            />
          </div>

          {/* Participants Management */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold">
              Participants (Slots Left: {editedEvent.slotsLeft})
            </h4>
            {editedEvent.participants.map((participant, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>
                  {participant.name} - {participant.phone} (
                  {participant.skillLevel}) - Qty: {participant.quantity}
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => editParticipant(index)}
                    className="px-2 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteParticipant(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Add/Edit Participant Form */}
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                name="name"
                value={newParticipant.name}
                onChange={handleParticipantChange}
                className="p-2 border rounded"
                placeholder="Participant Name"
              />
              <input
                type="text"
                name="phone"
                value={newParticipant.phone}
                onChange={handleParticipantChange}
                className="p-2 border rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                name="skillLevel"
                value={newParticipant.skillLevel}
                onChange={handleParticipantChange}
                className="p-2 border rounded"
                placeholder="Skill Level"
              />
              <label className="text-sm font-semibold" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={newParticipant.quantity}
                onChange={handleParticipantChange}
                className="p-2 border rounded"
                placeholder="Quantity"
                min="1"
              />

              {editingParticipantIndex !== null ? (
                <button
                  type="button"
                  onClick={saveParticipantEdit}
                  className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Save Participant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Participant
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Save Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventListAdmin;
