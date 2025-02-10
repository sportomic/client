import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EventDetails from "./components/EventDetails";
import Login from "./pages/Login";
import Signup from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import ContactUs from "./pages/ContactUs";
import DownloadExcel from "./components/DownloadExcel";
import { Analytics } from "@vercel/analytics/react";
// import cookies from "js-cookie";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Events />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/download" element={<DownloadExcel />} />

            {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
          </Routes>
        </main>
        <Footer />
        <Analytics /> {/* Add this inside the JSX tree */}
      </Router>
    </>
  );
}

export default App;
