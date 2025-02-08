import React from "react";
import axios from "axios";
import { apiUrl } from "../contant";

const DownloadExcel = () => {
  const downloadExcel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/events/excel`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "events.xlsx";
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //add css to button

    <div className="flex justify-center items-center h-screen">
      <button
        className="rounded-md px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer"
        type="button"
        onClick={downloadExcel}
      >
        Download Excel
      </button>
    </div>
  );
};

export default DownloadExcel;
