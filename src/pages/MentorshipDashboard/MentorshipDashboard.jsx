import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"; // existing file in your project
import DashboardMain from "./DashboardMain";
import RightPanel from "./RightPanel";
import localData from "../../data/mentorshipData.json";

const MentorshipDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Attempt to fetch (public /data), fallback to import
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
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (left) */}
      {/* <div className="hidden lg:block"> */}
        {/* <Sidebar /> */}
      {/* </div> */}

      {/* Main content area */}
      <div className="flex-1">
        <div className="p-4 sm:p-6 lg:p-10">
          <DashboardMain data={data} />
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden xl:block w-80 border-l bg-white">
        <RightPanel data={data} />
      </div>
    </div>
  );
};

export default MentorshipDashboard;
