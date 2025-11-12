import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  ArrowUpZA,
  ArrowDownZA,
  Filter,
  ArrowUpDown,
} from "lucide-react"; // ✅ Updated icons
import MentorshipViewModal from "./MentorshipViewModal";
import OverviewImage from "../../assets/cpimg.png"; // ✅ Overview image

// 🔹 Status Pill Component
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

// 🔹 Main Dashboard Component
const DashboardMain = ({ data }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewItem, setViewItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const rowsPerPage = 3;

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  // 🔹 Enhanced Filter + Sort + Search Logic
  const filteredSessions = useMemo(() => {
    if (!data?.sessions) return [];

    return data.sessions.map((g) => {
      let details = g.details || [];

      // ✅ Filter by Status
      if (filterStatus !== "All") {
        details = details.filter(
          (s) => s.status.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      // ✅ Search by Student, Mentor, or Query (multi-term)
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(" ");
        details = details.filter((s) =>
          terms.every((term) =>
            [s.student, s.mentor, s.query, s.doubts]
              .filter(Boolean)
              .some((field) => field.toLowerCase().includes(term))
          )
        );
      }

      // ✅ Sorting
      details = [...details];
      details.sort((a, b) => {
        const getValue = (key, obj) => {
          if (key === "time") {
            return new Date(`1970/01/01 ${obj.time}`).getTime();
          }
          return (obj[key] || "").toString().toLowerCase();
        };

        const valA = getValue(sortBy, a);
        const valB = getValue(sortBy, b);

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      return { ...g, details };
    });
  }, [data, filterStatus, sortBy, sortOrder, searchQuery]);

  // 🔹 Pagination helper
  const paginate = (details) => {
    const start = (page - 1) * rowsPerPage;
    return details.slice(start, start + rowsPerPage);
  };

  // 🔹 Sort options
  const sortOptions = ["time", "student", "mentor", "status"];

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-red-600">Dashboard</h1>

        {/* 🔍 Search Bar */}
        <div className="w-full md:max-w-lg">
          <input
            type="search"
            placeholder="Search student, mentor, or query..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* ================= OVERVIEW SECTION ================= */}
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

      {/* ================= FILTER + SORT CONTROLS ================= */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-red-600">
          Upcoming Mentorship Booked Sessions
        </h3>

        <div className="flex items-center gap-3 text-gray-500 text-sm relative">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-red-600"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} /> <span>Filter</span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32">
                {statuses.map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowFilterMenu(false);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 cursor-pointer text-sm hover:bg-red-50 hover:text-red-600 ${
                      filterStatus === status
                        ? "font-semibold text-red-600"
                        : ""
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Button */}
          <button
            className="flex items-center gap-1 hover:text-red-600"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            <ArrowUpDown size={16} />{" "}
            <span>Sort {sortOrder === "asc" ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>

      {/* ================= SESSION TABLES ================= */}
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
                    <th className="p-3 text-left hidden sm:table-cell">
                      Mentor
                    </th>
                    <th className="p-3 text-left hidden md:table-cell">
                      Education
                    </th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Action</th>
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
                          className="p-3 text-red-600 underline cursor-pointer hover:text-red-800"
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
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
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
