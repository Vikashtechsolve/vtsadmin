import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const RightPanel = ({ data }) => {
  const [value, setValue] = useState(new Date());

  return (
    <aside className="p-6 space-y-6">
      {/* Admin Info */}
      <div className="flex items-center gap-3">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="av" className="w-12 h-12 rounded-full" />
        <div>
          <div className="font-semibold">Vikash Dubey</div>
          <div className="text-sm text-gray-500">Admin</div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-2">October 2025</h4>
        <div className="rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <Calendar value={value} onChange={setValue} />
        </div>
      </div>

      {/* Top Mentors */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-3">Top Mentors of the Month</h4>
        <div className="space-y-3">
          {data.mentors.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt={m.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-500">{m.role}</div>
                <div className="text-xs text-yellow-500">{m.rating} ★</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Highlight */}
      <div>
        <h4 className="text-sm font-semibold text-red-600 mb-3">Today's Highlight</h4>
        <div className="rounded-lg border border-gray-100 p-4 bg-white shadow-sm">
          {data.highlights.map((h, i) => (
            <div key={i} className="mb-3">
              <div className="text-sm text-gray-700">{h.title}</div>
              <div className="text-xs text-gray-400 mt-1">{h.time}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
