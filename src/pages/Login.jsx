import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import here
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../contant";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request...");
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
      });

      const token = response.data.token;
      console.log("Received Token:", token);
      localStorage.setItem("token", token);

      console.log("Decoding token...");
      const decodedToken = jwtDecode(token); // Use the named export here
      console.log("Decoded Token:", decodedToken);

      if (decodedToken.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-600"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none transition duration-200"
      >
        Login
      </button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </form>
  );
};

export default Login;
