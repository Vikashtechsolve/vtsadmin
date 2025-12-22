import { Link } from "react-router-dom";
import { playlists } from "../API/playlistsData";
import LmsHeader from "../LmsHeader";
import RightActivitySidebar from "../RightActivitySidebar";

export default function Playlists() {
  return (
   <div className="flex flex-col xl:flex-row w-full min-h-screen bg-gray-50">

      {/* CENTER */}
      <div className="flex-1 px-6 py-6 w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-6">
          <LmsHeader />
        </div>

        <h1 className="text-2xl font-semibold text-red-600  mb-6">Playlists</h1>
        <hr className="mb-6 border-gray-300" />

        {/* TABLE SCROLL WRAPPER (ONLY TABLE SCROLLS) */}
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            {/* TABLE */}
            <div className="min-w-[720px] max-w-2xl mx-auto bg-[#F4F7FA] rounded-xl border border-gray-300 overflow-hidden">
              {/* HEADER ROW */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] text-center text-gray-800 font-medium bg-[#F1F5F9]">
                <div className="p-4 border-r border-b border-gray-300">
                  Playlists Added
                </div>
                <div className="p-4 border-r border-b border-gray-300">
                  Total Modules
                </div>
                <div className="p-4 border-r border-b border-gray-300">
                  Sessions
                </div>
                <div className="p-4 border-b border-gray-300"></div>
              </div>

              {/* BODY */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] text-center text-sm text-gray-400">
                {/* COLUMN 1 */}
                <div className="border-r border-gray-300">
                  {playlists.map((p) => (
                    <p key={p.id} className="px-4 py-3">
                      {p.title}
                    </p>
                  ))}

                  <div className="px-4 py-4">
                    <button className="flex items-center gap-2 bg-white shadow rounded-lg px-4 py-2 text-sm">
                      <span className="text-red-500 text-lg">+</span>
                      Add Playlist
                    </button>
                  </div>
                </div>

                {/* COLUMN 2 */}
                <div className="border-r border-gray-300">
                  {playlists.map((p) => (
                    <p key={p.id} className="px-4 py-3 underline">
                      {p.modules.length} modules
                    </p>
                  ))}
                </div>

                {/* COLUMN 3 */}
                <div className="border-r border-gray-300">
                  {playlists.map((p) => (
                    <p key={p.id} className="px-4 py-3 underline">
                      {p.sessions} sessions
                    </p>
                  ))}
                </div>

                {/* COLUMN 4 */}
                <div>
                  {playlists.map((p) => (
                    <Link
                      key={p.id}
                      to={`/lmsDashboard/Playlists/${p.id}`}
                      className="block px-4 py-3 text-blue-600 hover:underline"
                    >
                      view playlist
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
<div className="w-full xl:w-[320px] px-4 py-6 order-2 xl:order-none">
  <RightActivitySidebar />
</div>

    </div>
  );
}
