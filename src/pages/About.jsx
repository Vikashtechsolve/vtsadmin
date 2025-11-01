import React from "react";
import Sidebar from "../components/Sidebar";

const About = () => (
  <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">About Us</h1>
      <p>Information about VTS, mission, and our team.</p>
    </main>
  </div>
);

export default About;
