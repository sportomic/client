import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use named import here

const AdminPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== "admin") {
        setError("You are not authorized to access this page.");
        navigate("/user");
      }
    }
  }, [navigate]);

  const handleCreateEvent = () => {
    navigate("/"); // Navigate to the Create Event page
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-center text-2xl mb-4">
            Welcome to the Admin Page
          </h2>
          <button
            onClick={handleCreateEvent}
            className="bg-blue-600  text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
          >
            Create Event
          </button>
        </>
      )}
    </div>
  );
};

export default AdminPage;
