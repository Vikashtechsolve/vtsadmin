import React from "react";
import Sidebar from "../components/Sidebar";

const Programs = () => {
  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Our Programs</h1>
        <p>Here you can manage all the programs, add new ones, and edit existing programs.</p>
      </main>
    </div>
  );
};

export default Programs;
