
import React, { useEffect, useState } from "react";
import DashboardMain from "./DashboardMain";
import RightPanel from "./RightPanel";
import localData from "../../data/mentorshipData.json";

const MentorshipDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/mentorship");

        if (res.ok) {
          const apiData = await res.json();

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
                  email:item.email,
                  mobile:item.mobile,
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
        setData(localData); // fallback
      }
    };

    load();
  }, []);

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
          <DashboardMain data={data} />
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
