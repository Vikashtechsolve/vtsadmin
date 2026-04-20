import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "./StatCard";
import { fetchDashboardStats } from "./API/api";
import Pic from "../../assets/class.png";

import { Bell, Play, Search, UserRound } from "lucide-react";
import PlaylistsSection from "./Playlist/PlaylistsSection";
import Blogs from "./Blogs/Blogs";
import News from "./News/News";
import MasterClasses from "./MasterClasses/MasterClasses";
import {
  CalendarCheck2,
  ListVideo,
  Newspaper,
  User,
  Video,
  IdCard,
  Users,
} from "lucide-react";
import RightActivitySidebar from "./RightActivitySidebar";
import LmsHeader from "./LmsHeader";

const LmsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // axios simulation
        await axios.get("/dashboard");
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <>
      {/* <div className="p-8 border-b w-2xl border-gray-200 mb-6">
      </div> */}
      <div className="p- flex flex-col lg:flex-row gap-6">
       <div className="py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-18 w-full
        lg:w-4xl
         bg-gray-50 min-h-screen">

          {/* Header */}
      <LmsHeader />

          <div className="flex px-2 py-2 gap-12 items-center mb-8">
            {/* Profile Image – desktop only (unchanged) */}
            <div className="hidden sm:flex w-55 h-40 p-2 rounded-full bg-[#F0F0F0] overflow-hidden items-center justify-center">
              <img src={Pic} alt="Profile" className="object-cover" />
            </div>

            {/* Welcome Card */}
            <div className="relative bg-red-700 text-left lg:text-center text-white rounded-xl p-6 lg:p-8 shadow-md w-120 overflow-hidden">
              {/* Text */}
              <div className="lg:w-full pr-20 lg:pr-0">
                <h2 className="text-lg lg:text-2xl font-semibold mb-2">
                  Welcome to LMS Admin Dashboard
                </h2>
                <p className="text-red-100 text-sm lg:text-base">
                  Manage content, users, and learning resources with ease.
                </p>
              </div>

              {/* Image inside card – MOBILE ONLY */}
              <img
                src={Pic}
                alt="Illustration"
                className="absolute right-3 bottom-4 w-24 sm:hidden"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Total Students Enroll"
              value={stats.totalStudents}
              icon={<Users />}
            />
            <StatCard
              title="Total Playlists Available"
              value={stats.totalPlaylists}
              icon={<ListVideo fill="red" />}
            />
            <StatCard
              title="Master Classes"
              value={stats.masterClasses}
              icon={<IdCard />}
            />

            <StatCard
              title="Programs"
              value={stats.programs}
              icon={<CalendarCheck2 />}
            />

            <StatCard
              title="Blog Posts Published"
              value={stats.blogPosts}
              icon={<CalendarCheck2 />}
            />
            <StatCard
              title="News Published"
              value={stats.newsPublished}
              icon={<Newspaper />}
            />
            <StatCard
              title="Interviews"
              value={stats.interviews}
              icon={<UserRound />}
            />
            <StatCard
              title="Reels Posted"
              value={stats.reelsPosted}
              icon={<Video />}
            />
          </div>

          <div className="mt-8">
            <h1 className="text-red-700 font-semibold text-xl mb-4">
              Playlists
            </h1>
            <PlaylistsSection />
          </div>

          <div className="mt-8">
            <h1 className="text-red-700 font-semibold text-xl mb-4">Blogs</h1>
            <Blogs />
          </div>

          <div className="mt-8">
            <h1 className="text-red-700 font-semibold text-xl mb-4">News</h1>
            <News />
          </div>

          <div className="mt-8">
            <h1 className="text-red-700 font-semibold text-xl mb-4">Master Classes</h1>
            <MasterClasses />
          </div>
        </div>

        <div className="w-full lg:w-[320px] order-2 lg:order-none">
          <RightActivitySidebar />
        </div>
      </div>
    </>
  );
};

export default LmsDashboard;
