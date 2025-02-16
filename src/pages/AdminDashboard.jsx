import React, { useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import EventsManagement from "./EventManagement";

const AdminDashboard = () => {
  const { isAdmin, loading, login, logout } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(password);
    if (!result.success) {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Sports Events Admin
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <EventsManagement />
      </main>
    </div>
  );
};

export default AdminDashboard;
