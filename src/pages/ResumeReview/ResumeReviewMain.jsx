


import React, { useState, useMemo, useEffect, useRef } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import ResumeViewModal from "./ResumeViewModal";
import OverviewImage from "../../assets/resume.png";
import RightPanel from "./RightPanel";
import { vtsApi } from "../../services/apiService";

// 🔹 Status Pill Component
const StatusPill = ({ status }) => {
  const formatted =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const cls =
    formatted === "Live"
      ? "bg-red-100 text-red-600"
      : formatted === "Completed"
      ? "bg-green-100 text-green-600"
      : formatted === "Scheduled"
      ? "bg-gray-100 text-gray-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${cls}`}
    >
      {formatted}
    </span>
  );
};

// 🔹 Main Component
const ResumeReviewMain = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 100000;

  const filterMenuRef = useRef(null);

  const statuses = ["All", "Live", "Completed", "Scheduled", "Pending"];

  // 🔥 Fetch API Data with Admin Token
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await vtsApi.get('/api/resume-review');
        if (result.success && result.sessions) {
          setApiData(result.sessions);
        }
      } catch (err) {
        console.error("Error fetching resume review data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Filtering + Searching + Sorting Logic
  const filteredSessions = useMemo(() => {
    return apiData.map((group) => {
      let details = [...group.details];

      // Search + Filter
      details = details.filter((s) => {
        const combinedSearch =
          `${s.name} ${s.mentorName} ${s.careerGoal}`.toLowerCase();

        return (
          (filterStatus === "All" ||
            s.status.toLowerCase() === filterStatus.toLowerCase()) &&
          combinedSearch.includes(searchQuery.toLowerCase())
        );
      });

      // Sorting
      details.sort((a, b) => {
        let aVal = a[sortBy]?.toString().toLowerCase() || "";
        let bVal = b[sortBy]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });

      return { ...group, details };
    });
  }, [apiData, filterStatus, sortBy, sortAsc, searchQuery]);

  const handleSessionUpdate = (updated) => {
  setApiData((prev) =>
    prev.map((group) => ({
      ...group,
      details: group.details.map((item) =>
        item._id === updated._id ? { ...item, ...updated } : item
      ),
    }))
  );
};

  const paginate = (details) => {
    const start = (page - 1) * rowsPerPage;
    return details.slice(start, start + rowsPerPage);
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">Loading...</div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ===== LEFT SIDE ===== */}
        <div className="flex-1 space-y-6">
          {/* ===== HEADER ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-red-700">
              Resume Review
            </h1>

            <div className="w-full lg:max-w-md">
              <input
                type="search"
                placeholder="Search student, mentor, or goal..."
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
              padding: "24px 32px",
            }}
          >
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Resume Review Overview
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                Manage all resume reviews, mentor sessions, and student career
                progress efficiently with detailed insights.
              </p>
            </div>

            <img
              src={OverviewImage}
              alt="Overview"
              className="w-32 md:w-40 lg:w-48 object-contain"
            />
          </div>

          {/* ===== FILTER + SORT CONTROLS ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-red-700">
              Upcoming Resume Reviews
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
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">Career Goal</th>
                      <th className="p-3 text-left">Action</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginate(group.details).map((s, i) => (
                      <tr
                        key={s._id}
                        className={`border-t transition ${
                          s.status.toLowerCase() === "completed"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : i % 2 === 1
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-3 font-medium">{s.name}</td>
                        <td className="p-3 hidden sm:table-cell">
                          {s.mentorName || "—"}
                        </td>
                        <td className="p-3">{s.time}</td>
                        <td className="p-3">{s.careerGoal}</td>

                        <td className="p-3">
                          <button
                            onClick={() =>
                              setViewItem({ ...s, _groupDate: group.date })
                            }
                            className="underline text-sm text-red-600 hover:text-red-800"
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
          <RightPanel data={apiData} />
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {viewItem && (
        <ResumeViewModal
          session={viewItem}
          onClose={() => setViewItem(null)}
          onUpdate={handleSessionUpdate} 
        />
      )}
    </div>
  );
};

export default ResumeReviewMain;
