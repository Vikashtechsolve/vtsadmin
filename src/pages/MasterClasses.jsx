// src/pages/MasterClasses.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import localData from "../data/masterClassData.json"; // ✅ fallback to local JSON

const MasterClasses = () => {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ Load data from local JSON or backend API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try fetching from backend or public folder first
        const response = await fetch("/data/masterClassData.json");
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          console.warn("Using local JSON data (fallback)");
          setData(localData);
        }
      } catch (error) {
        console.error("Error fetching data, using local fallback:", error);
        setData(localData);
      }
    };
    loadData();
  }, []);

  // Loading screen
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading Master Class Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left Main Section */}
      <div className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 w-full max-w-md">
            <span className="text-gray-400 text-lg mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search masterclass, mentor, or event..."
              className="outline-none text-sm w-full bg-transparent"
            />
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-red-600 text-white p-5 rounded-2xl mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Master Class Overview</h2>
            <p className="text-sm text-red-100">
              Monitor all events, track registrations, and see student feedback in one place.
            </p>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774293.png"
            alt="overview"
            className="w-20 hidden sm:block"
          />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-2">📅</div>
            <p className="font-semibold text-gray-700">Upcoming Events</p>
            <p className="text-sm text-gray-500">
              {data.overview.upcomingEvents} scheduled this month
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-2">🕒</div>
            <p className="font-semibold text-gray-700">Past Events</p>
            <p className="text-sm text-gray-500">
              {data.overview.pastEvents} completed sessions
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-2">👥</div>
            <p className="font-semibold text-gray-700">Total Registrations</p>
            <p className="text-sm text-gray-500">
              {data.overview.totalRegistrations}+ students
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-semibold text-gray-700">Average Rating</p>
            <p className="text-sm text-gray-500">
              {data.overview.averageRating} based on 120+ reviews
            </p>
          </div>
        </div>

        {/* Upcoming Events Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-red-600">Upcoming Events</h2>
            <div className="text-gray-400 text-sm cursor-pointer">Filter | Sort</div>
          </div>
          <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Event Name</th>
                <th className="text-left p-3">Mentor</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingEvents.map((event, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{event.name}</td>
                  <td className="p-3">{event.mentor}</td>
                  <td className="p-3">{event.date}</td>
                  <td className="p-3">{event.time}</td>
                  <td className="p-3">{event.status}</td>
                  <td className="p-3 text-blue-500 cursor-pointer">Edit / View</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-3 flex items-center text-red-600 text-sm font-medium hover:underline">
            ➕ Add New Event
          </button>
        </div>

        {/* Past Events Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-red-600">Past Events</h2>
            <div className="text-gray-400 text-sm cursor-pointer">Filter | Sort</div>
          </div>
          <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Event Name</th>
                <th className="text-left p-3">Mentor</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Students</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {data.pastEvents.map((event, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{event.name}</td>
                  <td className="p-3">{event.mentor}</td>
                  <td className="p-3">{event.date}</td>
                  <td className="p-3">{event.students}</td>
                  <td className="p-3">{event.rating} ⭐</td>
                  <td className="p-3 text-blue-500 cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-3 flex items-center text-red-600 text-sm font-medium hover:underline">
            ⬇ Download Report CSV / PDF
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 bg-white border-l border-gray-100 p-6 flex flex-col gap-8">
        {/* Profile */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Vikash Dubey</h3>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
        </div>

        {/* Calendar */}
        <div>
          <h3 className="text-red-600 font-semibold mb-2">Schedule Master Class</h3>
          <Calendar
            className="rounded-lg border border-gray-100 shadow-sm w-full"
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        {/* Mentors */}
        <div>
          <h3 className="text-red-600 font-semibold mb-3">Top Mentors of the Month</h3>
          <div className="flex flex-col gap-3">
            {data.mentors.map((mentor, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-700">{mentor.name}</p>
                  <p className="text-xs text-gray-500">{mentor.role}</p>
                </div>
                <p className="text-sm font-medium text-yellow-500">
                  {mentor.rating}⭐
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="text-red-600 font-semibold mb-3">Upcoming Highlights</h3>
          <div className="flex flex-col gap-2">
            {data.highlights.map((event, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <p className="font-medium text-gray-700">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {event.date}, {event.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterClasses;
