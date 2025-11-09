import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MasterClassDetails = ({ onBack }) => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch event + students by ID
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/masterclass/${id}/students`
        );
        const data = await res.json();

        if (data && data.masterclassId) {
          setEventData(data);
        } else {
          setError("Event not found or invalid response");
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading event details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!eventData)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No event data available.
      </div>
    );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
          {eventData.eventTitle}
        </h1>
        <button
          onClick={onBack}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* Registered Students Table */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-red-500 mb-4">
          Registered Students ({eventData.registeredStudents.length})
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
            {eventData.registeredStudents.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.mobile}</td>
                <td className="p-3">{s.graduationYear}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      s.status === "confirmed" || s.status === "attended"
                        ? "bg-green-100 text-green-600"
                        : s.status === "pending"
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
    </>
  );
};

export default MasterClassDetails;
