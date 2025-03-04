import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../contant";
import { useAdmin } from "../contexts/AdminContext"; // Import useAdmin

const AddEvent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAdmin } = useAdmin(); // Get admin status
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${apiUrl}/events/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-admin-token": token, // Add admin token to headers
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file");
    }

    setUploading(false);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${apiUrl}/events/add-event`, data, {
        headers: {
          "x-admin-token": token, // Add admin token to headers
        },
      });
      toast.success("🎉 Event created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("❌ Failed to create event. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  return (
    <div className="max-w-3xl mx-auto mt-20 my-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Create a New Event
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Event Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter Event Name"
            {...register("name", { required: "Event name is required" })}
            className="w-full mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="sportsName" className="block text-sm font-medium">
            Select Sport
          </label>
          <Controller
            name="sportsName"
            control={control}
            rules={{ required: "Sports selection is required" }}
            render={({ field }) => (
              <Select {...field} className="w-full mt-2">
                {[
                  "Cricket",
                  "Pickle Ball",
                  "Badminton",
                  "Foot Ball",
                  "Tennis",
                  "Paint Ball",
                  "Shooting",
                  "Pool Table",
                  "Snooker",
                  "Table Tennis",
                  "Archery",
                  "Volley Ball",
                  "Basket Ball",
                  "Yoga",
                  "Zumba",
                  "Taekwondo",
                  "Gym",
                  "Boxing",
                  "Throw Ball",
                  "Squash",
                  "Skating",
                  "Running",
                  "Rugby",
                  "Swimming",
                  "Kabaddi",
                  "Hiking",
                  "Golf",
                  "Gokarting",
                  "Frisbee",
                  "FoosBall",
                  "Cycling",
                  "Chess",
                  "Carrom",
                  "Bowling",
                  "BaseBall",
                  "Horse Riding",
                  "Hockey",
                  "Marathon",
                ].map((sport, index) => (
                  <Option key={index} value={sport}>
                    {sport}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.sportsName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sportsName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            General Instructions
          </label>
          <Textarea
            id="description"
            placeholder="Enter Event Description"
            {...register("description", {
              required: "Event description is required",
            })}
            className="w-full mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Venue Name */}
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium">
            Venue Name
          </label>
          <Input
            id="venueName"
            type="text"
            placeholder="Enter Venue Name"
            {...register("venueName", { required: "Venue name is required" })}
            className="w-full mt-2"
          />
          {errors.venueName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.venueName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Venue Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Enter Venue Location"
            {...register("location", {
              required: "Venue location is required",
            })}
            className="w-full mt-2"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Venue Image */}
        <div>
          <label htmlFor="venueImage" className="block text-sm font-medium">
            Venue Image Address (URL)
          </label>
          <Input
            id="venueImage"
            type="text"
            placeholder="Enter Image URL"
            {...register("venueImage", {
              required: "Venue image URL is required",
            })}
            className="w-full mt-2"
          />
          {errors.venueImage && (
            <p className="text-red-500 text-xs mt-1">
              {errors.venueImage.message}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Event Date
          </label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "Event date is required" })}
            className="w-full mt-2"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Slot Selection */}
        <div>
          <label htmlFor="slot" className="block text-sm font-medium">
            Event Slot (1-Hour or 2-Hour Intervals)
          </label>
          <Controller
            name="slot"
            control={control}
            rules={{ required: "Please select a slot" }}
            render={({ field }) => (
              <Select {...field} className="w-full mt-2">
                {[
                  "6:00 AM - 7:00 AM",
                  "7:00 AM - 8:00 AM",
                  "8:00 AM - 9:00 AM",
                  "9:00 AM - 10:00 AM",
                  "10:00 AM - 11:00 AM",
                  "11:00 AM - 12:00 PM",
                  "12:00 PM - 1:00 PM",
                  "1:00 PM - 2:00 PM",
                  "2:00 PM - 3:00 PM",
                  "3:00 PM - 4:00 PM",
                  "4:00 PM - 5:00 PM",
                  "5:00 PM - 6:00 PM",
                  "6:00 PM - 7:00 PM",
                  "7:00 PM - 8:00 PM",
                  "8:00 PM - 9:00 PM",
                  "9:00 PM - 10:00 PM",
                  "10:00 PM - 11:00 PM",
                  "11:00 PM - 12:00 AM",
                  "6:00 AM - 8:00 AM",
                  "8:00 AM - 10:00 AM",
                  "10:00 AM - 12:00 PM",
                  "12:00 PM - 2:00 PM",
                  "2:00 PM - 4:00 PM",
                  "4:00 PM - 6:00 PM",
                  "6:00 PM - 8:00 PM",
                  "8:00 PM - 10:00 PM",
                  "10:00 PM - 12:00 AM",
                  "7:00 AM - 9:00 AM",
                  "9:00 AM - 11:00 AM",
                  "11:00 AM - 1:00 PM",
                  "1:00 PM - 3:00 PM",
                  "3:00 PM - 5:00 PM",
                  "5:00 PM - 7:00 PM",
                  "7:00 PM - 9:00 PM",
                  "9:00 PM - 11:00 PM",
                ].map((slot, index) => (
                  <Option key={index} value={slot}>
                    {slot}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.slot && (
            <p className="text-red-500 text-xs mt-1">{errors.slot.message}</p>
          )}
        </div>
        {/* Participants Limit */}
        <div>
          <label
            htmlFor="participantsLimit"
            className="block text-sm font-medium"
          >
            Participants Limit
          </label>
          <Input
            id="participantsLimit"
            type="number"
            placeholder="Enter Limit"
            {...register("participantsLimit", {
              required: "Participants limit is required",
            })}
            className="w-full mt-2"
          />
          {errors.participantsLimit && (
            <p className="text-red-500 text-xs mt-1">
              {errors.participantsLimit.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Event Price (in ₹)
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Enter Event Price"
            {...register("price", { required: "Event price is required" })}
            className="w-full mt-2"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          Create Event
        </Button>
      </form>

      <div className="mt-10 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload Events</h2>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-3 border rounded p-2 w-full"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 text-white rounded ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Events"}
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddEvent;
