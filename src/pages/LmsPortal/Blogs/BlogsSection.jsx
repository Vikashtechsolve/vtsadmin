import { Link } from "react-router-dom";
import { playlists } from "../API/playlistsData";
import RightActivitySidebar from "../RightActivitySidebar";

export default function BlogsSection() {
  return (
    <div className="p-8 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
      <h1 className="text-2xl font-semibold text-red-600 mb-6">
        Blogs
      </h1>

      <div className="bg-slate-50 border rounded-xl p-6">
        <div className="grid grid-cols-4 font-medium text-gray-700 border-b pb-3 mb-4">
          <p>Blogs Added</p>
          <p>Total Modules</p>
          <p>Sessions</p>
          <p></p>
        </div>

        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="grid grid-cols-4 items-center py-3 text-gray-600"
          >
            <p>{playlist.title}</p>
            <p className="underline">
              {playlist.modules.length} modules
            </p>
            <p className="underline">
              {playlist.sessions} sessions
            </p>
            <Link
              to={`/lmsDashboard/Playlists/${playlist.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              view playlist
            </Link>
          </div>
        ))}

        <button className="mt-6 flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg text-sm">
          <span className="text-red-500 text-lg">+</span>
          Add Playlist
        </button>
      </div>
      </div>
       <div className="w-full lg:w-[320px] order-2 lg:order-none">
        <RightActivitySidebar />
      </div>
    </div>
  );
}
