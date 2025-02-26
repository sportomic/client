import React from "react";

const EventCard = ({ event, handleDelete, setEditingEvent }) => {
  const formattedDate = new Date(event.date)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full mx-auto mb-4">
      <img
        src={event.venueImage}
        alt={event.venueName}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-lg flex-shrink-0 mr-4"
      />

      <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center sm:justify-between w-full">
        <div className="sm:w-1/2">
          <h3 className="text-base font-semibold text-gray-900">
            {event.name}({event._id})
          </h3>
          <h4 className="text-sm font-semibold text-gray-900">
            {event.venueName}
          </h4>
          <p className="text-xs sm:text-sm text-black-700">{event.slot}</p>
          <p className="text-xs sm:text-sm text-black-700">{event.location}</p>
          <p className="text-xs sm:text-sm text-black-700">{formattedDate}</p>
          <p className="text-xs sm:text-sm text-black-700">
            Slots Left: {event.currentParticipants}/{event.participantsLimit}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:justify-end w-full sm:w-1/2">
          <button className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md text-xs sm:text-sm text-blue-600 hover:bg-blue-50">
            Confirm
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md text-xs sm:text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
          <button className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={() => setEditingEvent(event)}
            className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md text-xs sm:text-sm text-teal-600 font-medium hover:bg-teal-50"
          >
            EDIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
