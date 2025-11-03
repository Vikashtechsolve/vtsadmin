import React from "react";

const MasterClassDetails = ({ event, onBack }) => {
  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Event not found.
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
          {event.name}
        </h1>
        <button
          onClick={onBack}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* Event Info */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Mentor:</strong> {event.mentor}
          </p>
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Time:</strong> {event.time || "—"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                event.status === "Scheduled"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {event.status || "Completed"}
            </span>
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      {event.feedback && (
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-red-500 mb-4">
            Feedback Summary
          </h3>
          <p>
            <strong>Students:</strong> {event.students}
          </p>
          <p>
            <strong>Average Rating:</strong> {event.rating} ⭐
          </p>
          <p>
            <strong>Comments:</strong> {event.feedback}
          </p>
        </div>
      )}

      {/* Registration Table */}
      {event.registrations && event.registrations.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-red-500 mb-4">
            Registered Students ({event.registrations.length})
          </h3>
          <table className="w-full text-sm border border-gray-100 rounded-lg">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Graduation Year</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {event.registrations.map((s, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.mobile}</td>
                  <td className="p-3">{s.graduationYear}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        s.status === "Confirmed" || s.status === "Attended"
                          ? "bg-green-100 text-green-600"
                          : s.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MasterClassDetails;
