import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { fetchPlaylistById, fetchPlaylistModules } from "../API/playlistApi";
import { createModule, deleteModule } from "../API/moduleApi";
import { createSession, deleteSession } from "../API/sessionApi";
import PlaylistInfoSidebar from "./PlaylistInfoSidebar";
import RightActivitySidebar from "../RightActivitySidebar";
import LmsHeader from "../LmsHeader";
import AddModuleModal from "./AddModuleModal";
import EditModuleModal from "./EditModuleModal";
import AddSessionModal from "./AddSessionModal";
import EditSessionModal from "./EditSessionModal";
import Breadcrumb from "./Breadcrumb";
import { Trash2, Pencil, Plus, MoreVertical } from "lucide-react";
import GraduationCapIcon from "../icon";
import { useNavigate } from "react-router-dom";

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [playlist, setPlaylist] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [addingSessionToModuleId, setAddingSessionToModuleId] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  
  const menuRef = useRef(null);

  useEffect(() => {
    loadPlaylistData();
  }, [id]);

  const loadPlaylistData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch playlist basic info
      const playlistData = await fetchPlaylistById(id);
      setPlaylist(playlistData);
      
      // Fetch modules with sessions
      const modulesData = await fetchPlaylistModules(id);
      setModules(modulesData.modules || []);
    } catch (err) {
      console.error("Error loading playlist:", err);
      setError(err.message || "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (moduleData) => {
    try {
      const newModule = await createModule({
        ...moduleData,
        playlistId: id, // Use the playlist ID from URL params
      });
      
      // Reload modules to get the updated list
      await loadPlaylistData();
      setShowAddModuleModal(false);
    } catch (err) {
      console.error("Error creating module:", err);
      throw err; // Re-throw to let modal handle error display
    }
  };

  const handleEditModule = (moduleId) => {
    // Find the module data from the modules list
    const moduleToEdit = modules.find(
      (m) => (m.moduleId || m._id)?.toString() === moduleId.toString()
    );
    console.log("🔍 Editing module ID:", moduleId);
    console.log("📦 Module data found:", moduleToEdit);
    console.log("🏷️ Tags in module data:", moduleToEdit?.tags);
    setEditingModuleId({ id: moduleId, data: moduleToEdit });
    setOpenMenuId(null); // Close the menu
  };

  const handleUpdateModule = async () => {
    // Reload modules to get the updated list
    await loadPlaylistData();
    setEditingModuleId(null);
  };

  const handleAddSession = (moduleId) => {
    setAddingSessionToModuleId(moduleId);
    setOpenMenuId(null); // Close the menu
    setShowAddSessionModal(true);
  };

  const handleCreateSession = async (sessionData) => {
    try {
      await createSession({
        ...sessionData,
        moduleId: addingSessionToModuleId,
        playlistId: id,
      });
      // Reload modules to get the updated list with new session
      await loadPlaylistData();
      setShowAddSessionModal(false);
      setAddingSessionToModuleId(null);
    } catch (err) {
      console.error("Error creating session:", err);
      throw err; // Re-throw to let modal handle error display
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module? This will also delete all sessions in this module.")) {
      return;
    }
    try {
      await deleteModule(moduleId);
      await loadPlaylistData();
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Failed to delete module. Please try again.");
    }
  };

  const handleEditSession = (session, moduleId) => {
    console.log("🔍 Editing session:", session);
    console.log("📦 Session data:", session);
    setEditingSessionId({ id: session.sessionId || session._id, data: session, moduleId });
  };

  const handleUpdateSession = async () => {
    // Reload modules to get the updated list
    await loadPlaylistData();
    setEditingSessionId(null);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) {
      return;
    }
    try {
      await deleteSession(sessionId);
      await loadPlaylistData();
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Failed to delete session. Please try again.");
    }
  };

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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading playlist details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading playlist</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadPlaylistData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Playlist not found</p>
      </div>
    );
  }

  // Prepare playlist data for sidebar (matching expected format)
  const playlistForSidebar = {
    ...playlist,
    modules: modules.map((m) => ({
      id: m.moduleId || m._id,
      title: m.title,
      sessions: m.sessions || [],
    })),
  };

  // Build breadcrumb items
  const breadcrumbItems = playlist ? [
    {
      label: playlist.title,
      to: null, // Current page
    },
  ] : [];

  return (
    <div className="p-8 flex flex-col lg:flex-row gap-6">
      {/* LEFT SECTION */}
      <div className="flex-1">
        <LmsHeader />

        <div className="mt-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
          {playlist.title} Playlist
        </h1>
        </div>

        <button
          onClick={() => setShowAddModuleModal(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">+</span>
          Add Module
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-600">Topics</h2>
          <button className="border px-4 py-1 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Re-order topics
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">No modules found in this playlist</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add Your First Module
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => {
              const moduleId = module.moduleId || module._id;
              const moduleSessions = module.sessions || [];
              
              return (
                <div key={moduleId} className="relative">
                  {/* MODULE HEADER */}
                  <div
                    onClick={() => toggleModule(moduleId)}
                    className="cursor-pointer bg-blue-100 rounded-xl px-6 py-4 flex justify-between items-center hover:bg-blue-200 transition-colors"
                  >
                    <p className="font-medium">• {module.title}</p>

                    {/* 3 DOT BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(moduleId);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* 3 DOT MENU */}
                  {openMenuId === moduleId && (
                    <div
                      ref={menuRef}
                      className="absolute right-4 top-14 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 w-48 overflow-hidden"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(moduleId);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 text-gray-700 transition-colors border-b border-gray-100"
                      >
                        <Pencil size={16} className="text-blue-600" /> 
                        <span className="font-medium">Edit Module</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSession(moduleId);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-green-50 text-gray-700 transition-colors border-b border-gray-100"
                      >
                        <Plus size={16} className="text-green-600" /> 
                        <span className="font-medium">Add Session</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(moduleId);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" /> 
                        <span className="font-medium">Delete Module</span>
                      </button>
                    </div>
                  )}

                  {/* SESSIONS */}
                  {openModuleId === moduleId && (
                    <div className="mt-3 w-full space-y-3">
                      {moduleSessions.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
                          No sessions in this module
                        </div>
                      ) : (
                        // Sort sessions by order field (sessions without order go to the end)
                        [...moduleSessions]
                          .sort((a, b) => {
                            const orderA = a.order !== undefined && a.order !== null ? parseInt(a.order) : 999999;
                            const orderB = b.order !== undefined && b.order !== null ? parseInt(b.order) : 999999;
                            if (orderA !== orderB) {
                              return orderA - orderB;
                            }
                            // If order is the same, sort by creation date (older first for consistency)
                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                            return dateA - dateB;
                          })
                          .map((session) => {
                            const sessionId = session.sessionId || session._id;
                            return (
                            <div
                              key={sessionId}
                              className="flex justify-between text-sm items-center border-2 border-gray-300 rounded-xl p-3 bg-white hover:border-blue-400 hover:shadow-md transition-all"
                            >
                              <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => navigate(`/lmsDashboard/playlists/${id}/session/${sessionId}`)}
                              >
                                <p className="font-medium flex gap-2 items-center">
                                  <GraduationCapIcon size={22} color="#000000" />
                                  {session.order !== undefined && session.order !== null && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-normal">
                                      #{session.order}
                                    </span>
                                  )}
                                  {session.title}
                                </p>
                                {session.createdAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Posted on: {formatDate(session.createdAt)}
                                  </p>
                                )}
                                {session.description && (
                                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                    {session.description}
                                  </p>
                                )}
                                
                              </div>

                              <div className="flex sm:flex-row gap-2 ml-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSession(session, moduleId);
                                  }}
                                  className="border cursor-pointer border-gray-400 flex gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium"
                                >
                                  <Pencil size={12} /> Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(sessionId);
                                  }}
                                  className="border cursor-pointer border-gray-400 flex gap-2 px-3 py-2 rounded text-xs text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-medium"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-[320px] space-y-6">
        <PlaylistInfoSidebar playlist={playlistForSidebar} />
        <RightActivitySidebar />
      </div>

      {/* ADD MODULE MODAL */}
      {showAddModuleModal && (
        <AddModuleModal
          onClose={() => setShowAddModuleModal(false)}
          onAdd={handleAddModule}
          playlistId={id}
        />
      )}

      {/* EDIT MODULE MODAL */}
      {editingModuleId && (
        <EditModuleModal
          onClose={() => setEditingModuleId(null)}
          onUpdate={handleUpdateModule}
          moduleId={editingModuleId.id || editingModuleId}
          playlistId={id}
          moduleData={editingModuleId.data}
        />
      )}

      {/* ADD SESSION MODAL */}
      {showAddSessionModal && addingSessionToModuleId && (
        <AddSessionModal
          onClose={() => {
            setShowAddSessionModal(false);
            setAddingSessionToModuleId(null);
          }}
          onAdd={handleCreateSession}
          moduleId={addingSessionToModuleId}
          playlistId={id}
        />
      )}

      {/* EDIT SESSION MODAL */}
      {editingSessionId && (
        <EditSessionModal
          onClose={() => setEditingSessionId(null)}
          onUpdate={handleUpdateSession}
          sessionId={editingSessionId.id || editingSessionId}
          moduleId={editingSessionId.moduleId}
          playlistId={id}
          sessionData={editingSessionId.data}
        />
      )}
    </div>
  );
}
