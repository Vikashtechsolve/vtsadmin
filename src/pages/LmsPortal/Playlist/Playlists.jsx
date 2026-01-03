import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { fetchPlaylists, createPlaylist, deletePlaylist } from "../API/playlistApi";
import LmsHeader from "../LmsHeader";
import RightActivitySidebar from "../RightActivitySidebar";
import AddPlaylistModal from "./AddPlaylistModal";
import EditPlaylistModal from "./EditPlaylistModal";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlaylists();
      setPlaylists(data || []);
    } catch (err) {
      console.error("Error loading playlists:", err);
      setError("Failed to load playlists. Please try again.");
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
      throw err;
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }
    try {
      await deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (err) {
      console.error("Error deleting playlist:", err);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  const handleUpdatePlaylist = async () => {
    await loadPlaylists();
    setEditingPlaylistId(null);
  };

  return (
   <div className="flex flex-col xl:flex-row w-full min-h-screen bg-gray-50">
      {/* CENTER */}
      <div className="flex-1 px-6 py-6 w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-6">
          <LmsHeader />
        </div>

        <h1 className="text-2xl font-semibold text-red-600 mb-6">Playlists</h1>
        <hr className="mb-6 border-gray-300" />

        {/* ERROR STATE */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* TABLE SCROLL WRAPPER (ONLY TABLE SCROLLS) */}
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            {/* TABLE */}
            <div className="min-w-[720px] max-w-4xl mx-auto bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
              {/* HEADER ROW */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] text-center text-gray-800 font-semibold bg-gradient-to-r from-red-50 to-red-100 border-b-2 border-gray-200">
                <div className="p-4 border-r-2 border-gray-200 text-red-700">
                  Playlists Added
                </div>
                <div className="p-4 border-r-2 border-gray-200 text-red-700">
                  Total Modules
                </div>
                <div className="p-4 border-r-2 border-gray-200 text-red-700">
                  Duration
                </div>
                <div className="p-4 text-red-700">Actions</div>
              </div>

              {/* BODY */}
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-2">Loading playlists...</p>
                </div>
              ) : playlists.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg mb-2">No playlists found</p>
                  <p className="text-sm">Create your first playlist!</p>
                </div>
              ) : (
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] text-center text-sm">
                  {/* COLUMN 1 - Playlist Titles */}
                  <div className="border-r-2 border-gray-200">
                    {playlists.map((p, index) => (
                      <div
                        key={p._id || p.id}
                        className={`px-4 py-4 border-b border-gray-100 hover:bg-red-50 transition-colors duration-150 min-h-[60px] flex items-center ${
                          index === playlists.length - 1 ? 'border-b-2 border-gray-200' : ''
                        }`}
                      >
                        <Link
                          to={`/lmsDashboard/Playlists/${p._id || p.id}`}
                          className="block text-gray-700 hover:text-red-700 transition-colors duration-150 flex-1"
                      >
                        <span className="font-medium">{p.title}</span>
                      </Link>
                      </div>
                  ))}
                    <div className="px-4 py-4 border-t-2 border-gray-200">
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md rounded-lg px-4 py-2.5 text-sm hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
                      >
                        <span className="text-lg">+</span>
                      Add Playlist
                    </button>
                  </div>
                </div>

                  {/* COLUMN 2 - Modules Count */}
                  <div className="border-r-2 border-gray-200">
                    {playlists.map((p, index) => (
                      <div
                        key={p._id || p.id}
                        className={`px-4 py-4 text-gray-600 border-b border-gray-100 min-h-[60px] flex items-center justify-center ${
                          index === playlists.length - 1 ? 'border-b-2 border-gray-200' : ''
                        }`}
                      >
                        <span className="font-medium text-blue-600">
                          {p.modulesCount || p.modules?.length || 0}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">modules</span>
                      </div>
                  ))}
                    <div className="px-4 py-4 border-t-2 border-gray-200"></div>
                </div>

                  {/* COLUMN 3 - Duration */}
                  <div className="border-r-2 border-gray-200">
                    {playlists.map((p, index) => {
                      const durationSeconds = p.totalDurationSeconds || 0;
                      const hours = Math.floor(durationSeconds / 3600);
                      const minutes = Math.floor((durationSeconds % 3600) / 60);
                      const durationText =
                        hours > 0
                          ? `${hours}h ${minutes}m`
                          : `${minutes}m`;
                      return (
                        <div
                          key={p._id || p.id}
                          className={`px-4 py-4 text-gray-600 border-b border-gray-100 min-h-[60px] flex items-center justify-center ${
                            index === playlists.length - 1 ? 'border-b-2 border-gray-200' : ''
                          }`}
                        >
                          <span className="font-medium text-green-600">{durationText}</span>
                        </div>
                      );
                    })}
                    <div className="px-4 py-4 border-t-2 border-gray-200"></div>
                </div>

                  {/* COLUMN 4 - Actions */}
                <div>
                    {playlists.map((p, index) => (
                      <div
                        key={p._id || p.id}
                        className={`px-4 py-4 flex items-center justify-center gap-2 border-b border-gray-100 min-h-[60px] ${
                          index === playlists.length - 1 ? 'border-b-2 border-gray-200' : ''
                        }`}
                      >
                    <Link
                          to={`/lmsDashboard/Playlists/${p._id || p.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium transition-colors duration-150 whitespace-nowrap"
                          title="View"
                    >
                          View
                    </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingPlaylistId(p._id || p.id);
                          }}
                          className="text-green-600 hover:text-green-800 hover:underline text-xs font-medium transition-colors duration-150 flex items-center gap-1 whitespace-nowrap"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeletePlaylist(p._id || p.id)}
                          className="text-red-600 hover:text-red-800 hover:underline text-xs font-medium transition-colors duration-150 whitespace-nowrap"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <div className="px-4 py-4 border-t-2 border-gray-200"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
<div className="w-full xl:w-[320px] px-4 py-6 order-2 xl:order-none">
  <RightActivitySidebar />
</div>

      {/* ADD PLAYLIST MODAL */}
      {showModal && (
        <AddPlaylistModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddPlaylist}
        />
      )}

      {/* EDIT PLAYLIST MODAL */}
      {editingPlaylistId && (
        <EditPlaylistModal
          playlistId={editingPlaylistId}
          onClose={() => setEditingPlaylistId(null)}
          onUpdate={handleUpdatePlaylist}
        />
      )}
    </div>
  );
}
