import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
import DoubtSolvingDetails from "./DoubtSolvingDetails";
import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";
import localData from "../../data/doubtSolvingData.json";

const API_URL = import.meta.env.VITE_API_URL;

const DoubtSolving = () => {
  const [data, setData] = useState({ sessions: [], mentors: [], highlights: [] });
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch data from API
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doubts`);
        const result = await response.json();

        if (result?.sessions && Array.isArray(result.sessions)) {
          // Transform API data to match expected format
          const transformed = {
            sessions: result.sessions.map((group) => {
              // Handle different date formats
              let formattedDate = group.date;
              
              // If date is in "DD-MM-YYYY" format, convert to "Month DD, YYYY"
              if (group.date && group.date.includes("-") && group.date.split("-").length === 3) {
                const [day, month, year] = group.date.split("-");
                formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }
              
              return {
                date: formattedDate,
                details: group.details.map((item) => ({
                  _id: item._id || item.id,
                  name: item.name || item.student,
                  email: item.email || "",
                  mobile: item.mobile || "",
                  mentorName: item.mentorName || item.mentor || "Not Assigned",
                  subject: item.subject || "",
                  topic: item.topic || "",
                  time: item.time || "",
                  plan: item.plan || "",
                  doubts: item.doubts || item.doubt || "",
                  status: item.status || "Pending",
                  createdAt: item.createdAt || new Date().toISOString(),
                  updatedAt: item.updatedAt || new Date().toISOString(),
                  file: item.file || null,
                })),
              };
            }),
            mentors: result.mentors || [],
            highlights: result.highlights || [],
          };
          
          setData(transformed);
        } else {
          // Fallback to local data
          console.warn("API response format unexpected, using fallback data");
          setData(localData);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doubts:", err);
        // Fallback to local data on error
        setData(localData);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doubt solving sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Dashboard */}
      <div className="flex-1 w-full px-2 sm:px-4 py-4 overflow-y-auto">
        <DoubtSolvingDashboard
          data={data}
          onView={handleView}
          selectedDate={selectedDate}
        />
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <DoubtSolvingRightPanel
          data={data}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

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
