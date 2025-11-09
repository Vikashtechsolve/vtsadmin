import React from "react";

const DoubtSolvingDetails = ({ session, onBack }) => {
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Session not found.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
          {session.student} — {session.subject}
        </h1>
        <button
          onClick={onBack}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Student:</strong> {session.student}</p>
          <p><strong>Mentor:</strong> {session.mentor}</p>
          <p><strong>Date:</strong> {session._groupDate}</p>
          <p><strong>Time:</strong> {session.time}</p>
          <p><strong>Plan:</strong> {session.plan}</p>
          <p><strong>Doubts:</strong> {session.doubts || "—"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                session.status === "Live"
                  ? "bg-red-100 text-red-600"
                  : session.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : session.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {session.status}
            </span>
          </p>
        </div>
      </div>

      {session.registration && session.registration.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-red-500 mb-4">
            Registered Students ({session.registration.length})
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
              {session.registration.map((s, i) => (
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

export default DoubtSolvingDetails;
