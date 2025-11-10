import React, { useState, useMemo } from "react";
import { Filter, ArrowUpDown, CalendarDays } from "lucide-react";

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

const DoubtSolvingDashboard = ({ data, onAdd, onEdit, onView }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  // ✅ Filter and sort logic applied dynamically
  const filteredSessions = useMemo(() => {
    let result = data.sessions.map((group) => {
      let details = group.details;

      // Apply filter if not 'All'
      if (filterStatus !== "All") {
        details = details.filter((s) => s.status === filterStatus);
      }

      // Sort by time
      const parseTime = (t) =>
        new Date(`1970/01/01 ${t.replace(".", "")}`).getTime();

      details = [...details].sort((a, b) =>
        sortAsc ? parseTime(a.time) - parseTime(b.time) : parseTime(b.time) - parseTime(a.time)
      );

      return { ...group, details };
    });

    return result;
  }, [data.sessions, filterStatus, sortAsc]);

  // ✅ Filter toggle dropdown (simple version)
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <CalendarDays size={18} className="text-red-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-red-600">
            Scheduled Doubt Solving Sessions
          </h2>
        </div>

        {/* ===== Action Buttons ===== */}
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
                    }}
                    className={`px-3 py-1.5 cursor-pointer text-sm hover:bg-red-50 hover:text-red-600 ${
                      filterStatus === status ? "font-semibold text-red-600" : ""
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

          {/* Add New Session */}
          <button
            onClick={onAdd}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
          >
            + Schedule
          </button>
        </div>
      </div>

      {/* ===== Sessions ===== */}
      {filteredSessions.map((group, idx) => (
        <div key={idx} className="space-y-3">
          <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700 shadow-sm">
            <span className="font-semibold text-gray-700">Date:</span> {group.date}
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left hidden sm:table-cell">Mentor</th>
                  <th className="p-3 text-left hidden md:table-cell">Subject</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left hidden lg:table-cell">Plan</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {group.details.length > 0 ? (
                  group.details.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-800 font-medium">{s.student}</td>
                      <td className="p-3 hidden sm:table-cell">{s.mentor}</td>
                      <td className="p-3 hidden md:table-cell">{s.subject}</td>
                      <td className="p-3">{s.time}</td>
                      <td className="p-3 hidden lg:table-cell">{s.plan}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => onView(s.id)}
                          className="text-green-600 text-xs hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit({ ...s, _groupDate: group.date })}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="p-3">
                        <StatusPill value={s.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center text-gray-500" colSpan={7}>
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
