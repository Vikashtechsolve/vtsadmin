import React, { useState, useMemo, useEffect, useRef } from "react";
import { Filter, ArrowUpDown, CalendarDays } from "lucide-react";
import OverviewImage from "../../assets/Problemsolving.png";
import doubtSolvingData from "../../data/doubtSolvingData.json";
import RightPanel from "./RightPanel"; // optional right panel (like ResumeReview)

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

// 🔹 Main Component
const DoubtSolvingDashboard = () => {
  const data = doubtSolvingData;

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("student");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const filterMenuRef = useRef(null);

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  // 🔸 Close Filter Menu on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Filtering, Sorting, Searching
  const filteredSessions = useMemo(() => {
    const sessions = [...data.sessions];

    const filtered = sessions.map((g) => {
      let details = g.details.filter(
        (s) =>
          (filterStatus === "All" || s.status === filterStatus) &&
          (s.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Sorting logic
      details.sort((a, b) => {
        let aVal = a[sortBy]?.toString().toLowerCase() || "";
        let bVal = b[sortBy]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });

      return { ...g, details };
    });

    return filtered;
  }, [data.sessions, filterStatus, sortBy, sortAsc, searchQuery]);

  const paginate = (details) => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return details.slice(start, end);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ===== LEFT SIDE ===== */}
        <div className="flex-1 space-y-6">
          {/* ===== HEADER ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-red-700">
              Doubt Solving Dashboard
            </h1>
            <div className="w-full lg:max-w-md">
              <input
                type="search"
                placeholder="Search student, mentor, or subject..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-red-200 focus:outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* ===== OVERVIEW CARD ===== */}
          <div
            className="text-white border border-red-800 shadow-lg flex flex-col md:flex-row items-center justify-between"
            style={{
              backgroundColor: "#B11C20",
              width: "660px",
              height: "158px",
              borderRadius: "12px",
              opacity: 1,
              position: "relative",
              transform: "rotate(0deg)",
              padding: "24px 32px",
            }}
          >
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Doubt Solving Overview
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                Track all your live 1:1 doubt solving sessions, student
                interactions, and mentor engagements easily with real-time
                updates.
              </p>
            </div>

            <div className="mt-5 md:mt-0 flex justify-center md:justify-end w-full md:w-auto">
              <img
                src={OverviewImage}
                alt="Overview"
                className="w-25 sm:w-28 md:w-32 lg:w-36 object-contain"
              />
            </div>
          </div>

          {/* ===== FILTER + SORT CONTROLS ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-red-700">
              Upcoming Doubt Solving Sessions
            </h3>

            <div className="flex items-center gap-3 text-gray-500 text-sm relative">
              {/* Filter */}
              <div className="relative" ref={filterMenuRef}>
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

          {/* ===== DATA TABLE ===== */}
          {filteredSessions.map((group) => (
            <div key={group.date} className="space-y-4">
              <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700 shadow-sm">
                <span className="font-semibold">Date:</span> {group.date}
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
                        Subject
                      </th>
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">Plan</th>
                      <th className="p-3 text-left">Action</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(group.details).map((s, i) => (
                      <tr
                        key={s.id}
                        className={`border-t transition ${
                          s.status === "Completed"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : i % 2 === 1
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-3 font-medium">{s.student}</td>
                        <td className="p-3 hidden sm:table-cell">{s.mentor}</td>
                        <td className="p-3 hidden md:table-cell">
                          {s.subject}
                        </td>
                        <td className="p-3">{s.time}</td>
                        <td className="p-3">{s.plan}</td>
                        <td className="p-3">
                          <button
                            onClick={() => alert(`Viewing ${s.student}`)}
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
                          <StatusPill status={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-2xl shadow-sm h-fit">
          <RightPanel data={data} />
        </div>
      </div>
    </div>
  );
};

export default DoubtSolvingDashboard;
