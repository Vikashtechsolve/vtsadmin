import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { playlists } from "../API/playlistsData";
import PlaylistInfoSidebar from "./PlaylistInfoSidebar";
import RightActivitySidebar from "../RightActivitySidebar";
import LmsHeader from "../LmsHeader";
import { Trash2, Pencil, Plus } from "lucide-react";
import GraduationCapIcon from "../icon";
import { useNavigate } from "react-router-dom";

// import PlaylistTabs from "./PlaylistTabs/PlaylistTabs";

export default function PlaylistDetails() {
  const { id } = useParams();
  const playlist = playlists.find((p) => p.id === id);
  
  
  const [openModuleId, setOpenModuleId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  // const [activeTab, setActiveTab] = useState("videos");
  
  
  const navigate = useNavigate();

  const menuRef = useRef(null); // 👈 menu reference

  if (!playlist) return <p className="p-8">Playlist not found</p>;

  const toggleModule = (moduleId) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  const toggleMenu = (moduleId) => {
    setOpenMenuId(openMenuId === moduleId ? null : moduleId);
  };

  // ✅ OUTSIDE CLICK HANDLER
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-8 flex flex-col lg:flex-row gap-6">
      {/* LEFT SECTION */}
      <div className="flex-1">
        <LmsHeader />

        <h1 className="text-2xl font-semibold text-red-600 mb-4 mt-8">
          {playlist.title} Playlist
        </h1>

        <button className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-lg">+</span>
          Add Module
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-600">Topics</h2>
          <button className="border px-4 py-1 rounded-lg text-sm text-gray-600">
            Re-order topics
          </button>
        </div>

        <div className="space-y-4">
          {playlist.modules.map((module) => (
            <div key={module.id} className="relative">
              {/* MODULE HEADER */}
              <div
                onClick={() => toggleModule(module.id)}
                className="cursor-pointer bg-blue-100 rounded-xl px-6 py-4 flex justify-between items-center"
              >
                <p className="font-medium">• {module.title}</p>

                {/* 3 DOT BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(module.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full"
                >
                  •••
                </button>
              </div>

              {/* 3 DOT MENU */}
              {openMenuId === module.id && (
                <div
                  ref={menuRef}
                  className="absolute right-4 top-14 bg-white border border-gray-300 rounded-lg shadow-md z-10 w-44"
                >
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm border-b hover:bg-gray-100 text-gray-400">
                    <Pencil size={16} /> Edit Module
                  </button>

                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm border-b hover:bg-gray-100 text-gray-400">
                    <Plus size={16} /> Add Session
                  </button>

                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-400">
                    <Trash2 size={16} /> Delete Module
                  </button>
                </div>
              )}

              {/* SESSIONS */}
              {openModuleId === module.id && (
                <div 
                 className="mt-3 w-full space-y-3">
                  {module.sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => navigate(`/lmsDashboard/playlists/${playlist.id}/session/${session.id}`)}
                      className="flex justify-between text-sm items-center border border-gray-400 rounded-xl p-2 bg-white"
                    >
                      <div>
                        <p className="font-medium flex gap-2">
                          <GraduationCapIcon size={22} color="#000000" />

                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Posted on : {session.postedOn}
                        </p>
                      </div>

                      <div className="flex sm:flex-row gap-2">
                        <button className="border cursor-pointer border-gray-400 flex gap-1 px-2 py-1 rounded text-xs text-gray-400 w-full sm:w-auto justify-center items-center hover:bg-blue-600  hover:text-white">
                          <Pencil size={12} /> Edit
                        </button>
                        <button className="border cursor-pointer border-gray-400 flex gap-2 px-3 py-2 rounded text-xs text-gray-400 w-full sm:w-auto justify-center  hover:bg-red-600  hover:text-white">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-[320px] space-y-6">
        <PlaylistInfoSidebar playlist={playlist} />
        <RightActivitySidebar />
      </div>
    </div>
  );
}
