import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { fetchPlaylists, addPlaylist } from "../API/playlistApi";
import AddPlaylistModal from "./AddPlaylistModal";

const PlaylistsSection = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists().then(setPlaylists);
  }, []);

  const handleAddPlaylist = async (name) => {
    const newPlaylist = await addPlaylist(name);
    setPlaylists((prev) => [...prev, newPlaylist]);
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-gray-100 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="font-semibold mt-4 text-gray-800">
            Recently Added Playlists
          </h2>
          <button className="text-blue-600 underline text-sm">
            Edit Playlist
          </button>
        </div>

        {/* 👇 MOBILE SCROLL WRAPPER */}
        {/* Playlists */}
<div className="overflow-x-auto md:overflow-visible scrollbar-hide">
  <div
    className="
      grid
      grid-flow-col
      auto-cols-[150px]

      md:grid-flow-row
      md:auto-cols-auto
      md:grid-cols-3
      lg:grid-cols-6

      border
      rounded-lg
    "
  >
    {playlists.map((item) => (
      <div
        key={item.id}
        className="
          p-4
          text-xs
          text-gray-500
          border-r
          border-b
          flex
          items-center
          justify-center
          text-center
          bg-gray-50
        "
      >
        {item.name}
      </div>
    ))}

    {/* Add Playlist */}
    <button
      onClick={() => setShowModal(true)}
      className="
       flex items-center justify-center bg-gray-50 broder shadow-lg gap-2  h-10 mt-5 rounded-lg px-1 m-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointe
      "
    >
      <Plus className="w-4 h-4 text-red-600" />
      Add Playlist
    </button>
  </div>
</div>


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
          <ArrowRight className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </>
  );
};

export default PlaylistsSection;
