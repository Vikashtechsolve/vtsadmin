import React, { useState, useMemo } from "react";
import { Filter, ArrowUpDown, CalendarDays, Search } from "lucide-react";
import doubtSolvingData from "../../data/doubtSolvingData.json";
import DoubtSolvingIntroCard from "../../modules/doubtSolving/DoubtSolvingIntroCard";

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
    <span
      className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${cls}`}
    >
      {value}
    </span>
  );
};

const DoubtSolvingDashboard = ({ onView }) => {
  const data = doubtSolvingData;

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 6;

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  const filteredSessions = useMemo(() => {
    return data.sessions.map((group) => {
      let details = group.details;

      if (filterStatus !== "All") {
        details = details.filter((s) => s.status === filterStatus);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        details = details.filter(
          (s) =>
            s.student.toLowerCase().includes(q) ||
            s.mentor.toLowerCase().includes(q) ||
            s.subject.toLowerCase().includes(q)
        );
      }

      details = [...details].sort((a, b) =>
        sortAsc
          ? a.time.localeCompare(b.time)
          : b.time.localeCompare(a.time)
      );

      return { ...group, details };
    });
  }, [data.sessions, filterStatus, sortAsc, searchQuery]);

  const flatSessions = useMemo(
    () =>
      filteredSessions.flatMap((group) =>
        group.details.map((session) => ({
          ...session,
          date: group.date,
        }))
      ),
    [filteredSessions]
  );

  const totalPages = Math.ceil(flatSessions.length / ITEMS_PER_PAGE);
  const paginated = flatSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const grouped = useMemo(() => {
    const groups = {};
    for (const s of paginated) {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    }
    return Object.entries(groups).map(([date, details]) => ({ date, details }));
  }, [paginated]);

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-700">
          Doubt Solving
        </h1>

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search student, mentor, or subject..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-200 text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Welcome card */}
      <DoubtSolvingIntroCard />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <CalendarDays size={18} className="text-red-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-red-600">
            Scheduled Sessions
          </h2>
        </div>

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
                    className={`px-3 py-1.5 cursor-pointer hover:bg-red-50 ${
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
        </div>
      </div>

      {/* Table */}
      {grouped.length > 0 ? (
        grouped.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700 shadow-sm">
              Date: {group.date}
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left hidden sm:table-cell">Mentor</th>
                    <th className="p-3 text-left hidden md:table-cell">
                      Subject
                    </th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left hidden lg:table-cell">Plan</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.details.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-t ${
                        s.status === "Completed"
                          ? "bg-gray-100 text-gray-400"
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
                          onClick={() =>
                            onView({ ...s, _groupDate: group.date })
                          }
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 italic">No sessions found.</p>
      )}
    </div>
  );
};

export default DoubtSolvingDashboard;
