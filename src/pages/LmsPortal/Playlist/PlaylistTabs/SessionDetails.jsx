import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchSessionDetails } from "../../API/sessionApi";
import { fetchPlaylistById } from "../../API/playlistApi";
import { fetchModuleById } from "../../API/moduleApi";
import LmsHeader from "../../LmsHeader";
import PlaylistTabs from "../PlaylistTabs/PlaylistTabs";
import TabRenderer from "../PlaylistTabs/TabRenderer";
import RightActivitySidebar from "../../RightActivitySidebar";
import PlaylistInfoSidebar from "../PlaylistInfoSidebar";
import Breadcrumb from "../Breadcrumb";

export default function SessionDetails() {
  const { sid } = useParams();
  const [activeTab, setActiveTab] = useState("videos");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (sid) {
      loadSessionDetails();
    }
  }, [sid]);

  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await fetchSessionDetails(sid);
      setSession(sessionData);

      // Fetch playlist and module names for breadcrumb
      if (sessionData.playlistId) {
        try {
          const playlistData = await fetchPlaylistById(sessionData.playlistId);
          setPlaylist(playlistData);
        } catch (err) {
          console.error("Error loading playlist:", err);
        }
      }

      if (sessionData.moduleId) {
        try {
          const moduleData = await fetchModuleById(sessionData.moduleId);
          setModule(moduleData);
        } catch (err) {
          console.error("Error loading module:", err);
        }
      }
    } catch (err) {
      console.error("Error loading session:", err);
      setError(err.message || "Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading session details...</div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="px-8 py-6">
        <p className="p-8 text-red-600">
          {error || "Session not found"}
        </p>
      </div>
    );
  }

  // Build breadcrumb items
  const breadcrumbItems = [];
  if (playlist) {
    breadcrumbItems.push({
      label: playlist.title,
      to: `/lmsDashboard/Playlists/${playlist._id || playlist.id}`,
    });
  }
  if (module) {
    breadcrumbItems.push({
      label: module.title,
      to: playlist ? `/lmsDashboard/Playlists/${playlist._id || playlist.id}` : null,
    });
  }
  if (session) {
    breadcrumbItems.push({
      label: session.title,
      to: null, // Current page
    });
  }

  return (
    <div className="px-8 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <LmsHeader />

          <div className="mt-8">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              {session.title}
          </h1>
            {session.description && (
              <p className="text-gray-600 text-sm">{session.description}</p>
            )}
          </div>

          <div className="mt-6">
            <PlaylistTabs onTabChange={setActiveTab} />
          </div>

          <div className="mt-6">
              <TabRenderer
                activeTab={activeTab}
                session={session}
              onRefresh={loadSessionDetails}
              />
          </div>
        </div>

        <div className="w-[320px] shrink-0 space-y-6 sticky top-6 h-fit">
          <RightActivitySidebar />
        </div>
      </div>
    </div>
  );
}
