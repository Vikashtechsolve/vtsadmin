import React, { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import localData from "../../data/doubtSolvingData.json";
import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
import DoubtSolvingDetails from "./DoubtSolvingDetails";
import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";

const DoubtSolving = () => {
  const [data, setData] = useState(localData);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ When user clicks "View"
  const handleView = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  // ✅ When modal is closed
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSession(null);
  };

  // ✅ When modal is submitted (update + close)
  const handleSubmit = (updatedSession) => {
    const updatedData = { ...data };

    // Update session in data
    updatedData.sessions = updatedData.sessions.map((group) => ({
      ...group,
      details: group.details.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
    }));

    setData(updatedData);
    setShowDetails(false);
    setSelectedSession(null);

    alert("✅ Session updated successfully!");
  };

  // ✅ Filter sessions based on calendar date
  const filteredData = useMemo(() => {
    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const filtered = data.sessions.filter((s) => s.date === formattedDate);
    return filtered.length > 0
      ? { ...data, sessions: filtered }
      : { ...data, sessions: [] };
  }, [data, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* ===== LEFT SIDE: Dashboard Section ===== */}
      <div className="flex-1 w-full lg:w-auto px-2 sm:px-4 py-2 sm:py-4">
        <DoubtSolvingDashboard data={filteredData} onView={handleView} />
      </div>

      {/* ===== RIGHT SIDE: Panel Section ===== */}
      <div className="w-full lg:w-[360px] xl:w-[400px] bg-white border-l border-gray-100 shadow-sm h-full overflow-y-auto">
        {/* ✅ Calendar at top */}
        <div className="p-5 border-b">
          <h4 className="text-sm font-semibold text-red-600 mb-3">
            Select a Date
          </h4>
          <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar-custom w-full"
            />
          </div>
        </div>

        {/* ✅ Right Panel data (top mentors / highlights) */}
        <DoubtSolvingRightPanel
          data={data}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* ===== MODAL / DETAILS VIEW ===== */}
      {showDetails && (
        <DoubtSolvingDetails
          session={selectedSession}
          onBack={handleCloseDetails}
          onSubmit={handleSubmit} // ✅ added submit handling
        />
      )}
    </div>
  );
};

export default DoubtSolving;
