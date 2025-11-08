import React from "react";

const StatusPill = ({ value }) => {
  const cls =
    value === "Live"
      ? "bg-red-100 text-red-600"
      : value === "Completed"
      ? "bg-green-100 text-green-600"
      : value === "Scheduled"
      ? "bg-gray-100 text-gray-600"
      : value === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-600";
  return <span className={`px-3 py-1 text-xs rounded-full ${cls}`}>{value}</span>;
};

const DoubtSolvingDashboard = ({ data, onAdd, onEdit, onView }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Scheduled Doubt Solving Session Details
        </h3>
        <button
          onClick={onAdd}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          + Schedule Session
        </button>
      </div>

      {data.sessions
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((group, idx) => (
          <div key={idx} className="bg-white shadow-sm rounded-xl border border-gray-100">
            <div className="px-6 pt-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Date:</span> {group.date}
              </p>
            </div>

            <div className="overflow-x-auto p-6">
              <table className="w-full text-sm border border-gray-100 rounded-lg">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Student Name</th>
                    <th className="p-3 text-left">Mentor</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Plan</th>
                    <th className="p-3 text-left">Doubts</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.details.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.student}</td>
                      <td className="p-3">{s.mentor}</td>
                      <td className="p-3">{s.subject}</td>
                      <td className="p-3">{s.time}</td>
                      <td className="p-3">{s.plan}</td>
                      <td className="p-3">{s.doubts || "—"}</td>
                      <td className="p-3"><StatusPill value={s.status} /></td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => onView(s.id)}
                          className="text-red-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit({ ...s, date: group.date })}
                          className="text-gray-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {group.details.length === 0 && (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={8}>
                        No sessions for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DoubtSolvingDashboard;
