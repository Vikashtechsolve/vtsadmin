// import React, { useEffect, useState, useMemo } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
// import DoubtSolvingDetails from "./DoubtSolvingDetails";
// import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";

// const DoubtSolving = () => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // ✅ When user clicks "View"
//   const handleView = (session) => {
//     setSelectedSession(session);
//     setShowDetails(true);
//   };

//   // ✅ When modal is closed
//   const handleCloseDetails = () => {
//     setShowDetails(false);
//     setSelectedSession(null);
//   };

//   // ✅ When modal is submitted (update + close)
//   const handleSubmit = (updatedSession) => {
//     const updatedData = { ...data };

//     // Update session in data
//     updatedData.sessions = updatedData.sessions.map((group) => ({
//       ...group,
//       details: group.details.map((s) =>
//         s.id === updatedSession.id ? updatedSession : s
//       ),
//     }));

//     setData(updatedData);
//     setShowDetails(false);
//     setSelectedSession(null);

//     alert("✅ Session updated successfully!");
//   };

//   // ✅ Filter sessions based on calendar date
//   const filteredData = useMemo(() => {
//     const formattedDate = selectedDate.toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     const filtered = data.sessions.filter((s) => s.date === formattedDate);
//     return filtered.length > 0
//       ? { ...data, sessions: filtered }
//       : { ...data, sessions: [] };
//   }, [data, selectedDate]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
//       {/* ===== LEFT SIDE: Dashboard Section ===== */}
//       <div className="flex-1 w-full lg:w-auto px-2 sm:px-4 py-2 sm:py-4">
//         <DoubtSolvingDashboard data={filteredData} onView={handleView} />
//       </div>

     

//         {/* ✅ Right Panel data (top mentors / highlights) */}
//         <DoubtSolvingRightPanel
//           data={data}
//           selectedDate={selectedDate}
//           onDateChange={setSelectedDate}
//         />
   

//       {/* ===== MODAL / DETAILS VIEW ===== */}
//       {showDetails && (
//         <DoubtSolvingDetails
//           session={selectedSession}
//           onBack={handleCloseDetails}
//           onSubmit={handleSubmit} // ✅ added submit handling
//         />
//       )}
//     </div>
//   );
// };

// export default DoubtSolving;
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
import DoubtSolvingDetails from "./DoubtSolvingDetails";
import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";

const API_URL = "http://localhost:8000/api/doubts";

const DoubtSolving = () => {
  const [data, setData] = useState({ sessions: [] });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch data from API
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(API_URL);
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
