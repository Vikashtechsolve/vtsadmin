import React, { useState, useMemo } from "react";
import { Filter, ArrowUpDown, CalendarDays, Search } from "lucide-react";
import doubtSolvingData from "../../data/doubtSolvingData.json";
import DoubtSolvingIntroCard from "../../modules/doubtSolving/DoubtSolvingIntroCard"; // ✅ Imported intro card

// 🔹 Status Pill Component
const StatusPill = ({ value }) => {
  const cls =
    value === "Live"
      ? "bg-red-100 text-red-600"
      : value === "Completed"
      ? "bg-green-100 text-green-600"
      : value === "Scheduled"
      ? "bg-gray-100 text-gray-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${cls}`}>
      {value}
    </span>
  );
};

// 🔹 Main Dashboard Component
const DoubtSolvingDashboard = () => {
  const data = doubtSolvingData;

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 6;

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  // ✅ Filter + Sort + Search Logic
  const filteredSessions = useMemo(() => {
    return data.sessions.map((group) => {
      let details = group.details;

      // Filter
      if (filterStatus !== "All") {
        details = details.filter((s) => s.status === filterStatus);
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        details = details.filter(
          (s) =>
            s.student.toLowerCase().includes(q) ||
            s.mentor.toLowerCase().includes(q) ||
            s.subject.toLowerCase().includes(q)
        );
      }

      // Sort
      const parseTime = (t) =>
        new Date(`1970/01/01 ${t.replace(".", "")}`).getTime();

      details = [...details].sort((a, b) =>
        sortAsc
          ? parseTime(a.time) - parseTime(b.time)
          : parseTime(b.time) - parseTime(a.time)
      );

      return { ...group, details };
    });
  }, [data.sessions, filterStatus, sortAsc, searchQuery]);

  // ✅ Flatten for pagination
  const flatSessions = useMemo(() => {
    return filteredSessions.flatMap((group) =>
      group.details.map((session) => ({
        ...session,
        date: group.date,
      }))
    );
  }, [filteredSessions]);

  // ✅ Pagination
  const totalPages = Math.ceil(flatSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = flatSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedGroups = useMemo(() => {
    const grouped = {};
    for (const s of paginatedSessions) {
      if (!grouped[s.date]) grouped[s.date] = [];
      grouped[s.date].push(s);
    }
    return Object.entries(grouped).map(([date, details]) => ({
      date,
      details,
    }));
  }, [paginatedSessions]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Dummy Handlers
  const handleAdd = () => alert("Add new session (coming soon)");
  const handleView = (id) => alert(`Viewing session ID: ${id}`);

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* ===== Top Bar (Dashboard title + Search) ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-red-700">Dashboard</h1>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by student, mentor, or subject..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-200 focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* ===== Welcome Card ===== */}
      <DoubtSolvingIntroCard /> {/* ✅ Imported Card */}

      {/* ===== Section Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <CalendarDays size={18} className="text-red-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-red-600">
            Scheduled Doubt Solving Sessions
          </h2>
        </div>

        {/* ===== Controls ===== */}
        <div className="flex items-center gap-3 text-gray-500 text-sm relative">
          {/* Filter */}
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
                      setCurrentPage(1);
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

          {/* Sort */}
          <button
            className="flex items-center gap-1 hover:text-red-600"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <ArrowUpDown size={16} />{" "}
            <span>Sort {sortAsc ? "↑" : "↓"}</span>
          </button>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
          >
            + Schedule
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      {paginatedGroups.length > 0 ? (
        paginatedGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700 shadow-sm">
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              {group.date}
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left hidden sm:table-cell">
                      Mentor
                    </th>
                    <th className="p-3 text-left hidden md:table-cell">
                      Subject
                    </th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left hidden lg:table-cell">
                      Plan
                    </th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.details.length > 0 ? (
                    group.details.map((s) => (
                      <tr
                        key={s.id}
                        className={`border-t transition ${
                          s.status === "Completed"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-3 font-medium">{s.student}</td>
                        <td className="p-3 hidden sm:table-cell">{s.mentor}</td>
                        <td className="p-3 hidden md:table-cell">{s.subject}</td>
                        <td className="p-3">{s.time}</td>
                        <td className="p-3 hidden lg:table-cell">{s.plan}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleView(s.id)}
                            disabled={s.status === "Completed"}
                            className={`underline text-sm ${
                              s.status === "Completed"
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            View
                          </button>
                        </td>
                        <td className="p-3">
                          <StatusPill value={s.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="p-3 text-center text-gray-500"
                        colSpan={7}
                      >
                        No sessions for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 italic">
          No sessions found.
        </div>
      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, flatSessions.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {flatSessions.length}
            </span>{" "}
            sessions
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubtSolvingDashboard;
