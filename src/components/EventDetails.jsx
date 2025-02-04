import React, { useState, useEffect } from "react";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { apiUrl } from "../contant";

const EventDetails = () => {
  const eventId = window.location.pathname.split("/").pop();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // Fetch participants data
  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/events/${eventId}/successful-payments`
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();

      setParticipants(data.successfulPayments);
      // console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const handlePayment = async () => {
    try {
      const response = await fetch(`${apiUrl}/events/${eventId}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: order.eventName,
        description: "Event Booking",
        order_id: order.orderId,
        prefill: {
          name: name,
          contact: phone,
        },

        method: {
          upi: 1, // Enable UPI payments
          netbanking: 1,
          card: 1,
          wallet: 1,
        },

        config: {
          display: {
            blocks: {
              banks: {
                name: "Most Used Methods",
                instruments: [{ method: "upi" }, { method: "netbanking" }],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },

        handler: async (response) => {
          try {
            const confirmResponse = await fetch(
              `${apiUrl}/events/${eventId}/confirm`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  participantName: name,
                  participantPhone: phone,
                }),
              }
            );

            if (!confirmResponse.ok) {
              const errorData = await confirmResponse.json();
              throw new Error(errorData.error || "Payment confirmation failed");
            }

            // Handle successful payment
            setPaymentDetails({
              participantName: name,
              participantPhone: phone,
              paymentId: response.razorpay_payment_id,
            });
            setShowSuccessModal(true);
            fetchParticipants();
          } catch (error) {
            console.error("Confirmation Error:", error);
            alert(`Payment Confirmation Failed: ${error.message}`);
          }
        },
        theme: {
          color: "#14B8A6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error("Payment Initialization Error:", error);
      alert(`Payment Initialization Failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!event) return null;

  return (
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

            {/* Event Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{event.sportsName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {new Date(event.date).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{event.slot}</span>
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
  );
};

export default EventDetails;
