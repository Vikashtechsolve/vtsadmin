import React, { useState, useMemo } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import MentorshipViewModal from "./MentorshipViewModal";
import OverviewImage from "../../assets/cpimg.png"; // ✅ <-- Correct image import

const StatusPill = ({ status }) => {
  const cls =
    status === "Live"
      ? "bg-red-100 text-red-600"
      : status === "Completed"
      ? "bg-green-100 text-green-600"
      : status === "Scheduled"
      ? "bg-gray-100 text-gray-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${cls}`}
    >
      {status}
    </span>
  );
};

const DashboardMain = ({ data }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [viewItem, setViewItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  // 🔹 Filter + Sort + Search logic
  const filteredSessions = useMemo(() => {
    const sessions = [...data.sessions];

    const filtered = sessions.map((g) => ({
      ...g,
      details: g.details.filter(
        (s) =>
          (filterStatus === "All" || s.status === filterStatus) &&
          (s.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.query || s.doubts || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    }));

    // Sorting
    if (sortBy === "name") {
      filtered.forEach((g) =>
        g.details.sort((a, b) => a.student.localeCompare(b.student))
      );
    } else if (sortBy === "status") {
      filtered.forEach((g) =>
        g.details.sort((a, b) => a.status.localeCompare(b.status))
      );
    }

    return filtered;
  }, [data.sessions, filterStatus, sortBy, searchQuery]);

  // 🔹 Pagination helper
  const paginate = (details) => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return details.slice(start, end);
  };

  return (
    <>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-red-600">Dashboard</h1>

        <div className="w-full md:max-w-lg">
          <input
            type="search"
            placeholder="Search student, mentor, or query..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* 🔴 Mentorship Overview Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-transparent mb-8 gap-6">
        {/* Red Info Card */}
        <div className="bg-[#B91C1C] text-white p-6 sm:p-7 rounded-2xl shadow-lg flex-1 w-full sm:w-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Mentorship Overview
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/90">
            A quick summary of mentorship sessions, active mentors, mentee
            feedback, and upcoming schedules.
          </p>
        </div>

        {/* Right-side Illustration */}
        <div className="flex justify-center items-center sm:justify-end w-full sm:w-auto">
          <img
            src={OverviewImage}
            alt="Mentorship Overview Illustration"
            className="w-40 sm:w-48 md:w-56 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 🔍 Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-red-600">
          Upcoming Mentorship Booked Sessions
        </h3>
        <div className="flex items-center gap-3 flex-wrap text-sm text-gray-600">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={() =>
              setSortBy((prev) =>
                prev === "date" ? "name" : prev === "name" ? "status" : "date"
              )
            }
            className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-lg hover:text-red-600 transition"
          >
            <ArrowUpDown size={16} />
            <span className="capitalize">Sort by {sortBy}</span>
          </button>
        </div>
      </div>

      {/* 🧾 Sessions by Date */}
      <div className="space-y-6">
        {filteredSessions.map((group) => (
          <div key={group.date} className="space-y-3">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700 shadow-sm">
              <span className="font-semibold">Date :</span> {group.date}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left hidden sm:table-cell">Mentor</th>
                    <th className="p-3 text-left hidden md:table-cell">
                      Education
                    </th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Query</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(group.details).length > 0 ? (
                    paginate(group.details).map((s, i) => (
                      <tr
                        key={s.id}
                        className={`${
                          i % 2 === 1 ? "bg-gray-50" : "bg-white"
                        } border-t hover:bg-gray-50 transition`}
                      >
                        <td className="p-3 text-gray-800">{s.student}</td>
                        <td className="p-3 text-gray-600 hidden sm:table-cell">
                          {s.mentor}
                        </td>
                        <td className="p-3 text-gray-600 hidden md:table-cell">
                          {s.education}
                        </td>
                        <td className="p-3 text-gray-600">{s.time}</td>
                        <td
                          onClick={() =>
                            setViewItem({ ...s, _groupDate: group.date })
                          }
                          className="p-3 text-red-600 underline cursor-pointer"
                        >
                          View
                        </td>
                        <td className="p-3">
                          <StatusPill status={s.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-3 text-gray-500 italic"
                      >
                        No sessions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {group.details.length > rowsPerPage && (
              <div className="flex justify-end items-center gap-2 mt-3 text-sm text-gray-600">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>
                <span>
                  Page <strong>{page}</strong> of{" "}
                  {Math.ceil(group.details.length / rowsPerPage)}
                </span>
                <button
                  disabled={
                    page === Math.ceil(group.details.length / rowsPerPage)
                  }
                  onClick={() => setPage((p) => p + 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    page === Math.ceil(group.details.length / rowsPerPage)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {viewItem && (
        <MentorshipViewModal
          session={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}
    </>
  );
};

export default DashboardMain;
