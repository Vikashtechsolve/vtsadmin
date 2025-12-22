export default function PlaylistInfoSidebar({ playlist }) {
  const totalModules = playlist.modules.length;

  const totalSessions = playlist.modules.reduce(
    (acc, module) => acc + module.sessions.length,
    0
  );

  // Future ready (API se aa sakta hai)
  const totalNotesUploaded = playlist.modules.reduce(
    (acc, module) => acc + module.sessions.length * 2,
    0
  );

  return (
    <div className="w-full bg-[#F7F8FA] rounded-2xl p-6 h-96 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Playlist Info</h2>

      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="text-red-600 font-medium">
          {playlist.title}
        </h3>

        <p className="text-sm">
          <span className="font-medium">Total Modules :</span>{" "}
          {String(totalModules).padStart(2, "0")}
        </p>

        <p className="text-sm">
          <span className="font-medium">Total Sessions :</span>{" "}
          {String(totalSessions).padStart(2, "0")}
        </p>

        <p className="text-sm">
          <span className="font-medium">
            Total Sessions Notes Uploaded :
          </span>{" "}
          {totalNotesUploaded}
        </p>
      </div>
    </div>
  );
}
