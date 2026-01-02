import React, { useEffect, useState } from "react";
import DashboardMain from "./DashboardMain";
import RightPanel from "./RightPanel";
import localData from "../../data/mentorshipData.json";
import { vtsApi } from "../../services/apiService";

const MentorshipDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const apiData = await vtsApi.get('/api/mentorship');

        if (apiData && apiData.sessions) {
          // --- TRANSFORM API DATA → UI FORMAT ---
          const transformed = {
            sessions: apiData.sessions.map((group) => {
              // Convert date: "28-10-2025" → "October 28, 2025"
              const [day, month, year] = group.date.split("-");
              const formattedDate = new Date(
                `${year}-${month}-${day}`
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return {
                date: formattedDate,
                details: group.details.map((item) => ({
                  id: item._id,
                  student: item.name,
                  subject: item.subject,
                  file: item.file || null,
                  mentor: item.mentorName || "Not Assigned",
                  education: "Not Provided", // API does not send education
                  time: item.time,
                  query: item.query,
                  email: item.email,
                  mobile: item.mobile,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  status:
                    item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).toLowerCase(), // pending → Pending
                })),
              };
            }),

            mentors: apiData.mentors || [],
            highlights: apiData.highlights || [],
          };

          setData(transformed);
        } else {
          setData(localData); // fallback to local JSON
        }
      } catch (err) {
        console.error("Error fetching mentorship data:", err);
        setData(localData); // fallback
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentorship data...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="flex-1">
        <div className="p-4 sm:p-6 lg:p-10">
          {/* Passed setData down so child components can update global state */}
          <DashboardMain data={data} setData={setData} />
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden xl:block w-80 bg-white border-l border-gray-100">
        <RightPanel data={data} />
      </div>
    </div>
  );
};

export default MentorshipDashboard;