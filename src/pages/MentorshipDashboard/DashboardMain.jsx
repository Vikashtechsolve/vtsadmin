import { useState, useMemo } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import MentorshipViewModal from "./MentorshipViewModal";
import OverviewImage from "../../assets/cpimg.png";

const mentorsList = [
  "Aman vats",
  "Rohit sharma",
  "Sonal verma",
  "Anjali singh",
  "Rakesh kumar",
];

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
const DashboardMain = ({ data, setData }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewItem, setViewItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const rowsPerPage = 10000; // Show all rows per date group

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  // ===================== FILTER + SORT + SEARCH =====================
  const filteredSessions = useMemo(() => {
    if (!data?.sessions) return [];

    return data.sessions.map((g) => {
      let details = g.details || [];

      // Normalize lowercase API statuses
      details = details.map((d) => ({
        ...d,
        status:
          d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase(),
      }));

      // 🔍 STATUS FILTER
      if (filterStatus !== "All") {
        details = details.filter(
          (s) => s.status.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      // 🔍 SEARCH FILTER
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        details = details.filter((s) =>
          [s.student, s.mentor, s.query]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(q))
        );
      }

      // 🔽 SORT by TIME only
      details = [...details].sort((a, b) => {
        const t1 = new Date(`1970/01/01 ${a.time}`).getTime();
        const t2 = new Date(`1970/01/01 ${b.time}`).getTime();
        return sortOrder === "asc" ? t1 - t2 : t2 - t1;
      });

      return { ...g, details };
    });
  }, [data, filterStatus, sortOrder, searchQuery]);

  // =============== PAGINATION PER DATE GROUP ===============
  const paginate = (details) => {
    const start = (page - 1) * rowsPerPage;
    return details.slice(start, start + rowsPerPage);
  };

  // =============== HANDLE UPDATE ===============
  const handleSessionUpdate = (updated) => {
    setData((prev) => {
      // Create a deep copy and update the specific session
      const newSessions = prev.sessions.map((group) => ({
        ...group,
        details: group.details.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item
        ),
      }));

      return { ...prev, sessions: newSessions };
    });
  };

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

      {/* ================= OVERVIEW ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-transparent mb-8 gap-6">
        <div className="bg-[#B91C1C] text-white p-6 sm:p-7 rounded-2xl shadow-lg flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Mentorship Overview
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/90">
            A quick summary of mentorship sessions, active mentors, mentee
            feedback, and upcoming schedules.
          </p>
        </div>

        <div className="flex justify-center items-center sm:justify-end">
          <img
            src={OverviewImage}
            alt="Mentorship Overview"
            className="w-40 sm:w-48 md:w-56 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* ================= FILTER + SORT ================= */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-red-600">
          Upcoming Mentorship Sessions
        </h3>

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
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            <ArrowUpDown size={16} />{" "}
            <span>Time {sortOrder === "asc" ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>

      {/* ================= SESSION TABLE ================= */}
      <div className="space-y-6">
        {filteredSessions.map((group) => (
          <div key={group.date} className="space-y-3">
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
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginate(group.details).length > 0 ? (
                    paginate(group.details).map((s, i) => (
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
                        <td className="p-3">{s.student}</td>
                        <td className="p-3 hidden sm:table-cell">{s.mentor}</td>
                        <td className="p-3 hidden md:table-cell">
                          {s.subject}
                        </td>
                        <td className="p-3">{s.time}</td>
                        <td
                          onClick={() =>
                            s.status !== "Completed" &&
                            setViewItem({ ...s, _groupDate: group.date })
                          }
                          className={`p-3 underline ${
                            s.status === "Completed"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800 cursor-pointer"
                          }`}
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
          mentorsList={mentorsList}
          onUpdate={handleSessionUpdate}
        />
      )}
    </>
  );
};

export default DashboardMain;