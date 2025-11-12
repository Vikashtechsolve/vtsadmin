import React, { useEffect, useState } from "react";
import DashboardMain from "./DashboardMain";
import RightPanel from "./RightPanel";
import localData from "../../data/mentorshipData.json";

const MentorshipDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/mentorshipData.json");
        if (res.ok) {
          setData(await res.json());
        } else {
          setData(localData);
        }
      } catch {
        setData(localData);
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
