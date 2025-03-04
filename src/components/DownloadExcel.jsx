import React from "react";
import axios from "axios";
import { apiUrl } from "../contant";
import { useAdmin } from "../contexts/AdminContext.jsx"; // Import useAdmin

const DownloadExcel = () => {
  const { isAdmin } = useAdmin(); // Get admin status (optional, for conditional rendering)

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // Get the token from localStorage
      const response = await axios.get(`${apiUrl}/events/excel`, {
        responseType: "blob",
        headers: {
          "x-admin-token": token, // Add admin token to headers
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "events.xlsx";
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        className="rounded-md px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer"
        type="button"
        onClick={downloadExcel}
        disabled={!isAdmin} // Optional: Disable button if not admin
      >
        Download Excel
      </button>
    </div>
  );
};

export default DownloadExcel;
