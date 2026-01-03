import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, ListVideo, Clock, BookOpen } from "lucide-react";
import { fetchPlaylists, createPlaylist } from "../API/playlistApi";
import AddPlaylistModal from "./AddPlaylistModal";

const PlaylistsSection = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlaylists({ limit: 6 }); // Get first 6 playlists
      setPlaylists(data || []);
    } catch (err) {
      console.error("Error loading playlists:", err);
      setError("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaylist = async (playlistData) => {
    try {
      const newPlaylist = await createPlaylist(playlistData);
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.error("Error creating playlist:", err);
      throw err; // Re-throw to let modal handle error display
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center px-6 py-4 justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            Recently Added Playlists
          </h2>
          <button 
            onClick={() => navigate("/lmsDashboard/Playlists")}
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Manage Playlists
          </button>
        </div>

        {/* Playlists Grid */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading playlists...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : playlists.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No playlists found</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Playlist
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id || playlist.id}
                  onClick={() => navigate(`/lmsDashboard/Playlists/${playlist._id || playlist.id}`)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Thumbnail */}
                  
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {playlist.title}
                    </h3>
                    {playlist.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{playlist.modulesCount || playlist.modules?.length || 0} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(playlist.totalDurationSeconds || 0)}</span>
                      </div>
                    </div>
                  
                  </div>
                </div>
              ))}
              
              {/* Add Playlist Card */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 p-8 hover:bg-gray-100 hover:border-blue-400 transition-colors min-h-[200px]"
              >
                <Plus className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Add New Playlist</span>
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <AddPlaylistModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddPlaylist}
          />
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/lmsDashboard/Playlists")}
          className="flex items-center gap-2 px-5 py-2 bg-[#F2F2F2] rounded-lg shadow-lg hover:bg-gray-50"
        >
          Manage Playlist
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </>
  );
};

export default PlaylistsSection;
