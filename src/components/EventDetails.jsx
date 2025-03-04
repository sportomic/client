import React, { useState, useEffect } from "react";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { apiUrl } from "../contant"; // Ensure this is "https://server-7ynr.onrender.com"
import { Calendar, MapPin, Users, Clock, Info, Trophy } from "lucide-react";

const EventDetails = () => {
  const eventId = window.location.pathname.split("/").pop();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

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

  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/events/${eventId}/successful-payments`
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();
      setParticipants(data.successfulPayments);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const totalAmount = event ? event.price * quantity : 0;

  const handlePayment = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!phone || !name) {
      alert("Please enter phone and name");
      return;
    }

    if (!skillLevel) {
      alert("Please select your skill level");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/events/${eventId}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          skillLevel,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount,
        currency: "INR",
        name: order.eventName,
        description: "Event Booking",
        order_id: order.orderId,
        prefill: {
          name: name,
          contact: phone,
        },
        method: {
          upi: 1,
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
                  skillLevel: skillLevel,
                  quantity: quantity,
                }),
              }
            );

            if (!confirmResponse.ok) {
              const errorData = await confirmResponse.json();
              throw new Error(errorData.error || "Payment confirmation failed");
            }

            // Success: Update UI immediately
            setPaymentDetails({
              participantName: name,
              participantPhone: phone,
              skillLevel: skillLevel,
              paymentId: response.razorpay_payment_id,
              quantity: quantity,
            });
            setShowSuccessModal(true);
            fetchParticipants();
          } catch (error) {
            console.error("Confirmation Error:", error);
            // Handle modal closure: Webhook will update backend
            alert(
              "Payment may have succeeded. Please wait a moment or refresh to check your booking status."
            );
            // Check status after delay (webhook processing time)
            setTimeout(() => {
              fetchParticipants();
              checkPaymentStatus(response.razorpay_payment_id);
            }, 5000);
          }
        },
        theme: {
          color: "#14B8A6",
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle modal closure (cancel, back button, or manual close)
      rzp.on("close", () => {
        console.log("Razorpay modal closed");
        alert("Payment process canceled. Please try again if needed.");
      });

      // Handle payment failure
      rzp.on("payment.failed", (response) => {
        console.log("Payment failed:", response.error.description);
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Initialization Error:", error);
      alert(`Payment Initialization Failed: ${error.message}`);
    }
  };

  // Function to check payment status
  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await fetch(
        `${apiUrl}/events/${eventId}/successful-payments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.successfulPayments.some((p) => p.paymentId === paymentId)) {
        setPaymentDetails({
          participantName: name,
          participantPhone: phone,
          skillLevel: skillLevel,
          paymentId: paymentId,
          quantity: quantity,
        });
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Reset loading state when success modal is closed
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
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

  const capitalizeText = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Single Image */}
        {event.venueImage && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative">
              <img
                src={event.venueImage}
                alt="Venue"
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        )}

        {/* Event Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center ">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {event.venueName}
                </h1>
              </div>
              <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm sm:text-base md:text-lg">
                {event.participantsLimit - event.currentParticipants} slots left
              </div>
            </div>
            <h2 className="text-sm text-black-500 mb-4">
              {capitalizeText(event.name)}
            </h2>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-semibold text-gray-900">
                    {capitalizeText(event.sportsName)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString("en-GB")} (
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                    })}
                    )
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot</p>
                  <p className="font-semibold text-gray-900">{event.slot}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Important Instructions
                </h2>
              </div>
              <ul className="space-y-3">
                {event.description.split("\n").map((instruction, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="ml-2 mr-3 text-black-500">•</span>
                    <span>{instruction.trim()}</span>
                  </li>
                ))}
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
                    <option value="">Select your skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate/advanced">
                      Intermediate/Advanced
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Select Slots (Max{" "}
                    {Math.max(
                      0,
                      event.participantsLimit - event.currentParticipants
                    )}{" "}
                    available)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1}
                      className="h-10 w-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="h-10 w-16 text-center border border-gray-300 rounded-lg flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(
                            q + 1,
                            event.participantsLimit - event.currentParticipants
                          )
                        )
                      }
                      disabled={
                        quantity >=
                        event.participantsLimit - event.currentParticipants
                      }
                      className="h-10 w-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total and Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <span className="text-sm text-gray-600">TOTAL</span>
                <div className="text-2xl font-bold text-gray-900">
                  INR {event.price * quantity}
                </div>
              </div>
              <button
                onClick={handlePayment}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium ${
                  event.currentParticipants >= event.participantsLimit
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                disabled={event.currentParticipants >= event.participantsLimit}
              >
                {`Book ${quantity} Slot${quantity > 1 ? "s" : ""} · ₹${
                  event.price * quantity
                }`}
              </button>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        {participants.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Participants
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Skill Level
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Slots Booked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map((participant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-teal-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 2a4 4 0 110 8 4 4 0 010-8zm0 14c-3.313 0-6 2.687-6 6h12c0-3.313-2.687-6-6-6z"
                            />
                          </svg>
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {participant.name}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 capitalize">
                          {participant.skillLevel}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                          {participant.quantity}
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
        onClose={() => {
          setShowSuccessModal(false);
        }}
        paymentDetails={paymentDetails}
        event={event}
      />
    </div>
  );
};

export default EventDetails;
