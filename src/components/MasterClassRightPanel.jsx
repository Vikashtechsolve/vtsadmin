import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MasterClassRightPanel = ({ data, selectedDate, onDateChange }) => {
  return (
    <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-6 flex flex-col gap-8 sticky top-0">
      {/* Admin Info */}
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
        <h3 className="text-red-600 font-semibold mb-2">
          Schedule Master Class
        </h3>
        <Calendar
          className="rounded-lg border border-gray-100 shadow-sm w-full"
          value={selectedDate}
          onChange={onDateChange}
        />
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-red-600 font-semibold mb-3">
          Upcoming Highlights
        </h3>
        <div className="flex flex-col gap-2">
          {data.highlights.map((e, i) => (
            <div
              key={i}
              className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <p className="font-medium text-gray-700">{e.title}</p>
              <p className="text-xs text-gray-500">
                {e.date}, {e.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default MasterClassRightPanel;
