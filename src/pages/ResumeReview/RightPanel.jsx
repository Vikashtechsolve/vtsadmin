import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const RightPanel = ({ data = {} }) => {
  const [value, setValue] = useState(new Date());

  return (
    <aside className="p-6 space-y-8 bg-white rounded-2xl">
      {/* ================= ADMIN INFO ================= */}
      <div className="flex items-center gap-3 border-b pb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Admin Avatar"
          className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
        />
        <div>
          <div className="font-semibold text-gray-800">Vikash Dubey</div>
          <div className="text-sm text-gray-500">Admin</div>
        </div>
      </div>

      {/* ================= CALENDAR ================= */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-2">
          {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </h4>
        <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
          <Calendar
            value={value}
            onChange={setValue}
            className="react-calendar-custom"
          />
        </div>
      </div>

      {/* ================= TOP MENTORS ================= */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-3">
          Top Mentors of the Month
        </h4>

        {data?.mentors?.length > 0 ? (
          <div className="space-y-3">
            {data.mentors.map((m, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100 transition duration-150 shadow-sm"
              >
                <img
                  src={`https://i.pravatar.cc/40?img=${i + 10}`}
                  alt={m.name}
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
                <div>
                  <div className="font-medium text-gray-800">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.role}</div>
                  <div className="text-xs text-yellow-500 font-medium">
                    {m.rating} ★
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No mentor data available</p>
        )}
      </div>

      {/* ================= TODAY'S HIGHLIGHTS ================= */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-3">
          Today's Highlights
        </h4>

        {data?.highlights?.length > 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4 space-y-3">
            {data.highlights.map((h, i) => (
              <div
                key={i}
                className="flex flex-col border-b last:border-b-0 pb-2 last:pb-0"
              >
                <div className="text-sm text-gray-700 font-medium">{h.title}</div>
                <div className="text-xs text-gray-400 mt-1">{h.time}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No highlights for today</p>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;