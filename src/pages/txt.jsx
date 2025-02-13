<div className="min-h-screen bg-gray-50 mt-20">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
  {/* Single Image */}
  {event.venueImage && (
    <div className="mb-6 md:mb-8 rounded-lg overflow-hidden shadow-lg">
      <img
        src={event.venueImage}
        alt="Venue"
        className="w-full h-48 sm:h-64 md:h-96 object-cover"
      />
    </div>
  )}

  {/* Event Details Card */}
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {event.name}
      </h1>

      <div className="mb-8">
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            {event.description}
          </li>
        </ul>
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-1 mt-4 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{event.sportsName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">
            {new Date(event.date).toLocaleDateString("en-GB")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-black-600 font-bold">{event.slot}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Important Instructions
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Have everything clean & mandatory normal shoes are not allowed
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Maintain decorum as per your sportmanship
          </li>
        </ul>
      </div>

      {/* Payment Form */}
      <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Level
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Total and Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <span className="text-sm text-gray-600">TOTAL</span>
          <div className="text-2xl font-bold text-gray-900">
            INR {event.price}
          </div>
        </div>
        <button
          onClick={handlePayment}
          className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium ${
            event.participants.length === event.participantsLimit
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
          disabled={event.participants.length === event.participantsLimit}
        >
          {event.participants.length === event.participantsLimit
            ? "No Slots Left"
            : "Book Now"}
        </button>
      </div>
    </div>
  </div>

  {/* Participants Table */}
  {participants.length > 0 && (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">Participants</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participants.map((participant, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-lg text-gray-900 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 mr-2 text-teal-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 2a4 4 0 110 8 4 4 0 010-8zm0 14c-3.313 0-6 2.687-6 6h12c0-3.313-2.687-6-6-6z"
                      />
                    </svg>
                    <span>{participant.name}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
<PaymentSuccessModal
  isOpen={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  paymentDetails={paymentDetails}
  event={event}
/>
</div>