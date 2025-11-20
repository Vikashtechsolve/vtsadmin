import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
import DoubtSolvingDetails from "./DoubtSolvingDetails";
import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";

const API_URL = import.meta.env.VITE_API_URL;

const DoubtSolving = () => {
  const [data, setData] = useState({ sessions: [] });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch data from API
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doubts` );
        const result = await response.json();

        if (result?.sessions) {
          setData(result);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doubts:", err);
      }
    };

    fetchDoubts();
  }, []);

  // View details modal
  const handleView = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  // Close modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSession(null);
  };

  // Local update handler
  const handleSubmit = (updatedSession) => {
    const updated = { ...data };

    updated.sessions = updated.sessions.map((group) => ({
      ...group,
      details: group.details.map((item) =>
        item._id === updatedSession._id ? updatedSession : item
      ),
    }));

    setData(updated);
    setShowDetails(false);
    setSelectedSession(null);
    alert("Updated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">

      {/* Dashboard */}
      <div className="flex-1 w-full px-2 sm:px-4 py-4">
        <DoubtSolvingDashboard
          data={data}
          onView={handleView}
          selectedDate={selectedDate}
        />
      </div>

      {/* Right Panel */}
      <DoubtSolvingRightPanel
        data={data}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Modal */}
      {showDetails && (
        <DoubtSolvingDetails
          session={selectedSession}
          onBack={handleCloseDetails}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DoubtSolving;
