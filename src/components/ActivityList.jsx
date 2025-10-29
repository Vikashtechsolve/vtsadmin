import React from "react";

const ActivityList = ({ activities }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="font-semibold mb-4 text-gray-700">Recent Activities</h2>
    <ul className="space-y-3">
      {activities.map((activity, index) => (
        <li
          key={index}
          className="flex items-center justify-between border-b pb-2 last:border-none"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{activity.icon}</span>
            <p className="text-gray-700">{activity.text}</p>
          </div>
          <span className="text-sm text-gray-400">{activity.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ActivityList;
