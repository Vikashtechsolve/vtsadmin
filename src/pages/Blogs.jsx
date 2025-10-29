import React from "react";
import Sidebar from "../components/Sidebar";

const Blogs = () => (
  <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
    <Sidebar />
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">Blogs</h1>
      <p>Manage, edit, or publish new blog articles here.</p>
    </main>
  </div>
);

export default Blogs;
