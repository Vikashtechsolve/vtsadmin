import React from "react";

const ActivityItem = ({ activity, isLast }) => (
  <div className="relative flex items-start gap-4 mb-6 last:mb-0">
    {/* Vertical line */}
    {!isLast && (
      <div className="absolute left-[1.25rem] top-10 w-[2px] h-full bg-gradient-to-b from-red-500 via-orange-400 to-yellow-400 rounded-full" />
    )}

    {/* Emoji Circle */}
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 text-xl z-10">
      {activity.icon || "•"}
    </div>

    {/* Activity Content */}
    <div>
      <p className="text-gray-800 text-sm font-medium">{activity.title}</p>
      <p className="text-xs text-gray-400">{activity.time}</p>
    </div>
  </div>
);

const ActivityList = ({ activities = [], compact = false }) => (
  <div className={`${compact ? "" : "bg-white rounded-xl shadow p-6"}`}>
    {!compact && <h3 className="text-lg font-semibold mb-4">Today</h3>}

    <div className="relative pl-2">
      {activities.map((activity, idx) => (
        <ActivityItem
          key={idx}
          activity={activity}
          isLast={idx === activities.length - 1}
        />
      ))}
    </div>
  </div>
);

export default ActivityList;
